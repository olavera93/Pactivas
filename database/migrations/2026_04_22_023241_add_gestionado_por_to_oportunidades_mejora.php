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
            $table->string('gestionado_por', 150)->nullable()->after('observacion_admin');
            $table->timestamp('fecha_gestion')->nullable()->after('gestionado_por');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn(['gestionado_por', 'fecha_gestion']);
        });
    }
};
