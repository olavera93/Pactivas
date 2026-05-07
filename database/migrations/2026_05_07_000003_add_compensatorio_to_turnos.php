<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE turnos MODIFY COLUMN estado ENUM('asiste','ausente','permiso','vacaciones','incapacidad','compensatorio') DEFAULT 'asiste'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE turnos MODIFY COLUMN estado ENUM('asiste','ausente','permiso','vacaciones','incapacidad') DEFAULT 'asiste'");
    }
};
