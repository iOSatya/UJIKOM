<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

// --- PUBLIC ROUTES (Tidak butuh login) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);      // List Produk
Route::get('/products/{id}', [ProductController::class, 'show']);  // Detail Produk

// --- PROTECTED ROUTES (Butuh Token Login) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Order Routes
    Route::post('/orders', [OrderController::class, 'store']);     // Checkout
    Route::get('/orders', [OrderController::class, 'index']);      // History
    Route::get('/orders/{id}', [OrderController::class, 'show']);  // Invoice
});