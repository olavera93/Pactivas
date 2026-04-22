<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->renameColumn('gestionado_por', 'revisado_por');
            $table->renameColumn('fecha_gestion', 'fecha_revision');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->renameColumn('revisado_por', 'gestionado_por');
            $table->renameColumn('fecha_revision', 'fecha_gestion');
        });
    }
};
