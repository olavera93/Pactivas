<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    //
    protected $fillable = ['titulo', 'instrucciones', 'beneficio', 'imagen', 'activo', 'duracion'];
}
