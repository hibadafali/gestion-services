<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

    protected $table = 'demandes'; // Utilise la table demandes existante

    protected $fillable = [
        'contenu',
        'type',
        'user_id',
        'service_demandeur_id',
        'service_destinataire_id',
        'parent_id',
        'statut',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceDemandeur()
    {
        return $this->belongsTo(Service::class, 'service_demandeur_id');
    }

    public function serviceDestinataire()
    {
        return $this->belongsTo(Service::class, 'service_destinataire_id');
    }

    public function parent()
    {
        return $this->belongsTo(Commentaire::class, 'parent_id');
    }

    public function reponses()
    {
        return $this->hasMany(Commentaire::class, 'parent_id');
    }

    // Scopes pour faciliter les requêtes
    public function scopeDemandes($query)
    {
        return $query->where('type', 'demande');
    }

    public function scopeReponses($query)
    {
        return $query->where('type', 'reponse');
    }
}
