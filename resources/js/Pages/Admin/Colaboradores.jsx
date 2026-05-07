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
        >
            <Head title="Colaboradores" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">

                <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start space-y-6 z-10">
                    <div className="premium-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#e6f6fd] text-[#00a2e1] flex items-center justify-center text-xl shadow-inner">
                                {isEditing ? '📝' : '👤'}
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 leading-tight">{isEditing ? 'Editar Registro' : 'Nuevo Ingreso'}</h3>
                                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest mt-0.5">Completa la información</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Documento ID</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: 10293848"
                                    value={data.documento}
                                    onChange={e => setData('documento', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Nombres</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Juan Camilo"
                                    value={data.nombres}
                                    onChange={e => setData('nombres', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Apellidos</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Pérez Rodríguez"
                                    value={data.apellidos}
                                    onChange={e => setData('apellidos', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Área / Proceso</label>
                                <select
                                    className="premium-input !bg-gray-50/50"
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

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className="premium-button-primary w-full !py-3 !text-sm"
                                    disabled={processing}
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Registrar Colaborador'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); reset(); }}
                                        className="premium-button-secondary w-full !py-3 !text-sm"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Import Card */}
                    <div className="premium-card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-xl shadow-gray-200">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Sincronización Masiva</h4>
                        <form onSubmit={handlePreview} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-[#00a2e1] hover:bg-white/5 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    name="excel_file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".xlsx,.xls"
                                    required
                                    onChange={e => previewForm.setData('excel_file', e.target.files[0])}
                                />
                                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-500">📎</div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest group-hover:text-white transition-colors">Plantilla (.xlsx)</p>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-[11px] font-black uppercase tracking-widest py-3 bg-[#00a2e1] text-white rounded-xl hover:bg-[#0084b9] transition-all disabled:opacity-50 shadow-lg shadow-[#00a2e1]/20"
                                disabled={previewForm.processing}
                            >
                                {previewForm.processing ? 'Procesando...' : '🔍 Validar Archivo'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Modal/Overlay */}
                    {importPreview && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="premium-card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-[#f1f5f9] animate-fade-in-up">
                                <div className="p-8 border-b border-[#f1f5f9] flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Resumen de Sincronización</h3>
                                        <p className="text-[10px] text-[#64748b] font-black uppercase tracking-[0.15em] mt-1">Valida los datos antes de la carga final</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#f1f5f9] text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto space-y-8">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="premium-card !p-5 bg-green-50 border-green-100 text-center !rounded-3xl shadow-none">
                                            <div className="text-3xl font-black text-green-600 mb-1">{importPreview.create.length}</div>
                                            <div className="text-[9px] font-black text-green-700 uppercase tracking-widest">Ingresos</div>
                                        </div>
                                        <div className="premium-card !p-5 bg-blue-50 border-blue-100 text-center !rounded-3xl shadow-none">
                                            <div className="text-3xl font-black text-blue-600 mb-1">{importPreview.update.length}</div>
                                            <div className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Cambios</div>
                                        </div>
                                        <div className="premium-card !p-5 bg-red-50 border-red-100 text-center !rounded-3xl shadow-none">
                                            <div className="text-3xl font-black text-red-600 mb-1">{importPreview.delete.length}</div>
                                            <div className="text-[9px] font-black text-red-700 uppercase tracking-widest">Bajas</div>
                                        </div>
                                    </div>

                                    {importPreview.delete.length > 0 && (
                                        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start shadow-inner">
                                            <span className="text-2xl">⚠️</span>
                                            <div>
                                                <h5 className="text-[11px] font-black text-amber-900 uppercase mb-1">Nota importante sobre bajas</h5>
                                                <p className="text-[12px] text-amber-800/80 leading-relaxed font-medium">
                                                    Los empleados ausentes en el archivo serán eliminados para asegurar una sincronización 1:1 con tu base de datos central.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] px-1">Protocolo de Operación</h4>
                                        <div className="premium-card !p-6 bg-gray-50/50 border-gray-100 shadow-none space-y-3">
                                            {[
                                                'Validación automática de documentos duplicados.',
                                                'Actualización inmediata de áreas y nombres.',
                                                'Este proceso sobrescribirá los datos actuales.'
                                            ].map((text, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a2e1]" />
                                                    {text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-[#f1f5f9] bg-white flex gap-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 premium-button-secondary"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        onClick={handleSync}
                                        className="flex-1 premium-button-primary !bg-gray-900 hover:!bg-black border-none shadow-gray-200"
                                        disabled={syncForm.processing}
                                    >
                                        {syncForm.processing ? 'Procesando...' : '🚀 Ejecutar Sincronización'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                <div className="lg:col-span-8 space-y-6">

                    <div className="premium-card overflow-hidden">
                        <div className="p-6 border-b border-[#f1f5f9] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#fbfdfe]">
                            <div className="relative w-full md:w-80 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg group-focus-within:scale-110 transition-transform">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Nombre, ID o área..."
                                    className="premium-input !pl-12 !py-2.5 text-sm shadow-sm"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <a
                                href={route('admin.colaboradores.export')}
                                className="premium-button-primary !bg-green-600 hover:!bg-green-700 !py-2.5 !px-5 text-xs flex items-center gap-2 shadow-green-100 whitespace-nowrap"
                            >
                                📊 Exportar
                            </a>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-[#f1f5f9]">
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">ID</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {filtered.length > 0 ? filtered.map(c => (
                                        <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors group">
                                            <td className="py-3 px-6">
                                                <span className="font-mono text-[10px] font-bold text-[#94a3b8] bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{c.documento || '—'}</span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="font-black text-gray-900 group-hover:text-[#00a2e1] transition-colors text-[13px]">{c.nombres} {c.apellidos}</div>
                                            </td>
                                            <td className="py-3 px-6 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded-lg bg-[#e6f6fd] text-[#00a2e1] text-[9px] font-black uppercase tracking-tight border border-[#00a2e1]/10">{c.area}</span>
                                            </td>
                                            <td className="py-3 px-6 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => edit(c)}
                                                    className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-[#00a3e0] shadow-sm hover:bg-[#00a3e0] hover:text-white transition-all transform hover:scale-105"
                                                    title="Editar"
                                                >
                                                    📝
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('¿Deseas eliminar este colaborador?')) destroy(route('admin.colaboradores.destroy', c.id)) }}
                                                    className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-24 text-center text-gray-400 italic">
                                                <div className="text-4xl mb-3">📭</div>
                                                <div className="font-bold">No hay coincidencias.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 bg-gray-50/50 border-t border-[#f1f5f9] flex justify-between items-center text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                             <div>Mostrando {filtered.length} de {colaboradores.length}</div>
                             {search && (
                                <button onClick={() => setSearch('')} className="text-[#00a2e1] hover:underline">Limpiar</button>
                             )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

