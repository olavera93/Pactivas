<?php

namespace App\Http\Controllers;

use App\Models\Turno;
use App\Models\Colaborador;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurnoController extends Controller
{
    public function index(Request $request)
    {
        // Filtro por área requiere subquery para no romper el COUNT de paginación
        $docsEnArea = $request->area
            ? Colaborador::where('area', $request->area)->pluck('documento')->toArray()
            : null;

        $query = Turno::query();

        if ($request->fecha_inicio) $query->whereDate('fecha', '>=', $request->fecha_inicio);
        if ($request->fecha_fin)    $query->whereDate('fecha', '<=', $request->fecha_fin);
        if ($request->estado)       $query->where('estado', $request->estado);
        if ($docsEnArea !== null)   $query->whereIn('documento_colaborador', $docsEnArea);
        if ($request->buscar)       $query->where(function ($q) use ($request) {
            $q->where('nombre_colaborador', 'like', '%' . $request->buscar . '%')
              ->orWhere('documento_colaborador', 'like', '%' . $request->buscar . '%');
        });

        $turnos = $query->orderBy('fecha', 'desc')->orderBy('hora_inicio')->paginate(25)->withQueryString();

        // Agregar área desde colaboradors después de paginar
        $areas_map = Colaborador::whereIn('documento', $turnos->pluck('documento_colaborador')->filter()->unique()->toArray())
            ->pluck('area', 'documento');

        $turnos->through(fn($t) => tap($t, fn($t) => $t->area = $areas_map[$t->documento_colaborador] ?? null));

        // Vista semanal: query independiente sin filtros de lista
        $semanaVista = $request->semana_vista ?? now()->toDateString();
        $lunes       = \Carbon\Carbon::parse($semanaVista)->startOfWeek(\Carbon\Carbon::MONDAY)->toDateString();
        $domingo     = \Carbon\Carbon::parse($semanaVista)->endOfWeek(\Carbon\Carbon::SUNDAY)->toDateString();

        $turnosVista = Turno::whereDate('fecha', '>=', $lunes)
            ->whereDate('fecha', '<=', $domingo)
            ->orderBy('nombre_colaborador')
            ->orderBy('fecha')
            ->get();

        $areas_map_vista = Colaborador::whereIn('documento', $turnosVista->pluck('documento_colaborador')->filter()->unique()->toArray())
            ->pluck('area', 'documento');

        $turnosVista->each(fn($t) => $t->area = $areas_map_vista[$t->documento_colaborador] ?? null);

        $areas = Colaborador::select('area')->distinct()->orderBy('area')->pluck('area')->filter()->values();

        return Inertia::render('Admin/Turnos', [
            'turnos'       => $turnos,
            'turnosVista'  => $turnosVista,
            'semanaVista'  => $lunes,
            'colaboradores'=> Colaborador::where('activo', true)->select('id', 'nombres', 'apellidos', 'documento')->orderBy('nombres')->get(),
            'areas'        => $areas,
            'filtros'      => $request->only(['fecha_inicio', 'fecha_fin', 'estado', 'buscar', 'area']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_colaborador'    => 'required|string|max:255',
            'documento_colaborador' => 'nullable|string|max:20',
            'fecha'                 => 'required|date',
            'hora_inicio'           => 'required',
            'hora_fin'              => 'required',
            'estado'                => 'required|in:asiste,ausente,permiso,vacaciones,incapacidad,compensatorio',
            'observacion'           => 'nullable|string|max:500',
        ]);

        Turno::create($request->only([
            'nombre_colaborador', 'documento_colaborador',
            'fecha', 'hora_inicio', 'hora_fin', 'estado', 'observacion',
        ]));

        return redirect()->back()->with('success', 'Turno registrado correctamente.');
    }

    public function update(Request $request, Turno $turno)
    {
        $request->validate([
            'nombre_colaborador'    => 'required|string|max:255',
            'documento_colaborador' => 'nullable|string|max:20',
            'fecha'                 => 'required|date',
            'hora_inicio'           => 'required',
            'hora_fin'              => 'required',
            'estado'                => 'required|in:asiste,ausente,permiso,vacaciones,incapacidad,compensatorio',
            'observacion'           => 'nullable|string|max:500',
        ]);

        $turno->update($request->only([
            'nombre_colaborador', 'documento_colaborador',
            'fecha', 'hora_inicio', 'hora_fin', 'estado', 'observacion',
        ]));

        return redirect()->back()->with('success', 'Turno actualizado.');
    }

    public function destroy(Turno $turno)
    {
        $turno->delete();
        return redirect()->back()->with('success', 'Turno eliminado.');
    }

    public function destroyMultiple(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $count = Turno::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', "{$count} turnos eliminados.");
    }

    public function plantilla(Request $request)
    {
        $request->validate([
            'semana' => 'required|date',
            'area'   => 'nullable|string',
        ]);

        // Calcular lunes y domingo de la semana indicada
        $base   = \Carbon\Carbon::parse($request->semana);
        $lunes  = $base->copy()->startOfWeek(\Carbon\Carbon::MONDAY);
        $dias   = collect(range(0, 6))->map(fn($i) => $lunes->copy()->addDays($i)->format('Y-m-d'));

        // Colaboradores del área (o todos si no se filtra)
        $query = Colaborador::where('activo', true)->orderBy('nombres')->orderBy('apellidos');
        if ($request->area) $query->where('area', $request->area);
        $colaboradores = $query->get();

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Turnos');

        // Estilos encabezado
        $headers = ['Nombre Colaborador', 'Documento', 'Fecha', 'Hora Inicio (HH:MM)', 'Hora Fin (HH:MM)', 'Estado', 'Observación'];
        $widths  = [30, 18, 15, 20, 20, 18, 30];
        foreach ($headers as $i => $h) {
            $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($i + 1);
            $sheet->setCellValue("{$col}1", $h);
            $sheet->getStyle("{$col}1")->getFont()->setBold(true);
            $sheet->getStyle("{$col}1")->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setRGB('E0F2FE');
            $sheet->getColumnDimension($col)->setWidth($widths[$i]);
        }

        // Filas: una por colaborador por día, ordenadas por nombre luego fecha
        $row = 2;
        foreach ($colaboradores as $colab) {
            $nombre = trim($colab->nombres . ' ' . $colab->apellidos);
            foreach ($dias as $fecha) {
                $sheet->setCellValue("A{$row}", $nombre);
                $sheet->setCellValue("B{$row}", $colab->documento ?? '');
                $sheet->setCellValue("C{$row}", $fecha);
                // D, E, F, G quedan vacías para que el admin las llene
                $row++;
            }
        }

        // Borde sutil en todas las filas con datos
        if ($row > 2) {
            $sheet->getStyle("A1:G" . ($row - 1))->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)
                ->getColor()->setRGB('E2E8F0');
        }

        $area     = $request->area ? '_' . \Str::slug($request->area) : '';
        $filename = "turnos_semana_{$lunes->format('Y-m-d')}{$area}.xlsx";

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    private function normalizarHora($valor): string
    {
        if (is_numeric($valor)) {
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float)$valor)->format('H:i');
        }
        $str = trim((string) $valor);
        if (empty($str)) return '00:00';

        // Intentar parsear cualquier formato de hora reconocible
        try {
            return (new \DateTime($str))->format('H:i');
        } catch (\Exception $e) {
            return '00:00';
        }
    }

    public function importPreview(Request $request)
    {
        $request->validate(['archivo' => 'required|file|mimes:xlsx,xls']);

        try {
            $file        = $request->file('archivo');
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
            $rows        = $spreadsheet->getActiveSheet()->toArray();

            array_shift($rows);

            $estados = ['asiste', 'ausente', 'permiso', 'vacaciones', 'incapacidad', 'compensatorio'];
            $preview = [];

            foreach ($rows as $row) {
                if (empty($row[0]) && empty($row[1])) continue;

                $documento  = trim((string) ($row[1] ?? ''));
                $fecha      = $row[2] ?? '';
                $horaInicio = $row[3] ?? '';
                $horaFin    = $row[4] ?? '';

                if (is_numeric($fecha)) {
                    $fecha = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float)$fecha)->format('Y-m-d');
                }
                $horaInicio = $this->normalizarHora($horaInicio);
                $horaFin    = $this->normalizarHora($horaFin);

                $colab  = $documento ? Colaborador::where('documento', $documento)->first() : null;
                $nombre = $colab
                    ? trim($colab->nombres . ' ' . $colab->apellidos)
                    : trim((string) ($row[0] ?? ''));

                $estado    = trim(strtolower((string) ($row[5] ?? 'asiste')));
                $fechaStr  = trim((string) $fecha);
                $preview[] = [
                    'nombre_colaborador'    => $nombre,
                    'documento_colaborador' => $documento,
                    'fecha'                 => $fechaStr,
                    'hora_inicio'           => trim((string) $horaInicio),
                    'hora_fin'              => trim((string) $horaFin),
                    'estado'                => in_array($estado, $estados) ? $estado : 'asiste',
                    'observacion'           => trim((string) ($row[6] ?? '')),
                    'existe'                => false,
                ];
            }

            // Detectar conflictos contra la BD
            foreach ($preview as &$fila) {
                if (empty($fila['fecha'])) continue;
                $query = Turno::whereDate('fecha', $fila['fecha']);
                if ($fila['documento_colaborador']) {
                    $query->where('documento_colaborador', $fila['documento_colaborador']);
                } else {
                    $query->where('nombre_colaborador', $fila['nombre_colaborador']);
                }
                $fila['existe']    = $query->exists();
                $fila['turno_id']  = $query->value('id');
            }
            unset($fila);

            return response()->json($preview);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al procesar el archivo: ' . $e->getMessage());
        }
    }

    public function import(Request $request)
    {
        $rows    = $request->input('filas', []);
        $modo    = $request->input('modo', 'omitir');
        $estados = ['asiste', 'ausente', 'permiso', 'vacaciones', 'incapacidad', 'compensatorio'];
        $creados = 0;
        $actualizados = 0;

        foreach ($rows as $row) {
            if (empty($row['fecha'])) continue;

            $documento = $row['documento_colaborador'] ?: null;
            $colab     = $documento ? Colaborador::where('documento', $documento)->first() : null;
            $nombre    = $colab
                ? trim($colab->nombres . ' ' . $colab->apellidos)
                : ($row['nombre_colaborador'] ?? '');

            if (empty($nombre)) continue;

            $datos = [
                'nombre_colaborador'    => $nombre,
                'documento_colaborador' => $documento,
                'fecha'                 => $row['fecha'],
                'hora_inicio'           => $this->normalizarHora($row['hora_inicio'] ?? '00:00'),
                'hora_fin'              => $this->normalizarHora($row['hora_fin'] ?? '00:00'),
                'estado'                => in_array($row['estado'], $estados) ? $row['estado'] : 'asiste',
                'observacion'           => $row['observacion'] ?: null,
            ];

            if (!empty($row['existe']) && !empty($row['turno_id'])) {
                if ($modo === 'sobreescribir') {
                    Turno::where('id', $row['turno_id'])->update($datos);
                    $actualizados++;
                }
            } else {
                Turno::create($datos);
                $creados++;
            }
        }

        $msg = "{$creados} turnos creados";
        if ($actualizados > 0) $msg .= ", {$actualizados} actualizados";

        return redirect()->back()->with('success', $msg . '.');
    }
}
