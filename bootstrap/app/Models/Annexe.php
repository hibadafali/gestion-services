<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annexe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'pachalik_id',
        'code',
    ];

    // Relations
    public function pachalik()
    {
        return $this->belongsTo(Pachalik::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
