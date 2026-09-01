<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('colaboradors', function (Blueprint $table) {
            $table->date('fecha_cumpleanios')->nullable()->after('activo');
        });
    }

    public function down(): void
    {
        Schema::table('colaboradors', function (Blueprint $table) {
            $table->dropColumn('fecha_cumpleanios');
        });
    }
};