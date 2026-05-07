import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Colaboradores({ auth, colaboradores, departamentos, importPreview, excelData }) {
    const [search, setSearch]       = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        id: null, documento: '', nombres: '', apellidos: '', area: '', activo: true,
    });

    const previewForm = useForm({ excel_file: null });
    const syncForm    = useForm({ excelData: null });

    useEffect(() => {
        if (excelData) syncForm.setData('excelData', excelData);
    }, [excelData]);

    const handlePreview = (e) => {
        e.preventDefault();
        previewForm.post(route('admin.colaboradores.preview'), { forceFormData: true, preserveState: true });
    };

    const handleSync = () => {
        if (!syncForm.data.excelData && excelData) {
            syncForm.post(route('admin.colaboradores.import'), { data: { excelData } });
        } else {
            syncForm.post(route('admin.colaboradores.import'));
        }
    };

    const filtered = colaboradores.filter(c =>
        (c.nombres + ' ' + c.apellidos).toLowerCase().includes(search.toLowerCase()) ||
        (c.documento || '').toLowerCase().includes(search.toLowerCase()) ||
        c.area.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.colaboradores.update', data.id), {
                onSuccess: () => { setIsEditing(false); reset(); },
            });
        } else {
            post(route('admin.colaboradores.store'), { onSuccess: () => reset() });
        }
    };

    const edit = (c) => {
        setData({ id: c.id, documento: c.documento || '', nombres: c.nombres, apellidos: c.apellidos, area: c.area, activo: c.activo !== false });
        setIsEditing(true);
    };

    const cancelEdit = () => { setIsEditing(false); reset(); };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Colaboradores" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Sidebar formulario */}
                <aside className="lg:col-span-3 lg:sticky lg:top-4 lg:self-start space-y-4">

                    {/* Formulario */}
                    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                            {isEditing ? 'Editar colaborador' : 'Nuevo colaborador'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Documento</label>
                                <input type="text" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    placeholder="Nº de documento" value={data.documento} onChange={e => setData('documento', e.target.value)} required />
                                {errors.documento && <p className="text-red-500 text-[10px]">{errors.documento}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Nombres</label>
                                <input type="text" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    placeholder="Nombres" value={data.nombres} onChange={e => setData('nombres', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Apellidos</label>
                                <input type="text" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    placeholder="Apellidos" value={data.apellidos} onChange={e => setData('apellidos', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                                <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    value={data.area} onChange={e => setData('area', e.target.value)} required>
                                    <option value="">Seleccione...</option>
                                    {departamentos?.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                                </select>
                            </div>
                            {isEditing && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                    <div className="flex gap-2">
                                        {[{ val: true, label: 'Activo' }, { val: false, label: 'Inactivo' }].map(op => (
                                            <button key={String(op.val)} type="button"
                                                onClick={() => setData('activo', op.val)}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                    data.activo === op.val
                                                        ? op.val ? 'bg-green-50 border-green-300 text-green-700' : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#64748b]'
                                                        : 'border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f8fafc]'
                                                }`}
                                            >{op.label}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 pt-1">
                                <button type="submit" disabled={processing}
                                    className="flex-1 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50">
                                    {processing ? 'Guardando...' : isEditing ? 'Guardar' : 'Registrar'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={cancelEdit}
                                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Importar */}
                    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                            Importar Excel
                        </h3>
                        <form onSubmit={handlePreview} className="space-y-2">
                            <input type="file" accept=".xlsx,.xls" required
                                className="w-full px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs bg-[#f8fafc] file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#e0f2fe] file:text-[#0369a1]"
                                onChange={e => previewForm.setData('excel_file', e.target.files[0])} />
                            <button type="submit" disabled={previewForm.processing}
                                className="w-full py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50">
                                {previewForm.processing ? 'Procesando...' : 'Validar archivo'}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Tabla */}
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#f1f5f9] flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                </svg>
                                <input type="text" placeholder="Buscar por nombre, ID o área..."
                                    className="w-full pl-8 pr-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <span className="text-[10px] text-[#94a3b8] font-bold ml-auto">{filtered.length} de {colaboradores.length}</span>
                            <a href={route('admin.colaboradores.export')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors whitespace-nowrap">
                                Exportar
                            </a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                        <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Documento</th>
                                        <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                        <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                        <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Estado</th>
                                        <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f8fafc]">
                                    {filtered.length > 0 ? filtered.map(c => (
                                        <tr key={c.id} className={`transition-colors ${c.activo === false ? 'opacity-50' : 'hover:bg-[#f8fafc]'}`}>
                                            <td className="py-2 px-4">
                                                <span className="text-[10px] font-mono text-[#94a3b8]">{c.documento || '—'}</span>
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="text-xs font-semibold text-[#1e293b]">{c.nombres} {c.apellidos}</div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#e0f2fe] text-[#0369a1] font-bold">{c.area}</span>
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                                    c.activo !== false ? 'bg-green-50 text-green-700' : 'bg-[#f1f5f9] text-[#94a3b8]'
                                                }`}>
                                                    {c.activo !== false ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => edit(c)} className="text-[10px] font-bold text-[#0284c7] hover:underline">Editar</button>
                                                    <button onClick={() => { if (confirm('¿Eliminar este colaborador?')) destroy(route('admin.colaboradores.destroy', c.id)) }}
                                                        className="text-[10px] font-bold text-red-500 hover:underline">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-16 text-center text-[#94a3b8] text-sm italic">No hay coincidencias.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal preview importación */}
            {importPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
                            <h3 className="font-bold text-sm text-[#0f172a]">Resumen de sincronización</h3>
                            <button onClick={() => window.location.reload()} className="text-[#94a3b8] hover:text-[#64748b]">✕</button>
                        </div>
                        <div className="p-5 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Ingresos', value: importPreview.create.length, color: 'text-green-600', bg: 'bg-green-50' },
                                    { label: 'Cambios',  value: importPreview.update.length, color: 'text-blue-600',  bg: 'bg-blue-50'  },
                                    { label: 'Bajas',    value: importPreview.delete.length, color: 'text-red-600',   bg: 'bg-red-50'   },
                                ].map(k => (
                                    <div key={k.label} className={`${k.bg} rounded-xl p-3 text-center`}>
                                        <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
                                        <div className={`text-[9px] font-black uppercase tracking-widest ${k.color}`}>{k.label}</div>
                                    </div>
                                ))}
                            </div>
                            {importPreview.delete.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                                    Los colaboradores ausentes en el archivo serán eliminados para mantener sincronización 1:1.
                                </div>
                            )}
                        </div>
                        <div className="px-5 py-4 border-t border-[#f1f5f9] flex gap-2">
                            <button onClick={() => window.location.reload()} className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] transition-colors">Cancelar</button>
                            <button onClick={handleSync} disabled={syncForm.processing} className="flex-1 py-2 bg-[#0284c7] text-white rounded-lg text-xs font-bold hover:bg-[#0369a1] transition-colors disabled:opacity-50">
                                {syncForm.processing ? 'Procesando...' : 'Ejecutar sincronización'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
