<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Colaborador;
use App\Models\Documento;
use App\Models\HoraExtra;
use App\Models\OportunidadMejora;
use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultaController extends Controller
{
    public function index()
    {
        return Inertia::render('Consulta', [
            'resultado'     => null,
            'documento'     => '',
            'fecha_inicio'  => '',
            'fecha_fin'     => '',
            'colaboradores' => Colaborador::select('id', 'nombres', 'apellidos', 'area', 'documento')->orderBy('nombres')->get(),
            'documentos'    => Documento::where('estado', true)->orderBy('created_at', 'desc')->get(['id', 'titulo', 'descripcion', 'archivo']),
            'anuncio'       => Anuncio::where('activo', true)->first(),
        ]);
    }

    public function buscar(Request $request)
    {
        $request->validate([
            'documento'    => 'required|string|max:20',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'    => 'nullable|date',
        ]);

        $doc         = trim($request->documento);
        $fechaInicio = $request->fecha_inicio;
        $fechaFin    = $request->fecha_fin;

        $colaborador = Colaborador::where('documento', $doc)->where('activo', true)->first();

        $registros = Registro::where('documento_empleado', $doc)
            ->when($fechaInicio, fn($q) => $q->whereDate('created_at', '>=', $fechaInicio))
            ->when($fechaFin,    fn($q) => $q->whereDate('created_at', '<=', $fechaFin))
            ->orderBy('created_at', 'desc')
            ->get();

        $nombreResponsable = $colaborador
            ? trim($colaborador->nombres . ' ' . $colaborador->apellidos)
            : null;

        $oportunidades = OportunidadMejora::where(function ($q) use ($doc, $nombreResponsable) {
                $q->where('documento_responsable', $doc);
                if ($nombreResponsable) {
                    $q->orWhere('nombre_responsable', $nombreResponsable);
                }
            })
            ->when($fechaInicio, fn($q) => $q->whereDate('fecha_caso', '>=', $fechaInicio))
            ->when($fechaFin,    fn($q) => $q->whereDate('fecha_caso', '<=', $fechaFin))
            ->orderBy('created_at', 'desc')
            ->get(['id', 'no_orden', 'categoria', 'area_responsable', 'descripcion', 'estado', 'fecha_caso', 'created_at', 'observacion_admin', 'revisado_por', 'fecha_revision']);

        $ahora     = now();
        $inicioMes = $ahora->copy()->startOfMonth();
        $inicioSem = $ahora->copy()->startOfWeek();

        $resultado = [
            'colaborador'       => $colaborador,
            'total_pausas'      => $registros->count(),
            'total_minutos'     => $registros->sum('duracion_minutos'),
            'pausas_mes'        => $registros->filter(fn($r) => $r->created_at >= $inicioMes)->count(),
            'pausas_semana'     => $registros->filter(fn($r) => $r->created_at >= $inicioSem)->count(),
            'ultimas_pausas'    => $registros->take(10)->values(),
            'oportunidades'     => $oportunidades->values(),
            'op_total'          => $oportunidades->count(),
            'op_pendientes'     => $oportunidades->where('estado', 'pendiente')->count(),
            'op_confirmadas'    => $oportunidades->where('estado', 'confirmado')->count(),
            'op_no_confirmadas' => $oportunidades->where('estado', 'no_confirmado')->count(),
        ];

        $horasExtras = HoraExtra::where('documento_empleado', $doc)
            ->when($fechaInicio, fn($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin,    fn($q) => $q->whereDate('fecha', '<=', $fechaFin))
            ->orderBy('fecha', 'desc')
            ->get(['id', 'fecha', 'horas', 'motivo', 'nombre_autorizador', 'estado', 'observacion_admin', 'revisado_por', 'fecha_revision']);

        $resultado['horas_extras']          = $horasExtras->values();
        $resultado['he_total_horas']        = $horasExtras->sum('horas');
        $resultado['he_pendientes']         = $horasExtras->where('estado', 'pendiente')->count();
        $resultado['he_aprobadas_horas']    = $horasExtras->where('estado', 'aprobado')->sum('horas');

        return Inertia::render('Consulta', [
            'resultado'     => $resultado,
            'documento'     => $doc,
            'fecha_inicio'  => $fechaInicio,
            'fecha_fin'     => $fechaFin,
            'colaboradores' => Colaborador::select('id', 'nombres', 'apellidos', 'area', 'documento')->orderBy('nombres')->get(),
            'documentos'    => Documento::where('estado', true)->orderBy('created_at', 'desc')->get(['id', 'titulo', 'descripcion', 'archivo']),
            'anuncio'       => Anuncio::where('activo', true)->first(),
        ]);
    }
}
