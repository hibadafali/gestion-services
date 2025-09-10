<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReponseDemande extends Model
{
    use HasFactory;

    protected $fillable = ['contenu', 'demande_id', 'admin_id'];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
