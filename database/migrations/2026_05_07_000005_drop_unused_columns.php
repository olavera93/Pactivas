<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('horas_extras', function (Blueprint $table) {
            $table->dropColumn('nombre_autorizador');
        });

        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn(['impacto', 'nombre_socializador', 'nombre_receptor', 'area']);
        });
    }

    public function down(): void
    {
        Schema::table('horas_extras', function (Blueprint $table) {
            $table->string('nombre_autorizador', 150)->nullable();
        });

        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->enum('impacto', ['bajo', 'medio', 'alto'])->nullable();
            $table->string('nombre_socializador', 150)->nullable();
            $table->string('nombre_receptor', 150)->nullable();
            $table->string('area', 100)->nullable();
        });
    }
};
