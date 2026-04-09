<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartamentoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Departamentos', [
            'departamentos' => Departamento::orderBy('nombre')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:departamentos',
        ]);

        Departamento::create($validated);
        return redirect()->back()->with('success', 'Departamento creado');
    }

    public function update(Request $request, Departamento $departamento)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:departamentos,nombre,' . $departamento->id,
        ]);

        $departamento->update($validated);
        return redirect()->back()->with('success', 'Departamento actualizado');
    }

    public function destroy(Departamento $departamento)
    {
        $departamento->delete();
        return redirect()->back()->with('success', 'Departamento eliminado');
    }
}
