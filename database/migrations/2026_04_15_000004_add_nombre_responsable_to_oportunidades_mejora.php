<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->string('nombre_responsable', 150)->nullable()->after('nombre_empleado');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn('nombre_responsable');
        });
    }
};
