<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\EntitePrefecture;
use App\Models\Division;
use App\Models\Service;
use App\Models\Demande;
use App\Models\ReponseDemande;
use App\Models\Indicateur;
use App\Models\RapportPdf;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Ordre d'exécution des seeders
        $this->call([
            DivisionSeeder::class,
            ServiceSeeder::class,
            PachalikSeeder::class,
            AnnexeSeeder::class,
        ]);

        // Utilisateurs (admin, interne, externe)
        $admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'type' => 'admin',
        ]);
        $interne = User::create([
            'name' => 'Agent Interne',
            'email' => 'interne@prefecture.ma',
            'password' => Hash::make('interne123'),
            'is_admin' => false,
        ]);
        $externe = User::create([
            'name' => 'Agent Externe',
            'email' => 'externe@pachalik.ma',
            'password' => Hash::make('externe123'),
            'is_admin' => false,
        ]);

        // Entité Préfecture
        $prefecture = EntitePrefecture::create(['nom' => 'Préfecture Casablanca']);

        // Divisions
        $division1 = Division::create([
            'nom' => 'Division Administrative',
            'entite_prefecture_id' => $prefecture->id
        ]);
        $division2 = Division::create([
            'nom' => 'Division Sociale',
            'entite_prefecture_id' => $prefecture->id
        ]);

        // Services
        $service1 = Service::create([
            'nom' => 'Service Etat Civil',
            'division_id' => $division1->id
        ]);
        $service2 = Service::create([
            'nom' => 'Service Affaires Sociales',
            'division_id' => $division2->id
        ]);

        // Indicateurs
        $indicateur1 = Indicateur::create([
            'nom' => 'Nombre Actes Naissance',
            'type' => 'compteur',
            'valeurs' => json_encode([2024 => 1200]),
            'service_id' => $service1->id
        ]);
        $indicateur2 = Indicateur::create([
            'nom' => 'Aides Sociales Distribuées',
            'type' => 'montant',
            'valeurs' => json_encode([2024 => 50000]),
            'service_id' => $service2->id
        ]);

        // Demandes
        $demande1 = Demande::create([
            'objet' => 'Demande de document',
            'contenu' => 'Je souhaite obtenir un acte de naissance.',
            'service_id' => $service1->id,
            'user_id' => $externe->id,
        ]);
        $demande2 = Demande::create([
            'objet' => 'Demande d\'aide sociale',
            'contenu' => 'Je sollicite une aide sociale pour ma famille.',
            'service_id' => $service2->id,
            'user_id' => $interne->id,
        ]);

        // Réponses aux demandes
        ReponseDemande::create([
            'contenu' => 'Votre acte de naissance est prêt.',
            'demande_id' => $demande1->id,
            'admin_id' => $admin->id,
        ]);
        ReponseDemande::create([
            'contenu' => 'Votre demande d\'aide sociale est en cours de traitement.',
            'demande_id' => $demande2->id,
            'admin_id' => $admin->id,
        ]);

        // Rapports PDF
        RapportPdf::create([
            'titre' => 'Rapport Annuel Etat Civil',
            'chemin_fichier' => 'pdfs/rapport_etat_civil.pdf',
            'user_id' => $admin->id
        ]);
        RapportPdf::create([
            'titre' => 'Rapport Social 2024',
            'chemin_fichier' => 'pdfs/rapport_social_2024.pdf',
            'user_id' => $interne->id
        ]);
    }
}
