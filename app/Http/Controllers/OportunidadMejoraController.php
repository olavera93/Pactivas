<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Colaborador;
use App\Models\OportunidadMejora;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OportunidadMejoraController extends Controller
{
    // Landing pública
    public function index()
    {
        return Inertia::render('Mejoras/Registro', [
            'colaboradores' => Colaborador::select('id', 'nombres', 'apellidos', 'area', 'documento')
                ->orderBy('nombres')->get(),
            'categorias' => Categoria::orderBy('nombre')->pluck('nombre'),
        ]);
    }

    // Guardar reporte público
    public function store(Request $request)
    {
        $request->validate([
            'no_orden'           => 'nullable|string|max:100',
            'nombre_empleado'    => 'required|string|max:150',
            'nombre_responsable'   => 'nullable|string|max:150',
            'documento_responsable'=> 'nullable|string|max:50',
            'area_responsable'     => 'nullable|string|max:100',
            'fecha_caso'           => 'required|date',
            'area'               => 'required|string|max:100',
            'categoria'          => 'required|string|max:80',
            'descripcion'         => 'required|string|min:10',
            'nombre_socializador' => 'nullable|string|max:150',
            'nombre_receptor'     => 'nullable|string|max:150',
        ]);

        OportunidadMejora::create([
            'no_orden'            => $request->no_orden,
            'nombre_empleado'     => $request->nombre_empleado,
            'nombre_responsable'   => $request->nombre_responsable,
            'documento_responsable'=> $request->documento_responsable,
            'area_responsable'     => $request->area_responsable,
            'fecha_caso'          => $request->fecha_caso,
            'documento_empleado'  => $request->documento_empleado,
            'area'                => $request->area,
            'categoria'           => $request->categoria,
            'descripcion'         => $request->descripcion,
            'nombre_socializador' => $request->nombre_socializador,
            'nombre_receptor'     => $request->nombre_receptor,
            'estado'              => 'pendiente',
        ]);

        return redirect()->back();
    }

    // Panel admin - indicadores
    public function adminIndex()
    {
        return Inertia::render('Admin/Indicadores', [
            'stats'      => $this->buildStats(),
            'categorias' => Categoria::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    // Stats API con filtros
    public function stats(Request $request)
    {
        $query = OportunidadMejora::query();

        if ($request->area)         $query->where('area', $request->area);
        if ($request->categoria)    $query->where('categoria', $request->categoria);
        if ($request->estado)       $query->where('estado', $request->estado);

        if ($request->fecha_inicio) $query->whereDate('created_at', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)    $query->whereDate('created_at', '<=', $request->fecha_fin);

        $registros = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'registros'        => $registros,
            'por_estado'       => $registros->groupBy('estado')->map->count(),

            'por_categoria'    => $registros->groupBy('categoria')->map->count(),
            'por_area'         => $registros->groupBy('area')->map->count(),
            'total'            => $registros->count(),
            'hoy'              => OportunidadMejora::whereDate('created_at', today())->count(),
        ]);
    }

    // Cambiar estado desde admin
    public function updateEstado(Request $request, OportunidadMejora $oportunidad)
    {
        $request->validate([
            'estado'              => 'required|in:pendiente,confirmado,no_confirmado',
            'observacion_admin'   => 'nullable|string|max:500',
        ]);

        $oportunidad->update([
            'estado'            => $request->estado,
            'observacion_admin' => $request->observacion_admin,
            'revisado_por'    => auth()->user()->name,
            'fecha_revision'     => now(),
        ]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    // Exportar Excel
    public function export(Request $request)
    {
        $query = OportunidadMejora::query();

        if ($request->area)         $query->where('area', $request->area);
        if ($request->estado)       $query->where('estado', $request->estado);
        if ($request->fecha_inicio) $query->whereDate('created_at', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)    $query->whereDate('created_at', '<=', $request->fecha_fin);

        $registros = $query->orderBy('created_at', 'desc')->get();

        $data = [['ID', 'Nº Orden', 'Reportado Por', 'Responsable', 'Documento Reportante', 'Área', 'Categoría', 'Descripción', 'Estado', 'Observación Admin', 'Revisado Por', 'Fecha Revisión', 'Fecha Caso', 'Fecha Registro']];

        foreach ($registros as $r) {
            $data[] = [
                $r->id,
                $r->no_orden ?? '',
                $r->nombre_empleado,
                $r->nombre_responsable ?? '',
                $r->documento_empleado ?? '',
                $r->area,
                $r->categoria,
                $r->descripcion,
                ucfirst(str_replace('_', ' ', $r->estado)),
                $r->observacion_admin ?? '',
                $r->revisado_por ?? '',
                $r->fecha_revision ? \Carbon\Carbon::parse($r->fecha_revision)->format('d/m/Y H:i') : '',
                $r->fecha_caso ? \Carbon\Carbon::parse($r->fecha_caso)->format('d/m/Y') : '',
                $r->created_at->format('d/m/Y H:i'),
            ];
        }

        return \App\Helpers\SimpleXLSXGen::fromArray($data)->downloadAs('oportunidades_mejora.xlsx');
    }

    // Exportar PDF
    public function exportPdf(Request $request)
    {
        $query = OportunidadMejora::query();

        if ($request->area)         $query->where('area', $request->area);
        if ($request->estado)       $query->where('estado', $request->estado);
        if ($request->nombre_responsable) $query->where('nombre_responsable', 'like', '%' . $request->nombre_responsable . '%');
        if ($request->fecha_inicio) $query->whereDate('created_at', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)    $query->whereDate('created_at', '<=', $request->fecha_fin);

        $registros = $query->orderBy('created_at', 'desc')->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.oportunidades', compact('registros'))
            ->setPaper('letter', 'landscape');

        return $pdf->download('oportunidades_mejora_' . now()->format('Ymd_His') . '.pdf');
    }

    private function buildStats(): array
    {
        $all = OportunidadMejora::all();
        return [
            'total'         => $all->count(),
            'hoy'           => OportunidadMejora::whereDate('created_at', today())->count(),
            'por_estado'    => $all->groupBy('estado')->map->count(),

            'por_categoria' => $all->groupBy('categoria')->map->count(),
            'por_area'      => $all->groupBy('area')->map->count(),
            'registros'     => OportunidadMejora::orderBy('created_at', 'desc')->get(),
            'areas'         => Colaborador::select('area')->distinct()->pluck('area'),
        ];
    }
}
