<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->string('area_responsable', 100)->nullable()->after('nombre_responsable');
        });
    }

    public function down(): void
    {
        Schema::table('oportunidades_mejora', function (Blueprint $table) {
            $table->dropColumn('area_responsable');
        });
    }
};
