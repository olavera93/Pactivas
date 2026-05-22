<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use SerializesLocalDates;

    protected $fillable = ['titulo', 'descripcion', 'archivo', 'estado'];

    protected $casts = ['estado' => 'boolean'];

    public function accesos()
    {
        return $this->hasMany(DocumentoAcceso::class);
    }
}
