<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Division;

class EntitePrefecture extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }
}