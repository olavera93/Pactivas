<?php

namespace App\Models;

use App\Traits\SerializesLocalDates;
use Illuminate\Database\Eloquent\Model;

class Anuncio extends Model
{
    use SerializesLocalDates;

    protected $fillable = ['titulo', 'imagen', 'activo'];

    protected $casts = ['activo' => 'boolean'];
}
