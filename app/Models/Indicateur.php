<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'type', 'valeurs', 'service_id'
     ];

    // valeurs stocké en JSON
    protected $casts = [
        'valeurs' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
