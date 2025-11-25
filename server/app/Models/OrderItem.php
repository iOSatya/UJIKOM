<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
    ];

    // Relasi ke Order (Satu item milik satu order)
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relasi ke Product (Satu item adalah satu jenis produk)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}