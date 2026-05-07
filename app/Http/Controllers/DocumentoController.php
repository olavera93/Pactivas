<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\DocumentoAcceso;
use App\Models\Colaborador;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Documentos', [
            'documentos' => Documento::withCount('accesos')->orderBy('created_at', 'desc')->get(),
            'accesos'    => DocumentoAcceso::with('documento:id,titulo')
                                ->orderBy('created_at', 'desc')
                                ->limit(100)
                                ->get(['id', 'documento_id', 'cedula_colaborador', 'nombre_colaborador', 'created_at']),
        ]);
    }

    public function acceder(Request $request, Documento $documento)
    {
        $cedula = $request->query('cedula');
        $nombre = null;

        if ($cedula) {
            $colab  = Colaborador::where('documento', $cedula)->first();
            $nombre = $colab ? trim($colab->nombres . ' ' . $colab->apellidos) : null;
        }

        DocumentoAcceso::create([
            'documento_id'       => $documento->id,
            'cedula_colaborador' => $cedula,
            'nombre_colaborador' => $nombre,
        ]);

        return redirect("/{$documento->archivo}");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'archivo'     => 'required|file|mimes:pdf|max:10240',
        ]);

        $file     = $request->file('archivo');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('documentos'), $filename);

        Documento::create([
            'titulo'      => $validated['titulo'],
            'descripcion' => $validated['descripcion'] ?? null,
            'archivo'     => 'documentos/' . $filename,
            'estado'      => true,
        ]);

        return redirect()->back()->with('success', 'Documento subido correctamente.');
    }

    public function update(Request $request, Documento $documento)
    {
        $validated = $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'estado'      => 'required|boolean',
            'archivo'     => 'nullable|file|mimes:pdf|max:10240',
        ]);

        unset($validated['archivo']);

        if ($request->hasFile('archivo')) {
            $ruta = public_path($documento->archivo);
            if (file_exists($ruta)) {
                unlink($ruta);
            }
            $file     = $request->file('archivo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('documentos'), $filename);
            $validated['archivo'] = 'documentos/' . $filename;
        }

        $documento->update($validated);
        return redirect()->back()->with('success', 'Documento actualizado correctamente.');
    }

    public function toggleEstado(Documento $documento)
    {
        $documento->update(['estado' => !$documento->estado]);
        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function destroy(Documento $documento)
    {
        $ruta = public_path($documento->archivo);
        if (file_exists($ruta)) {
            unlink($ruta);
        }

        $documento->delete();
        return redirect()->back()->with('success', 'Documento eliminado.');
    }
}
