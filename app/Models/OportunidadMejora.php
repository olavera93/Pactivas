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
        'area_responsable',
        'fecha_caso',
        'documento_empleado',
        'area',
        'categoria',
        'descripcion',

        'estado',
        'observacion_admin',
        'nombre_socializador',
        'nombre_receptor',
    ];
}
