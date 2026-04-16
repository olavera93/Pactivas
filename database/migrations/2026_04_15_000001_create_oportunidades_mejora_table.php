<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oportunidades_mejora', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_empleado', 150);
            $table->string('documento_empleado', 50)->nullable();
            $table->string('area', 100);
            $table->string('categoria', 80);
            $table->text('descripcion');
            $table->enum('impacto', ['bajo', 'medio', 'alto'])->default('medio');
            $table->enum('estado', ['pendiente', 'en_proceso', 'cerrada'])->default('pendiente');
            $table->text('observacion_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oportunidades_mejora');
    }
};
