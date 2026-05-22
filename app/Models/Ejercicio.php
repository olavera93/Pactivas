<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    use SerializesLocalDates;

    //
    protected $fillable = ['titulo', 'instrucciones', 'beneficio', 'imagen', 'activo', 'duracion'];
}
