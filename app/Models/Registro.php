<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    use SerializesLocalDates;

    //
    protected $fillable = ['nombre_empleado', 'area', 'documento_empleado', 'ejercicios_realizados', 'duracion_minutos'];
}
