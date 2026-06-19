<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['market_id', 'assigned_joki_id', 'status'])]
class MasterChecklist extends Model
{
    use HasFactory;

    /**
     * Get the market associated with this master checklist.
     */
    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    /**
     * Get the joki assigned to this master checklist.
     */
    public function joki()
    {
        return $this->belongsTo(User::class, 'assigned_joki_id');
    }

    /**
     * Get the items in this master checklist.
     */
    public function items()
    {
        return $this->hasMany(MasterChecklistItem::class, 'checklist_id');
    }

    /**
     * Get the orders aggregated under this master checklist.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'master_checklist_id');
    }
}
