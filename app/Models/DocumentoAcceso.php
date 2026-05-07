<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentoAcceso extends Model
{
    protected $fillable = ['documento_id', 'cedula_colaborador', 'nombre_colaborador'];

    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }
}
