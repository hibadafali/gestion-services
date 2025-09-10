<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'type', // interne ou externe
        'division_id',
        'service_id',
        'pachalik_id',
        'annexe_id',
        'telephone',
        'adresse',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relations pour utilisateurs internes
    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    // Relations pour utilisateurs externes
    public function pachalik()
    {
        return $this->belongsTo(Pachalik::class);
    }

    public function annexe()
    {
        return $this->belongsTo(Annexe::class);
    }

    // Relations pour les demandes/commentaires
    public function demandes()
    {
        return $this->hasMany(Commentaire::class);
    }
}
