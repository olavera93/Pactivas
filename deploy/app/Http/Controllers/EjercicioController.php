<?php

namespace App\Http\Controllers;

use App\Models\Ejercicio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EjercicioController extends Controller
{
    public function index()
    {
        return response()->json(Ejercicio::where('activo', 1)->get());
    }

    public function adminIndex()
    {
        return Inertia::render('Admin/Ejercicios', [
            'ejercicios' => Ejercicio::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'instrucciones' => 'required|string',
            'beneficio' => 'required|string',
            'duracion' => 'required|integer|min:1',
            'imagen_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('imagen_file')) {
            $file = $request->file('imagen_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('img/ejercicios'), $filename);
            $validated['imagen'] = 'img/ejercicios/' . $filename;
        }

        Ejercicio::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, Ejercicio $ejercicio)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'instrucciones' => 'required|string',
            'beneficio' => 'required|string',
            'duracion' => 'required|integer|min:1',
            'activo' => 'boolean',
            'imagen_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('imagen_file')) {
            $file = $request->file('imagen_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('img/ejercicios'), $filename);
            $validated['imagen'] = 'img/ejercicios/' . $filename;
        }

        $ejercicio->update($validated);
        return redirect()->back();
    }

    public function destroy(Ejercicio $ejercicio)
    {
        // Podríamos eliminar el archivo físico aquí si quisiéramos
        $ejercicio->delete();
        return redirect()->back();
    }
}