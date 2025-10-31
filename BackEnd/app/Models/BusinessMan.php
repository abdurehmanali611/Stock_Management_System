<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Business;
use Illuminate\Foundation\Auth\User as Authenticatable;

class BusinessMan extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\BusinessMenFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    public function business() {
        return $this->hasMany(Business::class);
    }

    protected $table = 'business_men';
}
