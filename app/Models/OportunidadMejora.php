<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OportunidadMejora extends Model
{
    protected $table = 'oportunidades_mejora';

    protected $fillable = [
        'no_orden',
        'nombre_empleado',
        'nombre_responsable',
        'documento_responsable',
        'area_responsable',
        'fecha_caso',
        'documento_empleado',
        'area',
        'categoria',
        'descripcion',

        'estado',
        'observacion_admin',
        'revisado_por',
        'fecha_revision',
        'nombre_socializador',
        'nombre_receptor',
    ];
}
