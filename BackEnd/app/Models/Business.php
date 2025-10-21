<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\BusinessMan;

class Business extends Model
{
    /** @use HasFactory<\Database\Factories\BusinessesFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'currency',
        'admin_name',
    ];

    public function businessMan() {
        return $this->belongsTo(BusinessMan::class);
    }
}
