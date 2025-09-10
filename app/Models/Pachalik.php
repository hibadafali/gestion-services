<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pachalik extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'code',
    ];

    // Relations
    public function annexes()
    {
        return $this->hasMany(Annexe::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
