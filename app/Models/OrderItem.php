<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['order_id', 'product_name', 'quantity', 'notes'])]
class OrderItem extends Model
{
    use HasFactory;

    /**
     * Get the order associated with this item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
