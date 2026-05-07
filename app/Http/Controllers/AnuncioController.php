<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnuncioController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Anuncios', [
            'anuncios' => Anuncio::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'imagen' => 'required|file|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $file     = $request->file('imagen');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('anuncios'), $filename);

        Anuncio::create([
            'titulo' => $request->titulo,
            'imagen' => 'anuncios/' . $filename,
            'activo' => false,
        ]);

        return redirect()->back()->with('success', 'Anuncio creado correctamente.');
    }

    public function activar(Anuncio $anuncio)
    {
        // Desactiva todos y activa solo este
        Anuncio::query()->update(['activo' => false]);
        $anuncio->update(['activo' => true]);

        return redirect()->back()->with('success', 'Anuncio activado.');
    }

    public function desactivar(Anuncio $anuncio)
    {
        $anuncio->update(['activo' => false]);
        return redirect()->back()->with('success', 'Anuncio desactivado.');
    }

    public function destroy(Anuncio $anuncio)
    {
        $ruta = public_path($anuncio->imagen);
        if (file_exists($ruta)) {
            unlink($ruta);
        }

        $anuncio->delete();
        return redirect()->back()->with('success', 'Anuncio eliminado.');
    }
}
