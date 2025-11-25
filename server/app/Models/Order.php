<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_number',
        'total_price',
        'status',
    ];

    // Relasi ke User (Order milik siapa)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke OrderItem (Order punya banyak item)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}