<?php

namespace App\Http\Controllers;

use App\Models\Colaborador;
use App\Models\Ejercicio;
use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistroController extends Controller
{
    public function index()
    {
        return Inertia::render('PausasActivas/Registro', [
            'colaboradores' => Colaborador::select('id', 'nombres', 'apellidos', 'area')->orderBy('nombres')->get()
        ]);
    }

    public function export(Request $request)
    {
        $query = Registro::query();

        if ($request->nombre) {
            $query->where(function ($q) use ($request) {
                $q->where('nombre_empleado', 'like', '%' . $request->nombre . '%')
                    ->orWhere('documento_empleado', 'like', '%' . $request->nombre . '%');
            });
        }
        if ($request->area) {
            $query->where('area', $request->area);
        }
        if ($request->fecha_inicio) {
            $query->whereDate('created_at', '>=', $request->fecha_inicio);
        }
        if ($request->fecha_fin) {
            $query->whereDate('created_at', '<=', $request->fecha_fin);
        }

        $registros = $query->orderBy('created_at', 'desc')->get();
        $data = [
            ['ID', 'Empleado', 'Documento', 'Área', 'Actividades', 'Tiempo (min)', 'Fecha']
        ];

        foreach ($registros as $r) {
            $data[] = [
                $r->id,
                $r->nombre_empleado,
                $r->documento_empleado,
                $r->area,
                $r->ejercicios_realizados,
                $r->duracion_minutos,
                $r->created_at->format('d/m/Y H:i')
            ];
        }

        return \App\Helpers\SimpleXLSXGen::fromArray($data)->downloadAs('reporte_pausas_lfh.xlsx');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_empleado' => 'required|string|max:150',
            'ejercicios_realizados' => 'required'
        ]);

        $ejercicios = is_array($request->ejercicios_realizados)
            ? implode(", ", $request->ejercicios_realizados)
            : $request->ejercicios_realizados;

        $query = Colaborador::query();
        $doc = $request->documento_empleado;
        $nombre = $request->nombre_empleado;

        if ($doc) {
            $query->where('documento', $doc);
        } else if ($nombre) {
            $driver = \DB::getDriverName();
            $concat = $driver === 'sqlite' ? "nombres || ' ' || apellidos" : "CONCAT(nombres, ' ', apellidos)";
            $query->where(\DB::raw("LOWER($concat)"), strtolower($nombre));
        }

        $colaborador = $query->first();

        if (!$colaborador) {
            return redirect()->back()->withErrors([
                'nombre_empleado' => 'El colaborador no existe en el sistema.'
            ])->withInput();
        }

        Registro::create([
            'nombre_empleado' => $request->nombre_empleado,
            'area' => $colaborador ? $colaborador->area : ($request->area ?? 'General'),
            'documento_empleado' => $request->documento_empleado ?? ($colaborador ? $colaborador->documento : null),
            'ejercicios_realizados' => $ejercicios,
            'duracion_minutos' => $request->duracion_minutos ?? 0
        ]);

        return redirect()->back();
    }

    public function stats(Request $request)
    {
        $query = Registro::query();

        if ($request->nombre) {
            $query->where(function ($q) use ($request) {
                $q->where('nombre_empleado', 'like', '%' . $request->nombre . '%')
                    ->orWhere('documento_empleado', 'like', '%' . $request->nombre . '%');
            });
        }
        if ($request->area) {
            $query->where('area', $request->area);
        }
        if ($request->fecha_inicio) {
            $query->whereDate('created_at', '>=', $request->fecha_inicio);
        }
        if ($request->fecha_fin) {
            $query->whereDate('created_at', '<=', $request->fecha_fin);
        }

        $registros = $query->orderBy('created_at', 'desc')->get();
        $totalFiltrado = $registros->count();
        $totalMinutos = $registros->sum('duracion_minutos');
        $hoyFiltrado = (clone $query)->whereDate('created_at', today())->count();

        // Análisis de ejercicios más realizados
        $ejerciciosCount = [];
        foreach ($registros as $reg) {
            $lista = explode(', ', $reg->ejercicios_realizados);
            foreach ($lista as $e) {
                if ($e) {
                    $ejerciciosCount[$e] = ($ejerciciosCount[$e] ?? 0) + 1;
                }
            }
        }
        arsort($ejerciciosCount);
        $topEjercicios = array_slice($ejerciciosCount, 0, 5, true);

        // Actividad por día con filtros aplicados
        $porDia = (clone $query)->reorder()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(duracion_minutos) as total_min')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        return [
            'total' => $totalFiltrado,
            'total_minutos' => $totalMinutos,
            'hoy' => $hoyFiltrado,
            'ejercicios' => \App\Models\Ejercicio::where('activo', 1)->count(),
            'ultimos' => $registros->take(50),
            'top_ejercicios' => $topEjercicios,
            'actividad_diaria' => $porDia,
            'areas' => Colaborador::select('area')->distinct()->pluck('area')
        ];
    }
}
