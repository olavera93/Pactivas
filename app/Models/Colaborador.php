<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Colaborador extends Model
{
    use SerializesLocalDates;

    //
    protected $fillable = ['nombres', 'apellidos', 'area', 'documento', 'activo'];

    protected $casts = ['activo' => 'boolean'];
}
