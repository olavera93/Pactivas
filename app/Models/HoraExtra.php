<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class HoraExtra extends Model
{
    use SerializesLocalDates;

    protected $table = 'horas_extras';

    protected $fillable = [
        'nombre_empleado',
        'documento_empleado',
        'area',
        'fecha',
        'horas',
        'motivo',
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
