<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'type',        // ✅ Ce champ est maintenant inclus
        'valeurs',
        'mois',
        'annee',
        'service_id'
    ];

    // Cast automatique JSON sur la colonne "valeurs"
    protected $casts = [
        'valeurs' => 'array', // <= très important !
    ];

    /**
     * Relation avec le modèle Service
     * Un indicateur appartient à un service
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Accéder au nom du service
     */
    public function getServiceNameAttribute()
    {
        return $this->service->nom ?? null;
    }

    /**
     * Accéder au nom de la division via le service
     */
    public function getDivisionNameAttribute()
    {
        return $this->service->division->nom ?? null;
    }

    /**
     * Récupérer la valeur d'une année
     */
    public function valeurParAnnee($annee, $mois = null)
    {
        $h = $this->valeurs['history'] ?? [];
        foreach ($h as $item) {
            if ($item['annee'] == $annee && ($mois === null || (isset($item['mois']) && $item['mois'] == $mois))) {
                return $item['valeur'];
            }
        }
        return null;
    }
}

