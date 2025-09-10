<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pachalik;

class PachalikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Données officielles des Pachaliks de la Préfecture de Marrakech
        $pachaliks = [
            [
                'nom' => 'PACHALIK MEDINA GUELIZ',
                'description' => 'Pachalik de la Médina et Gueliz',
                'code' => 'PMG001',
            ],
            [
                'nom' => 'PACHALIK MENARA',
                'description' => 'Pachalik Menara',
                'code' => 'PME001',
            ],
            [
                'nom' => 'PACHALIK SIDI YOUSSEF BEN ALI',
                'description' => 'Pachalik Sidi Youssef Ben Ali',
                'code' => 'PSYBA001',
            ],
            [
                'nom' => 'PACHALIK ANNAKHIL',
                'description' => 'Pachalik Annakhil',
                'code' => 'PAN001',
            ],
            [
                'nom' => 'PACHALIK TAMANSOURT',
                'description' => 'Pachalik Tamansourt',
                'code' => 'PTA001',
            ],
            [
                'nom' => 'PACHALIK TAMESLOHTE',
                'description' => 'Pachalik Tameslohte',
                'code' => 'PTE001',
            ],
            [
                'nom' => 'PACHALIK TAHANNAOUT',
                'description' => 'Pachalik Tahannaout',
                'code' => 'PTH001',
            ],
        ];

        foreach ($pachaliks as $pachalikData) {
            Pachalik::firstOrCreate(
                ['nom' => $pachalikData['nom']], 
                $pachalikData
            );
        }

        $this->command->info('Pachaliks créés avec succès !');
    }
}
