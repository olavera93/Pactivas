<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Normalizar registros existentes antes de cambiar el enum
        DB::statement("UPDATE oportunidades_mejora SET estado = 'pendiente' WHERE estado NOT IN ('confirmado','no_confirmado')");
        DB::statement("ALTER TABLE oportunidades_mejora MODIFY estado ENUM('pendiente','confirmado','no_confirmado') DEFAULT 'pendiente'");
    }

    public function down(): void
    {
        DB::statement("UPDATE oportunidades_mejora SET estado = 'pendiente' WHERE estado NOT IN ('pendiente','en_proceso','cerrada')");
        DB::statement("ALTER TABLE oportunidades_mejora MODIFY estado ENUM('pendiente','en_proceso','cerrada') DEFAULT 'pendiente'");
    }
};
