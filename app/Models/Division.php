<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\EntitePrefecture;
use App\Models\Service;

class Division extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'entite_prefecture_id'];

    public function entitePrefecture()
    {
        return $this->belongsTo(EntitePrefecture::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
