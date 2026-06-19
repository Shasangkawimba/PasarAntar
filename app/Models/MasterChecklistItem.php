<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['checklist_id', 'item_name', 'total_quantity'])]
class MasterChecklistItem extends Model
{
    use HasFactory;

    /**
     * Get the master checklist associated with this aggregated item.
     */
    public function checklist()
    {
        return $this->belongsTo(MasterChecklist::class, 'checklist_id');
    }
}
