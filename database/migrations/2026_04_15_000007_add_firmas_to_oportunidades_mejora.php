<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->string('nombre_socializador', 150)->nullable()->after('observacion_admin');
            $table->string('nombre_receptor', 150)->nullable()->after('nombre_socializador');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn(['nombre_socializador', 'nombre_receptor']);
        });
    }
};
