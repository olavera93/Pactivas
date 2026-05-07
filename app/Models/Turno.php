<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    protected $fillable = [
        'nombre_colaborador',
        'documento_colaborador',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'estado',
        'observacion',
    ];
}
