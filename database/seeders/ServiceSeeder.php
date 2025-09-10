<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Division;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        // Structure complète des services selon l'organigramme de la Préfecture de Marrakech
        $services = [
            // Services de la Division des collectivités territoriales (DCT)
            [
                'nom' => 'Service des Communes',
                'description' => 'Gestion et suivi des communes urbaines et rurales',
                'division_nom' => 'Division des collectivités territoriales (DCT)',
            ],
            [
                'nom' => 'Service des Provinces',
                'description' => 'Coordination avec les services provinciaux',
                'division_nom' => 'Division des collectivités territoriales (DCT)',
            ],
            [
                'nom' => 'Service de Coopération Décentralisée',
                'description' => 'Partenariats et coopération entre collectivités',
                'division_nom' => 'Division des collectivités territoriales (DCT)',
            ],

            // Services de la Division des Ressources Humaines et des généraux (DRHG)
            [
                'nom' => 'Service du Personnel',
                'description' => 'Gestion du personnel et carrières administratives',
                'division_nom' => 'Division des Ressources Humaines et des généraux (DRHG)',
            ],
            [
                'nom' => 'Service de Formation',
                'description' => 'Formation continue et développement des compétences',
                'division_nom' => 'Division des Ressources Humaines et des généraux (DRHG)',
            ],
            [
                'nom' => 'Service des Affaires Générales',
                'description' => 'Courrier, archives et affaires administratives générales',
                'division_nom' => 'Division des Ressources Humaines et des généraux (DRHG)',
            ],
            [
                'nom' => 'Service de la Logistique',
                'description' => 'Gestion logistique et approvisionnements',
                'division_nom' => 'Division des Ressources Humaines et des généraux (DRHG)',
            ],

            // Services de la Division du Budget et des marchés (DBM)
            [
                'nom' => 'Service du Budget',
                'description' => 'Préparation et suivi budgétaire',
                'division_nom' => 'Division du Budget et des marchés (DBM)',
            ],
            [
                'nom' => 'Service des Marchés Publics',
                'description' => 'Gestion des marchés publics et appels d\'offres',
                'division_nom' => 'Division du Budget et des marchés (DBM)',
            ],
            [
                'nom' => 'Service de la Comptabilité',
                'description' => 'Comptabilité et gestion financière',
                'division_nom' => 'Division du Budget et des marchés (DBM)',
            ],

            // Services de la Division des systèmes d'information de communication et de gestion (DSICG)
            [
                'nom' => 'Service Informatique',
                'description' => 'Maintenance et développement des systèmes informatiques',
                'division_nom' => 'Division des systèmes d\'information de communication et de gestion (DSICG)',
            ],
            [
                'nom' => 'Service Communication',
                'description' => 'Communication institutionnelle et relations publiques',
                'division_nom' => 'Division des systèmes d\'information de communication et de gestion (DSICG)',
            ],
            [
                'nom' => 'Service de Gestion des Données',
                'description' => 'Gestion des bases de données et archivage numérique',
                'division_nom' => 'Division des systèmes d\'information de communication et de gestion (DSICG)',
            ],

            // Services de la Division du Développement Rural (DDR)
            [
                'nom' => 'Service de l\'Agriculture',
                'description' => 'Soutien et développement agricole',
                'division_nom' => 'Division du Développement Rural (DDR)',
            ],
            [
                'nom' => 'Service de l\'Élevage',
                'description' => 'Développement de l\'élevage et santé animale',
                'division_nom' => 'Division du Développement Rural (DDR)',
            ],
            [
                'nom' => 'Service des Projets Ruraux',
                'description' => 'Coordination des projets de développement rural',
                'division_nom' => 'Division du Développement Rural (DDR)',
            ],
            [
                'nom' => 'Service des Coopératives',
                'description' => 'Encadrement des coopératives agricoles',
                'division_nom' => 'Division du Développement Rural (DDR)',
            ],

            // Services de la Division d'urbanisme et de l'environnement (DUE)
            [
                'nom' => 'Service de l\'Urbanisme',
                'description' => 'Planification urbaine et autorisations de construire',
                'division_nom' => 'Division d\'urbanisme et de l\'environnement (DUE)',
            ],
            [
                'nom' => 'Service de l\'Environnement',
                'description' => 'Protection environnementale et études d\'impact',
                'division_nom' => 'Division d\'urbanisme et de l\'environnement (DUE)',
            ],
            [
                'nom' => 'Service de l\'Aménagement du Territoire',
                'description' => 'Aménagement territorial et schémas directeurs',
                'division_nom' => 'Division d\'urbanisme et de l\'environnement (DUE)',
            ],

            // Services de la Division des équipements (DE)
            [
                'nom' => 'Service des Infrastructures',
                'description' => 'Gestion et maintenance des infrastructures publiques',
                'division_nom' => 'Division des équipements (DE)',
            ],
            [
                'nom' => 'Service des Équipements Publics',
                'description' => 'Gestion des équipements collectifs',
                'division_nom' => 'Division des équipements (DE)',
            ],
            [
                'nom' => 'Service de la Maintenance',
                'description' => 'Maintenance préventive et curative des équipements',
                'division_nom' => 'Division des équipements (DE)',
            ],

            // Services de la Division de l'Action Sociale (DAS)
            [
                'nom' => 'Service de l\'Aide Sociale',
                'description' => 'Aide et assistance aux populations vulnérables',
                'division_nom' => 'Division de l\'Action Sociale (DAS)',
            ],
            [
                'nom' => 'Service des Programmes Sociaux',
                'description' => 'Coordination des programmes d\'aide sociale',
                'division_nom' => 'Division de l\'Action Sociale (DAS)',
            ],
            [
                'nom' => 'Service de la Solidarité',
                'description' => 'Actions de solidarité et d\'entraide communautaire',
                'division_nom' => 'Division de l\'Action Sociale (DAS)',
            ],
        ];

        foreach ($services as $serviceData) {
            // Récupérer l'ID de la division correspondante
            $division = Division::where('nom', $serviceData['division_nom'])->first();
            
            if ($division) {
                Service::firstOrCreate(
                    ['nom' => $serviceData['nom']], 
                    [
                        'nom' => $serviceData['nom'],
                        'description' => $serviceData['description'],
                        'division_id' => $division->id,
                    ]
                );
            }
        }

        $this->command->info('Services complets de toutes les divisions créés selon l\'organigramme officiel !');
    }
}
