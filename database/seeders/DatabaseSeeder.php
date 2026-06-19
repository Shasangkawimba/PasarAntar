<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Markets
        \App\Models\Market::create([
            'name' => 'Pasar Gede',
            'address' => 'Jl. Jend. Sudirman No. 1, Surakarta',
            'is_active' => true,
        ]);

        \App\Models\Market::create([
            'name' => 'Pasar Klewer',
            'address' => 'Jl. Dr. Radjiman, Surakarta',
            'is_active' => true,
        ]);

        \App\Models\Market::create([
            'name' => 'Pasar Legi',
            'address' => 'Jl. S. Parman, Surakarta',
            'is_active' => true,
        ]);

        // 2. Seed Users
        \App\Models\User::factory()->create([
            'name' => 'Buyer Pasar',
            'email' => 'buyer@example.com',
            'role' => 'buyer',
            'phone_number' => '081234567890',
            'is_active' => true,
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Joki Belanja',
            'email' => 'joki@example.com',
            'role' => 'joki',
            'phone_number' => '089876543210',
            'is_active' => true,
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Admin Pasar Antar',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'phone_number' => '085555555555',
            'is_active' => true,
        ]);
    }
}
