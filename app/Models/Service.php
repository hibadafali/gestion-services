<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Division;
use App\Models\Demande;
use App\Models\Indicateur;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'division_id'];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }

    public function indicateurs()
    {
        return $this->hasMany(Indicateur::class);
    }
}
