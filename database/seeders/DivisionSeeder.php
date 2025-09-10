<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Division;

class DivisionSeeder extends Seeder
{
    public function run()
    {
        // Récupérer l'entité préfecture de Marrakech
        $prefecture = \App\Models\EntitePrefecture::firstOrCreate([
            'nom' => 'Préfecture de Marrakech'
        ], [
            'description' => 'Préfecture de la région de Marrakech-Safi'
        ]);

        // Structure exacte de l'organigramme de la Préfecture de Marrakech
        $divisions = [
            [
                'nom' => 'Division des collectivités territoriales (DCT)',
                'description' => 'Gestion des collectivités territoriales, communes, provinces et régions',
            ],
            [
                'nom' => 'Division des Ressources Humaines et des généraux (DRHG)',
                'description' => 'Gestion des ressources humaines, affaires générales et administratives',
            ],
            [
                'nom' => 'Division du Budget et des marchés (DBM)',
                'description' => 'Gestion budgétaire, marchés publics et finances de la préfecture',
            ],
            [
                'nom' => 'Division des systèmes d\'information de communication et de gestion (DSICG)',
                'description' => 'Systèmes d\'information, communication et gestion informatique',
            ],
            [
                'nom' => 'Division du Développement Rural (DDR)',
                'description' => 'Développement rural, agriculture et affaires rurales',
            ],
            [
                'nom' => 'Division d\'urbanisme et de l\'environnement (DUE)',
                'description' => 'Urbanisme, aménagement du territoire et protection de l\'environnement',
            ],
            [
                'nom' => 'Division des équipements (DE)',
                'description' => 'Gestion des équipements publics et infrastructures',
            ],
            [
                'nom' => 'Division de l\'Action Sociale (DAS)',
                'description' => 'Action sociale, aide aux populations et programmes sociaux',
            ],
        ];

        foreach ($divisions as $divisionData) {
            $divisionData['entite_prefecture_id'] = $prefecture->id;
            Division::firstOrCreate(
                ['nom' => $divisionData['nom']], 
                $divisionData
            );
        }

        $this->command->info('8 Divisions de la Préfecture de Marrakech créées selon l\'organigramme officiel !');
    }
}
