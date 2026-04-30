<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoraExtra extends Model
{
    protected $table = 'horas_extras';

    protected $fillable = [
        'nombre_empleado',
        'documento_empleado',
        'area',
        'fecha',
        'horas',
        'motivo',
        'nombre_autorizador',
        'estado',
        'observacion_admin',
        'revisado_por',
        'fecha_revision',
    ];

    protected $casts = [
        'fecha'          => 'date',
        'fecha_revision' => 'datetime',
        'horas'          => 'float',
    ];
}
