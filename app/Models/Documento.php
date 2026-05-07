<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    protected $fillable = ['titulo', 'descripcion', 'archivo', 'estado'];

    protected $casts = ['estado' => 'boolean'];

    public function accesos()
    {
        return $this->hasMany(DocumentoAcceso::class);
    }
}
