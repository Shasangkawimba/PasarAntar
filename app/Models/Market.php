<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'address', 'is_active'])]
class Market extends Model
{
    use HasFactory;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(fn () => \Illuminate\Support\Facades\Cache::forget('markets:active'));
        static::deleted(fn () => \Illuminate\Support\Facades\Cache::forget('markets:active'));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the orders associated with this market.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the master checklists associated with this market.
     */
    public function masterChecklists()
    {
        return $this->hasMany(MasterChecklist::class);
    }
}
