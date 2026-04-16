<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    //
    protected $fillable = ['nombre_empleado', 'area', 'documento_empleado', 'ejercicios_realizados', 'duracion_minutos'];
}
