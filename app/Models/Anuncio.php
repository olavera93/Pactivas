<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anuncio extends Model
{
    protected $fillable = ['titulo', 'imagen', 'activo'];

    protected $casts = ['activo' => 'boolean'];
}
