<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string|max:80|unique:categorias,nombre']);
        Categoria::create(['nombre' => $request->nombre]);
        return redirect()->back();
    }

    public function update(Request $request, Categoria $categoria)
    {
        $request->validate(['nombre' => 'required|string|max:80|unique:categorias,nombre,' . $categoria->id]);
        $categoria->update(['nombre' => $request->nombre]);
        return redirect()->back();
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();
        return redirect()->back();
    }
}
