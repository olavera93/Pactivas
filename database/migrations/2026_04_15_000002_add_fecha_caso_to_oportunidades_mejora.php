<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->date('fecha_caso')->nullable()->after('nombre_empleado');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn('fecha_caso');
        });
    }
};
