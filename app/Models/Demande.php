<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Service;
use App\Models\User;
use App\Models\ReponseDemande;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = ['objet', 'contenu', 'service_id', 'user_id'];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reponse()
    {
        return $this->hasOne(ReponseDemande::class);
    }
}
