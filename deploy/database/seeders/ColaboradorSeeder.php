<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColaboradorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');
        $areas = ['Ventas', 'Bodega', 'Administración', 'Regencia', 'Despachos', 'Servicios Generales', 'Mensajería'];

        for ($i = 0; $i < 100; $i++) {
            \App\Models\Colaborador::create([
                'nombres' => $faker->firstName . ' ' . $faker->firstName,
                'apellidos' => $faker->lastName . ' ' . $faker->lastName,
                'area' => $areas[array_rand($areas)],
                'documento' => $faker->unique()->randomNumber(9, true),
            ]);
        }
    }
}
