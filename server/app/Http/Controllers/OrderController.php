<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Checkout (Membuat Pesanan Baru)
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            // Gunakan Transaction agar data konsisten (jika gagal, rollback semua)
            return DB::transaction(function () use ($request) {
                $user = $request->user();
                $totalPrice = 0;
                $orderItemsData = [];

                // 1. Hitung total harga & siapkan data item
                foreach ($request->items as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    
                    // Cek stok (Opsional: bisa ditambahkan validasi stok di sini)
                    
                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ];
                }

                // 2. Buat Record Order Utama
                $order = Order::create([
                    'user_id' => $user->id,
                    'invoice_number' => 'INV-' . time() . '-' . $user->id,
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);

                // 3. Simpan Detail Item ke OrderItem
                foreach ($orderItemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $data['product_id'],
                        'quantity' => $data['quantity'],
                        'price' => $data['price'],
                    ]);
                }

                return response()->json([
                    'message' => 'Pesanan berhasil dibuat',
                    'order' => $order->load('items.product') // Load relasi items & produk
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    // Menampilkan Detail Pesanan (Invoice)
    public function show(Request $request, $id)
    {
        // Pastikan user hanya bisa melihat order miliknya sendiri
        $order = Order::with('items.product')
                    ->where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->first();

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan atau akses ditolak'], 404);
        }

        return response()->json($order);
    }
    
    // Menampilkan Riwayat Pesanan User
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
                    
        return response()->json($orders);
    }
}