<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Division;
use App\Models\Service;
use App\Models\EntitePrefecture;

class DivisionWithServicesSeeder extends Seeder
{
    public function run()
    {
        $prefecture = EntitePrefecture::firstOrCreate([
    'nom' => 'Préfecture de Marrakech'
]);

        $data = [
            'Division des collectivités locales' => [
                'Service des conseils élus',
                'Service des finances locales et personnel',
                'Service du patrimoine, planification et programmation',
                'Service de contrôle de la gestion des services publics communaux',
                'Service de l’état civil',
            ],
            'Division des ressources humaines et des affaires générales' => [
                'Service des ressources humaines',
                'Service de la formation continue',
                'Service des moyens généraux et de la logistique',
            ],
            'Division du budget et des marchés' => [
                'Service du budget',
                'Service de la comptabilité',
                'Service des marchés',
            ],
            'Division des systèmes d’information et de communication et gestion' => [
                'Service des systèmes d’information et communication',
                'Service de contrôle de gestion',
            ],
            'Division du développement rural' => [
                'Service des terres collectives',
                'Service du développement rural',
            ],
            'Division des affaires économiques et de la coordination' => [
                'Service de planification économique et programmation',
                'Service de l’action économique et du contrôle',
                'Service des affaires touristiques et du transport',
                'Service de l’animation culturelle et sportive',
            ],
            'Division de l’urbanisme et de l’environnement' => [
                'Service de l’urbanisme et du contrôle des constructions',
                'Service de l’environnement',
                'Service de gestion des risques naturels',
            ],
            'Division des équipements' => [
                'Service des études techniques',
                'Service des équipements et infrastructures',
                'Service de la propreté de la ville',
            ],
            'Division de l’action sociale' => [
                'Service de la coordination sociale intersectorielle',
                'Service du suivi et évaluation',
                'Service de la communication',
                'Service de la formation et renforcement des capacités',
            ],
        ];

        foreach ($data as $divisionName => $services) {
            $division = Division::firstOrCreate([
                'nom' => $divisionName,
                'entite_prefecture_id' => $prefecture->id,
            ]);

            foreach ($services as $serviceName) {
                Service::firstOrCreate([
                    'nom' => $serviceName,
                    'division_id' => $division->id,
                ]);
            }
        }

        $this->command->info('Divisions et services insérés avec succès !');
    }
}
