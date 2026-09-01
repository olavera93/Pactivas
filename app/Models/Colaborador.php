<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Colaborador extends Model
{
    use SerializesLocalDates;

    protected $fillable = [
        'nombres', 
        'apellidos', 
        'area', 
        'documento', 
        'activo', 
        'fecha_cumpleanios'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_cumpleanios' => 'date',
    ];
}