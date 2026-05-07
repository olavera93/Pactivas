<?php

namespace App\Http\Controllers;

use App\Models\Colaborador;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ColaboradorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Colaboradores', [
            'colaboradores' => Colaborador::orderBy('nombres')->get(),
            'departamentos' => Departamento::orderBy('nombre')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'documento' => 'nullable|string|max:20',
        ]);

        Colaborador::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, Colaborador $colaborador)
    {
        $validated = $request->validate([
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'area'      => 'required|string|max:255',
            'documento' => 'nullable|string|max:20',
            'activo'    => 'boolean',
        ]);

        $colaborador->update($validated);
        return redirect()->back();
    }

    public function destroy(Colaborador $colaborador)
    {
        $colaborador->delete();
        return redirect()->back();
    }

    public function toggleEstado(Colaborador $colaborador)
    {
        $colaborador->update(['activo' => !$colaborador->activo]);
        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function export()
    {
        $colaboradores = Colaborador::all();
        $data = [
            ['Documento', 'Nombres', 'Apellidos', 'Área']
        ];

        foreach ($colaboradores as $c) {
            $data[] = [$c->documento, $c->nombres, $c->apellidos, $c->area];
        }

        return \App\Helpers\SimpleXLSXGen::fromArray($data)->downloadAs('colaboradores_lfh.xlsx');
    }

    public function preview(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls'
        ]);

        $file = $request->file('excel_file');

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Saltar cabecera
            array_shift($rows);

            $excelData = [];
            foreach ($rows as $data) {
                // $data[0] -> Documento
                // $data[1] -> Nombres
                // $data[2] -> Apellidos
                // $data[3] -> Área
                if (count($data) >= 2 && !empty($data[0])) {
                    $doc = trim((string) $data[0]);
                    $excelData[$doc] = [
                        'documento' => $doc,
                        'nombres' => trim((string) ($data[1] ?? '')),
                        'apellidos' => trim((string) ($data[2] ?? '')),
                        'area' => trim((string) ($data[3] ?? 'Ventas')),
                    ];
                }
            }

            $currentEmployees = Colaborador::all()->keyBy('documento');

            $summary = [
                'create' => [],
                'update' => [],
                'delete' => [],
            ];

            // Identificar Nuevos y Actualizaciones
            foreach ($excelData as $doc => $data) {
                if (!$currentEmployees->has($doc)) {
                    $summary['create'][] = $data;
                } else {
                    $emp = $currentEmployees->get($doc);
                    if ($emp->nombres != $data['nombres'] || $emp->apellidos != $data['apellidos'] || $emp->area != $data['area']) {
                        $summary['update'][] = array_merge($data, ['old' => $emp->toArray()]);
                    }
                }
            }

            // Identificar Eliminaciones
            foreach ($currentEmployees as $doc => $emp) {
                if (!isset($excelData[$doc])) {
                    $summary['delete'][] = $emp->toArray();
                }
            }

            return Inertia::render('Admin/Colaboradores', [
                'colaboradores' => Colaborador::orderBy('nombres')->get(),
                'departamentos' => Departamento::orderBy('nombre')->get(),
                'importPreview' => $summary,
                'excelData' => (object) $excelData
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al procesar el archivo: ' . $e->getMessage());
        }
    }

    public function import(Request $request)
    {
        $data = $request->input('excelData');

        if (!$data) {
            \Log::warning('Intento de importación sin datos en excelData');
            return redirect()->back()->with('error', 'No hay datos para sincronizar. Por favor, intenta analizar el archivo de nuevo.');
        }

        try {
            $excelDocs = array_keys((array) $data);

            // 1. Eliminar los que no están en el Excel (Sincronización total)
            Colaborador::whereNotIn('documento', $excelDocs)->delete();

            // 2. Crear o Actualizar
            foreach ($data as $doc => $item) {
                Colaborador::updateOrCreate(
                    ['documento' => (string) $doc],
                    [
                        'nombres' => $item['nombres'] ?? '',
                        'apellidos' => $item['apellidos'] ?? '',
                        'area' => $item['area'] ?? 'Ventas',
                    ]
                );
            }

            return redirect()->route('admin.colaboradores')->with('success', 'Sincronización masiva completada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error en la sincronización: ' . $e->getMessage());
        }
    }
}
