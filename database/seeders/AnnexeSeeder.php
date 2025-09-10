<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Annexe;
use App\Models\Pachalik;

class AnnexeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Données officielles des Annexes de la Préfecture de Marrakech
        $annexes = [
            // Annexes du PACHALIK MEDINA GUELIZ
            [
                'nom' => 'A.A MEDINA',
                'description' => 'Annexe Administrative Médina',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-MED001',
            ],
            [
                'nom' => 'A.A GUELIZ',
                'description' => 'Annexe Administrative Gueliz',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-GUE001',
            ],
            [
                'nom' => 'A.A PACHALIK',
                'description' => 'Annexe Administrative Pachalik',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-PAC001',
            ],
            [
                'nom' => 'A.A VASOUIVETTE',
                'description' => 'Annexe Administrative Vasouivette',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-VAS001',
            ],
            [
                'nom' => 'A.A HIVERNAGE',
                'description' => 'Annexe Administrative Hivernage',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-HIV001',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS001',
            ],
            [
                'nom' => 'A.A DOUKKALA',
                'description' => 'Annexe Administrative Doukkala',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DOU001',
            ],
            [
                'nom' => 'A.A RUE ESSALAM',
                'description' => 'Annexe Administrative Rue Essalam',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-ESS001',
            ],
            [
                'nom' => 'A.A MEDINA',
                'description' => 'Annexe Administrative Médina',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-MED002',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS002',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS003',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS004',
            ],
            [
                'nom' => 'A.A MASSIRA',
                'description' => 'Annexe Administrative Massira',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-MAS001',
            ],
            [
                'nom' => 'A.A SIDI GHANEM',
                'description' => 'Annexe Administrative Sidi Ghanem',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-SGH001',
            ],
            [
                'nom' => 'A.A JEMAA LEFNA',
                'description' => 'Annexe Administrative Jemaa Lefna',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-JLF001',
            ],
            [
                'nom' => 'A.A BAB DOUKKALA',
                'description' => 'Annexe Administrative Bab Doukkala',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-BDK001',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS005',
            ],
            [
                'nom' => 'A.A SYA NOUR',
                'description' => 'Annexe Administrative Sya Nour',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-SYN001',
            ],
            [
                'nom' => 'A.A SIDI GHANEM',
                'description' => 'Annexe Administrative Sidi Ghanem',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-SGH002',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS006',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS007',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS008',
            ],
            [
                'nom' => 'A.A ANNAKHIL GOLF',
                'description' => 'Annexe Administrative Annakhil Golf',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-ANG001',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS009',
            ],
            [
                'nom' => 'A.A AL FATH',
                'description' => 'Annexe Administrative Al Fath',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-ALF001',
            ],
            [
                'nom' => 'A.A ATLAS',
                'description' => 'Annexe Administrative Atlas',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-ATL001',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS010',
            ],
            [
                'nom' => 'A.A BAB TAGHZOUT',
                'description' => 'Annexe Administrative Bab Taghzout',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-BTG001',
            ],
            [
                'nom' => 'A.A BAB GHMAT',
                'description' => 'Annexe Administrative Bab Ghmat',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-BGM001',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS011',
            ],
            [
                'nom' => 'A.A DISTRICT',
                'description' => 'Annexe Administrative District',
                'pachalik_nom' => 'PACHALIK MEDINA GUELIZ',
                'code' => 'PMG-DIS012',
            ],
        ];

        foreach ($annexes as $annexeData) {
            $pachalik = Pachalik::where('nom', $annexeData['pachalik_nom'])->first();
            if ($pachalik) {
                Annexe::firstOrCreate(
                    ['nom' => $annexeData['nom']], 
                    [
                        'nom' => $annexeData['nom'],
                        'description' => $annexeData['description'],
                        'pachalik_id' => $pachalik->id,
                        'code' => $annexeData['code'],
                    ]
                );
            }
        }

        $this->command->info('Annexes créées avec succès !');
    }
}
