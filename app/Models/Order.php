<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable([
    'order_number',
    'buyer_id',
    'market_id',
    'assigned_joki_id',
    'master_checklist_id',
    'status',
    'estimated_amount',
    'actual_amount',
    'refund_amount',
    'additional_payment'
])]
class Order extends Model
{
    use HasFactory;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = 'PA-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estimated_amount' => 'integer',
            'actual_amount' => 'integer',
            'refund_amount' => 'integer',
            'additional_payment' => 'integer',
        ];
    }

    /**
     * Get the buyer user who placed this order.
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Get the market associated with this order.
     */
    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    /**
     * Get the joki user assigned to this order.
     */
    public function joki()
    {
        return $this->belongsTo(User::class, 'assigned_joki_id');
    }

    /**
     * Get the master checklist grouping this order.
     */
    public function masterChecklist()
    {
        return $this->belongsTo(MasterChecklist::class, 'master_checklist_id');
    }

    /**
     * Get the items in this order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the receipts uploaded for this order.
     */
    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }
}
