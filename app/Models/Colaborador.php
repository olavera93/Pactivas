<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Colaborador extends Model
{
    //
    protected $fillable = ['nombres', 'apellidos', 'area', 'documento', 'activo'];

    protected $casts = ['activo' => 'boolean'];
}
