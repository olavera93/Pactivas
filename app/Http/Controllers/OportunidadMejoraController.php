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
            'categoria'          => 'required|string|max:80',
            'descripcion'         => 'required|string|min:10',
        ]);

        OportunidadMejora::create([
            'no_orden'            => $request->no_orden,
            'nombre_empleado'     => $request->nombre_empleado,
            'nombre_responsable'   => $request->nombre_responsable,
            'documento_responsable'=> $request->documento_responsable,
            'area_responsable'     => $request->area_responsable,
            'fecha_caso'          => $request->fecha_caso,
            'documento_empleado'  => $request->documento_empleado,
            'categoria'           => $request->categoria,
            'descripcion'         => $request->descripcion,
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

        if ($request->no_orden)           $query->where('no_orden', 'like', '%' . $request->no_orden . '%');
        if ($request->nombre_responsable) $query->where('nombre_responsable', 'like', '%' . $request->nombre_responsable . '%');
        if ($request->nombre_empleado)    $query->where('nombre_empleado', 'like', '%' . $request->nombre_empleado . '%');
        if ($request->area)               $query->where('area_responsable', $request->area);
        if ($request->categoria)          $query->where('categoria', $request->categoria);
        if ($request->estado)             $query->where('estado', $request->estado);

        if ($request->fecha_inicio)       $query->whereDate('created_at', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)          $query->whereDate('created_at', '<=', $request->fecha_fin);

        $registros = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'registros'        => $registros,
            'por_estado'       => $registros->groupBy('estado')->map->count(),

            'por_categoria'    => $registros->groupBy('categoria')->map->count(),
            'por_area'         => $registros->groupBy('area_responsable')->map->count(),
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
    public function destroyMultiple(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $count = OportunidadMejora::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', "{$count} registros eliminados.");
    }
//////////////////////tambien se modifico///////////////////////////////////////////
    public function export(Request $request)
{
    $query = OportunidadMejora::query();

    if ($request->ids)                 $query->whereIn('id', $request->ids);
    if ($request->no_orden)            $query->where('no_orden', 'like', '%' . $request->no_orden . '%');
    if ($request->area)                $query->where('area_responsable', $request->area);
    if ($request->categoria)           $query->where('categoria', $request->categoria);
    if ($request->estado)              $query->where('estado', $request->estado);
    if ($request->nombre_responsable)  $query->where('nombre_responsable', 'like', '%' . $request->nombre_responsable . '%');
    if ($request->nombre_empleado)     $query->where('nombre_empleado', 'like', '%' . $request->nombre_empleado . '%');
    if ($request->fecha_inicio)        $query->whereDate('created_at', '>=', $request->fecha_inicio);
    if ($request->fecha_fin)           $query->whereDate('created_at', '<=', $request->fecha_fin);

    $registros = $query->orderBy('created_at', 'desc')->get();

    $data = [['ID', 'Nº Orden', 'Reportado Por', 'Responsable', 'Documento Reportante', 'Área', 'Categoría', 'Descripción', 'Estado', 'Observación Admin', 'Revisado Por', 'Fecha Revisión', 'Fecha Caso', 'Fecha Registro']];

    // Función auxiliar para eliminar caracteres de control XML no válidos
    $clean = function ($text) {
        if (is_null($text)) return '';
        // Elimina caracteres ASCII de control excepto saltos de línea y tabulaciones (\x09, \x0A, \x0D)
        return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string)$text);
    };

    foreach ($registros as $r) {
        $data[] = [
            (int) $r->id,
            $clean($r->no_orden),
            $clean($r->nombre_empleado),
            $clean($r->nombre_responsable),
            $clean($r->documento_empleado),
            $clean($r->area),
            $clean($r->categoria),
            $clean($r->descripcion),
            $clean(ucfirst(str_replace('_', ' ', $r->estado ?? ''))),
            $clean($r->observacion_admin),
            $clean($r->revisado_por),
            $r->fecha_revision ? \Carbon\Carbon::parse($r->fecha_revision)->format('d/m/Y H:i') : '',
            $r->fecha_caso ? \Carbon\Carbon::parse($r->fecha_caso)->format('d/m/Y') : '',
            $r->created_at ? \Carbon\Carbon::parse($r->created_at)->format('d/m/Y H:i') : '',
        ];
    }

    if (ob_get_length()) {
        ob_end_clean();
    }

    return \App\Helpers\SimpleXLSXGen::fromArray($data)->downloadAs('oportunidades_mejora.xlsx');
}
////////////////////////// se movio esto en el controller Exportar PDF///////////////////////////////////////////////////
public function exportPdf(Request $request)
{
    ini_set('memory_limit', '512M');
    set_time_limit(300);

    $query = OportunidadMejora::query();

    // Prioridad: si vienen IDs seleccionados desde el frontend, se filtran solo esos
    if ($request->has('ids') && is_array($request->ids) && count($request->ids) > 0) {
        $query->whereIn('id', $request->ids);
    } else {
        // De lo contrario, se aplican los filtros tradicionales
        if ($request->filled('no_orden'))           $query->where('no_orden', 'like', '%' . $request->no_orden . '%');
        if ($request->filled('area'))               $query->where('area_responsable', $request->area);
        if ($request->filled('categoria'))          $query->where('categoria', $request->categoria);
        if ($request->filled('estado'))             $query->where('estado', $request->estado);
        if ($request->filled('nombre_responsable')) $query->where('nombre_responsable', 'like', '%' . $request->nombre_responsable . '%');
        if ($request->filled('nombre_empleado'))    $query->where('nombre_empleado', 'like', '%' . $request->nombre_empleado . '%');
        if ($request->filled('fecha_inicio'))       $query->whereDate('created_at', '>=', $request->fecha_inicio);
        if ($request->filled('fecha_fin'))          $query->whereDate('created_at', '<=', $request->fecha_fin);
    }

    $registros = $query->orderBy('created_at', 'desc')->get();

    $filtros = [
        'no_orden'           => $request->no_orden,
        'nombre_responsable' => $request->nombre_responsable,
        'nombre_empleado'    => $request->nombre_empleado,
        'fecha_inicio'       => $request->fecha_inicio,
        'fecha_fin'          => $request->fecha_fin,
        'area'               => $request->area,
        'categoria'          => $request->categoria,
        'estado'             => $request->estado,
    ];

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.oportunidades', compact('registros', 'filtros'))
        ->setPaper('letter', 'landscape')
        ->setOption([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled'      => true,
        ]);

    return $pdf->download('oportunidades_mejora_' . now()->format('Ymd_His') . '.pdf');
}
///////////////////////////////////////////////////////////////////////


    private function buildStats(): array
    {
        $all = OportunidadMejora::all();
        return [
            'total'         => $all->count(),
            'hoy'           => OportunidadMejora::whereDate('created_at', today())->count(),
            'por_estado'    => $all->groupBy('estado')->map->count(),

            'por_categoria' => $all->groupBy('categoria')->map->count(),
            'por_area'      => $all->groupBy('area_responsable')->map->count(),
            'registros'     => OportunidadMejora::orderBy('created_at', 'desc')->get(),
            'areas'         => Colaborador::select('area')->distinct()->pluck('area'),
        ];
    }

// ✅ SOLUCIÓN EN OportunidadMejoraController.php
public function actualizarEstadoMasivo(Request $request)
{
    $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:oportunidades_mejora,id', // O la tabla donde se guardan las oportunidades
        'estado' => 'required|in:pendiente,confirmado,no_confirmado',
    ]);

    OportunidadMejora::whereIn('id', $request->ids)->update([
        'estado' => $request->estado,
        'revisado_por' => auth()->user()->name,
        'fecha_revision' => now(),
    ]);

    return redirect()->back()->with('success', 'Estados actualizados correctamente.');
}




}
