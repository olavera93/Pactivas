<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    use SerializesLocalDates;

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
