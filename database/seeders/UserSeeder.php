<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Administrador SST',
            'email' => 'admin@lfh.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
        ]);
    }
}
