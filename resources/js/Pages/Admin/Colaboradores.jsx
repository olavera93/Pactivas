import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Colaboradores({ auth, colaboradores, departamentos, importPreview, excelData }) {
    const [search, setSearch] = useState('');
    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        id: null,
        documento: '',
        nombres: '',
        apellidos: '',
        area: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    // Formulario para previsualización (subida de archivo)
    const previewForm = useForm({
        excel_file: null
    });

    // Formulario para confirmación final
    const syncForm = useForm({
        excelData: null
    });

    // Sincronizar excelData de props con el formulario
    useEffect(() => {
        if (excelData) {
            syncForm.setData('excelData', excelData);
        }
    }, [excelData]);

    const handlePreview = (e) => {
        e.preventDefault();
        previewForm.post(route('admin.colaboradores.preview'), {
            forceFormData: true,
            preserveState: true,
        });
    };

    const handleSync = () => {
        if (!syncForm.data.excelData && excelData) {
            // Backup manual si el effect no ha corrido
            syncForm.post(route('admin.colaboradores.import'), {
                data: { excelData: excelData },
                onSuccess: () => { /* Exito */ }
            });
        } else {
            syncForm.post(route('admin.colaboradores.import'));
        }
    };

    const filtered = colaboradores.filter(c =>
        (c.nombres + ' ' + c.apellidos).toLowerCase().includes(search.toLowerCase()) ||
        (c.documento ? c.documento.toLowerCase().includes(search.toLowerCase()) : false) ||
        c.area.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.colaboradores.update', data.id), {
                onSuccess: () => { setIsEditing(false); reset(); }
            });
        } else {
            post(route('admin.colaboradores.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const edit = (colab) => {
        setData({
            id: colab.id,
            documento: colab.documento || '',
            nombres: colab.nombres,
            apellidos: colab.apellidos,
            area: colab.area
        });
        setIsEditing(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Gestión de <span className="text-[#00a2e1]">Personal</span></h2>
                        <p className="text-sm text-gray-500">Administra los colaboradores de la empresa</p>
                    </div>
                </div>
            }
        >
            <Head title="Colaboradores" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-6 z-10">
                    <div className="premium-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00a2e1] flex items-center justify-center text-xl">
                                {isEditing ? '📝' : '👤'}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Editar Registro' : 'Nuevo Colaborador'}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Documento de Identidad</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: 10293848"
                                    value={data.documento}
                                    onChange={e => setData('documento', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Nombres</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: Juan Camilo"
                                    value={data.nombres}
                                    onChange={e => setData('nombres', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Apellidos</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: Pérez Rodríguez"
                                    value={data.apellidos}
                                    onChange={e => setData('apellidos', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Área / Departamento</label>
                                <select
                                    className="premium-input"
                                    value={data.area}
                                    onChange={e => setData('area', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    {departamentos && departamentos.map(dept => (
                                        <option key={dept.id} value={dept.nombre}>{dept.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className="premium-button-primary w-full"
                                    disabled={processing}
                                >
                                    {isEditing ? 'Actualizar Datos' : 'Registrar Ahora'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); reset(); }}
                                        className="premium-button-secondary w-full"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Import Card */}
                    <div className="premium-card p-6 bg-gray-50/50">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mantenimiento Masivo</h4>
                        <form onSubmit={handlePreview} className="space-y-3">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#00a2e1] transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    name="excel_file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".xlsx,.xls"
                                    required
                                    onChange={e => previewForm.setData('excel_file', e.target.files[0])}
                                />
                                <div className="text-2xl mb-1">📊</div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Seleccionar Excel (.xlsx)</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-[10px] font-black uppercase py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                                disabled={previewForm.processing}
                            >
                                {previewForm.processing ? 'Analizando...' : '🔍 Analizar Archivo'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Modal/Overlay */}
                    {importPreview && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="premium-card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Resumen de Sincronización</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Revisa los cambios antes de aplicar</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()} // Simple way to clear preview
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                                            <div className="text-2xl font-black text-green-600">{importPreview.create.length}</div>
                                            <div className="text-[10px] font-bold text-green-700 uppercase">Nuevos</div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                            <div className="text-2xl font-black text-blue-600">{importPreview.update.length}</div>
                                            <div className="text-[10px] font-bold text-blue-700 uppercase">Actualizar</div>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                                            <div className="text-2xl font-black text-red-600">{importPreview.delete.length}</div>
                                            <div className="text-[10px] font-bold text-red-700 uppercase">Eliminar</div>
                                        </div>
                                    </div>

                                    {importPreview.delete.length > 0 && (
                                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                            <div className="flex gap-3">
                                                <span className="text-amber-600 text-xl">⚠️</span>
                                                <p className="text-xs text-amber-800 font-medium">
                                                    Atención: Los empleados que NO están en el Excel serán eliminados permanentemente del sistema para mantener la sincronización total.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalles de la operación</h4>
                                        <div className="text-xs text-gray-600 space-y-2">
                                            <p>• Los datos existentes se actualizarán con la información del archivo.</p>
                                            <p>• Los nuevos colaboradores se registrarán automáticamente.</p>
                                            <p>• El proceso es irreversible una vez confirmado.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-white flex gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="premium-button-secondary flex-1"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSync}
                                        className="premium-button-primary bg-black hover:bg-gray-800 border-none flex-1 shadow-gray-200"
                                        disabled={syncForm.processing}
                                    >
                                        {syncForm.processing ? 'Sincronizando...' : '🚀 Confirmar Cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Listado Principal */}
                <div className="lg:col-span-8 space-y-6">

                    <div className="premium-card overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, documento o área..."
                                    className="premium-input !pl-12 !py-2"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <a
                                href={route('admin.colaboradores.export')}
                                className="premium-button-primary bg-green-600 hover:bg-green-700 !py-2 flex items-center gap-2 shadow-green-100"
                            >
                                📊 Exportar Excel
                            </a>
                        </div>

                        <div className="overflow-x-auto min-h-[500px]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 italic border-b border-gray-100">
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">Documento</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">Nombres y Apellidos</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">Área</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.length > 0 ? filtered.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6 font-mono text-xs text-gray-400">{c.documento || 'N/A'}</td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-800">{c.nombres} {c.apellidos}</div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">{c.area}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => edit(c)}
                                                    className="text-[#00a2e1] font-bold text-xs hover:underline uppercase tracking-tighter"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('¿Deseas eliminar este colaborador?')) destroy(route('admin.colaboradores.destroy', c.id)) }}
                                                    className="text-red-500 font-bold text-xs hover:underline uppercase tracking-tighter"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-gray-400 italic">
                                                No se encontraron resultados para tu búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
