<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportPdf extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'chemin_fichier', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
