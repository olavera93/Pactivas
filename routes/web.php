<?php

use App\Http\Controllers\EjercicioController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ColaboradorController;
use App\Http\Controllers\OportunidadMejoraController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\HoraExtraController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\AnuncioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/registro', [RegistroController::class, 'index'])->name('registro');

// Módulo Oportunidades de Mejora (público)
Route::get('/oportunidades', [OportunidadMejoraController::class, 'index'])->name('oportunidades');
Route::post('/api/oportunidades', [OportunidadMejoraController::class, 'store'])->name('oportunidades.store');

Route::get('/ejercicios', [EjercicioController::class, 'index']);
Route::post('/api/horas-extras', [HoraExtraController::class, 'store'])->name('horas-extras.store');

Route::middleware('auth')->group(function () {
    Route::get('/consulta', [ConsultaController::class, 'index'])->name('consulta');
    Route::post('/consulta', [ConsultaController::class, 'buscar'])->name('consulta.buscar');
    Route::get('/documentos/{documento}/acceder', [DocumentoController::class, 'acceder'])->name('documentos.acceder');
});
Route::post('/api/registro', [RegistroController::class, 'store'])->name('registro.store');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/admin/stats', [RegistroController::class, 'stats']);

    // Gestión de Colaboradores
    Route::get('/admin/colaboradores', [ColaboradorController::class, 'index'])->name('admin.colaboradores');
    Route::post('/admin/colaboradores', [ColaboradorController::class, 'store'])->name('admin.colaboradores.store');
    Route::put('/admin/colaboradores/{colaborador}', [ColaboradorController::class, 'update'])->name('admin.colaboradores.update');
    Route::delete('/admin/colaboradores/{colaborador}', [ColaboradorController::class, 'destroy'])->name('admin.colaboradores.destroy');
    Route::get('/admin/colaboradores/export', [ColaboradorController::class, 'export'])->name('admin.colaboradores.export');
    Route::post('/admin/colaboradores/preview', [ColaboradorController::class, 'preview'])->name('admin.colaboradores.preview');
    Route::get('/admin/colaboradores/preview', function () {
        return redirect()->route('admin.colaboradores');
    }); // Evitar 405 al refrescar
    Route::post('/admin/colaboradores/import', [ColaboradorController::class, 'import'])->name('admin.colaboradores.import');

    // Gestión de Departamentos
    Route::resource('/admin/departamentos', \App\Http\Controllers\DepartamentoController::class)->names([
        'index' => 'admin.departamentos',
        'store' => 'admin.departamentos.store',
        'update' => 'admin.departamentos.update',
        'destroy' => 'admin.departamentos.destroy',
    ])->except(['create', 'edit', 'show']);

    // Gestión de Ejercicios
    Route::get('/admin/ejercicios', [EjercicioController::class, 'adminIndex'])->name('admin.ejercicios');
    Route::post('/admin/ejercicios', [EjercicioController::class, 'store'])->name('admin.ejercicios.store');
    Route::post('/admin/ejercicios/{ejercicio}', [EjercicioController::class, 'update'])->name('admin.ejercicios.update'); // POST para manejar archivos
    Route::delete('/admin/ejercicios/{ejercicio}', [EjercicioController::class, 'destroy'])->name('admin.ejercicios.destroy');

    // Gestión de Categorías
    Route::post('/admin/categorias', [CategoriaController::class, 'store'])->name('admin.categorias.store');
    Route::put('/admin/categorias/{categoria}', [CategoriaController::class, 'update'])->name('admin.categorias.update');
    Route::delete('/admin/categorias/{categoria}', [CategoriaController::class, 'destroy'])->name('admin.categorias.destroy');

    // Módulo Indicadores de Mejora (admin)
    Route::get('/admin/indicadores', [OportunidadMejoraController::class, 'adminIndex'])->name('admin.indicadores');
    Route::get('/admin/indicadores/stats', [OportunidadMejoraController::class, 'stats'])->name('admin.indicadores.stats');
    Route::patch('/admin/indicadores/{oportunidad}', [OportunidadMejoraController::class, 'updateEstado'])->name('admin.indicadores.estado');
    Route::get('/admin/indicadores/export', [OportunidadMejoraController::class, 'export'])->name('admin.indicadores.export');
    Route::get('/admin/indicadores/export-pdf', [OportunidadMejoraController::class, 'exportPdf'])->name('admin.indicadores.export.pdf');

    // Horas Extras
    Route::get('/admin/horas-extras', [HoraExtraController::class, 'adminIndex'])->name('admin.horas-extras');
    Route::get('/admin/horas-extras/export', [HoraExtraController::class, 'export'])->name('admin.horas-extras.export');
    Route::patch('/admin/horas-extras/{horaExtra}', [HoraExtraController::class, 'updateEstado'])->name('admin.horas-extras.estado');

    // Gestión de Anuncios
    Route::get('/admin/anuncios', [AnuncioController::class, 'index'])->name('admin.anuncios');
    Route::post('/admin/anuncios', [AnuncioController::class, 'store'])->name('admin.anuncios.store');
    Route::patch('/admin/anuncios/{anuncio}/activar', [AnuncioController::class, 'activar'])->name('admin.anuncios.activar');
    Route::patch('/admin/anuncios/{anuncio}/desactivar', [AnuncioController::class, 'desactivar'])->name('admin.anuncios.desactivar');
    Route::delete('/admin/anuncios/{anuncio}', [AnuncioController::class, 'destroy'])->name('admin.anuncios.destroy');

    // Gestión de Documentos
    Route::get('/admin/documentos', [DocumentoController::class, 'index'])->name('admin.documentos');
    Route::post('/admin/documentos', [DocumentoController::class, 'store'])->name('admin.documentos.store');
    Route::post('/admin/documentos/{documento}', [DocumentoController::class, 'update'])->name('admin.documentos.update');
    Route::patch('/admin/documentos/{documento}/estado', [DocumentoController::class, 'toggleEstado'])->name('admin.documentos.estado');
    Route::delete('/admin/documentos/{documento}', [DocumentoController::class, 'destroy'])->name('admin.documentos.destroy');

    // Gestión de Usuarios
    Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios');
    Route::post('/admin/usuarios', [UserController::class, 'store'])->name('admin.usuarios.store');
    Route::put('/admin/usuarios/{usuario}', [UserController::class, 'update'])->name('admin.usuarios.update');
    Route::patch('/admin/usuarios/{usuario}/password', [UserController::class, 'updatePassword'])->name('admin.usuarios.password');
    Route::delete('/admin/usuarios/{usuario}', [UserController::class, 'destroy'])->name('admin.usuarios.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/admin/exportar-reporte', [RegistroController::class, 'export'])->name('admin.registros.export');
});

require __DIR__ . '/auth.php';