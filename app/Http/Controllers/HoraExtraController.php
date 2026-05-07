<?php

namespace App\Http\Controllers;

use App\Models\Colaborador;
use App\Models\HoraExtra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HoraExtraController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre_empleado'   => 'required|string|max:150',
            'documento_empleado'=> 'nullable|string|max:50',
            'fecha'             => 'required|date',
            'horas'             => 'required|numeric|min:0.5|max:24',
            'motivo'            => 'required|string|min:5',
        ]);

        $area = null;
        if ($request->documento_empleado) {
            $colab = \App\Models\Colaborador::where('documento', $request->documento_empleado)->first();
            $area  = $colab?->area;
        }

        HoraExtra::create([
            'nombre_empleado'    => $request->nombre_empleado,
            'documento_empleado' => $request->documento_empleado,
            'area'               => $area,
            'fecha'              => $request->fecha,
            'horas'              => $request->horas,
            'motivo'             => $request->motivo,
            'estado'             => 'pendiente',
        ]);

        return response()->json(['ok' => true]);
    }

    public function adminIndex()
    {
        $registros = HoraExtra::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/HorasExtras', [
            'registros' => $registros,
            'areas'     => Colaborador::select('area')->distinct()->pluck('area'),
        ]);
    }

    public function export(Request $request)
    {
        $query = HoraExtra::query();

        if ($request->ids)          $query->whereIn('id', $request->ids);
        if ($request->nombre)       $query->where('nombre_empleado', 'like', '%' . $request->nombre . '%');
        if ($request->estado)       $query->where('estado', $request->estado);
        if ($request->area)         $query->where('area', $request->area);
        if ($request->fecha_inicio) $query->whereDate('fecha', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)    $query->whereDate('fecha', '<=', $request->fecha_fin);

        $registros = $query->orderBy('fecha', 'desc')->get();

        $data = [['Empleado', 'Área', 'Fecha', 'Horas', 'Motivo', 'Estado', 'Revisado Por', 'Observación Admin', 'Fecha Revisión', 'Registro']];

        foreach ($registros as $r) {
            $data[] = [
                $r->nombre_empleado,
                $r->area ?? '',
                $r->fecha ? \Carbon\Carbon::parse($r->fecha)->format('d/m/Y') : '',
                $r->horas,
                $r->motivo,
                ucfirst($r->estado),
                $r->revisado_por ?? '',
                $r->observacion_admin ?? '',
                $r->fecha_revision ? \Carbon\Carbon::parse($r->fecha_revision)->format('d/m/Y H:i') : '',
                $r->created_at->format('d/m/Y H:i'),
            ];
        }

        return \App\Helpers\SimpleXLSXGen::fromArray($data)->downloadAs('horas_extras_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function destroyMultiple(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $count = HoraExtra::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', "{$count} registros eliminados.");
    }

    public function updateEstado(Request $request, HoraExtra $horaExtra)
    {
        $request->validate([
            'estado'           => 'required|in:pendiente,aprobado,rechazado',
            'observacion_admin'=> 'nullable|string|max:500',
            'horas'            => 'required|numeric|min:0.5|max:24',
        ]);

        $horaExtra->update([
            'estado'            => $request->estado,
            'observacion_admin' => $request->observacion_admin,
            'horas'             => $request->horas,
            'revisado_por'      => auth()->user()->name,
            'fecha_revision'    => now(),
        ]);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }
}
