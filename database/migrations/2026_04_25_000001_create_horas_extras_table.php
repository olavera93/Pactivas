<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horas_extras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_empleado', 150);
            $table->string('documento_empleado', 50)->nullable();
            $table->date('fecha');
            $table->decimal('horas', 4, 1);
            $table->text('motivo');
            $table->string('nombre_autorizador', 150);
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');
            $table->text('observacion_admin')->nullable();
            $table->string('revisado_por', 150)->nullable();
            $table->timestamp('fecha_revision')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horas_extras');
    }
};
