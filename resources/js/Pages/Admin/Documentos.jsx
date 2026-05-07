import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function fmtFecha(val) {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
}

function fmtDatetime(val) {
    if (!val) return '—';
    const d = new Date(val);
    return d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Documentos({ documentos = [], accesos = [] }) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editando, setEditando] = useState(null);
    const [tabActiva, setTabActiva] = useState('documentos');
    const [busqueda, setBusqueda] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        descripcion: '',
        archivo: null,
    });

    const editForm = useForm({
        titulo: '',
        descripcion: '',
        estado: true,
        archivo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.documentos.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const abrirEdicion = (doc) => {
        setEditando(doc);
        editForm.setData({
            titulo: doc.titulo,
            descripcion: doc.descripcion || '',
            estado: doc.estado,
            archivo: null,
        });
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        editForm.post(route('admin.documentos.update', editando.id), {
            forceFormData: true,
            onSuccess: () => setEditando(null),
        });
    };

    const toggleEstado = (id) => {
        router.patch(route('admin.documentos.estado', id), {}, { preserveScroll: true });
    };

    const eliminar = (id) => {
        router.delete(route('admin.documentos.destroy', id), {
            onSuccess: () => setConfirmDelete(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Documentos · Admin" />

            <div className="space-y-4">

                {/* Tabs */}
                <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-lg w-fit">
                    {[
                        { key: 'documentos', label: 'Documentos' },
                        { key: 'accesos',    label: `Log de accesos (${accesos.length})` },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTabActiva(t.key)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                tabActiva === t.key
                                    ? 'bg-white text-[#0284c7] shadow-sm'
                                    : 'text-[#64748b] hover:text-[#1e293b]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tabActiva === 'documentos' && (
                    <>
                        {/* Formulario subir */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                                Subir nuevo documento
                            </h3>
                            <form onSubmit={submit} className="flex flex-wrap gap-3 items-end">
                                <div className="flex flex-col gap-1 min-w-[220px] flex-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Título *</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                        placeholder="Ej: Reglamento interno 2026"
                                        value={data.titulo}
                                        onChange={e => setData('titulo', e.target.value)}
                                        required
                                    />
                                    {errors.titulo && <p className="text-red-500 text-[10px]">{errors.titulo}</p>}
                                </div>
                                <div className="flex flex-col gap-1 min-w-[220px] flex-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Descripción</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                        placeholder="Breve descripción (opcional)"
                                        value={data.descripcion}
                                        onChange={e => setData('descripcion', e.target.value)}
                                        maxLength={500}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Archivo PDF *</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#e0f2fe] file:text-[#0369a1]"
                                        onChange={e => setData('archivo', e.target.files[0])}
                                        required
                                    />
                                    {errors.archivo && <p className="text-red-500 text-[10px]">{errors.archivo}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50 whitespace-nowrap"
                                >
                                    {processing ? 'Subiendo...' : 'Subir documento'}
                                </button>
                            </form>
                        </div>

                        {/* Tabla documentos */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Documentos registrados</h3>
                                <span className="text-[9px] text-[#94a3b8] font-bold">{documentos.length} total</span>
                            </div>
                            {documentos.length === 0 ? (
                                <div className="py-16 text-center text-[#94a3b8] text-sm italic">No hay documentos registrados aún.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                            <th className="py-2 px-5 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Documento</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Accesos</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Estado</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Fecha</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f8fafc]">
                                        {documentos.map(doc => (
                                            <tr key={doc.id} className="hover:bg-[#f8fafc] transition-colors">
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                                <polyline points="14 2 14 8 20 8"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-[#1e293b]">{doc.titulo}</div>
                                                            {doc.descripcion && (
                                                                <div className="text-[10px] text-[#94a3b8] mt-0.5 max-w-sm truncate">{doc.descripcion}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-sm font-black text-[#0284c7]">{doc.accesos_count}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => toggleEstado(doc.id)}
                                                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest transition-colors ${
                                                            doc.estado
                                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                                : 'bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#e2e8f0]'
                                                        }`}
                                                    >
                                                        {doc.estado ? 'Activo' : 'Inactivo'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="text-[11px] text-[#64748b]">{fmtFecha(doc.created_at)}</span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <a
                                                            href={`/${doc.archivo}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] font-bold text-[#0284c7] hover:underline"
                                                        >
                                                            Ver
                                                        </a>
                                                        <button
                                                            onClick={() => abrirEdicion(doc)}
                                                            className="text-[10px] font-bold text-[#64748b] hover:underline"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDelete(doc.id)}
                                                            className="text-[10px] font-bold text-red-500 hover:underline"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {tabActiva === 'accesos' && (() => {
                    const q = busqueda.toLowerCase();
                    const filtrados = accesos.filter(a =>
                        (a.nombre_colaborador || '').toLowerCase().includes(q) ||
                        (a.cedula_colaborador || '').includes(q) ||
                        (a.documento?.titulo || '').toLowerCase().includes(q)
                    );
                    return (
                        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-3">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b] shrink-0">Log de accesos</h3>
                                <div className="flex-1 relative">
                                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre, cédula o documento..."
                                        value={busqueda}
                                        onChange={e => setBusqueda(e.target.value)}
                                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-[#f8fafc] outline-none focus:border-[#0284c7] transition-colors"
                                    />
                                </div>
                                <span className="text-[9px] text-[#94a3b8] font-bold shrink-0">{filtrados.length} de {accesos.length}</span>
                            </div>
                            {filtrados.length === 0 ? (
                                <div className="py-16 text-center text-[#94a3b8] text-sm italic">
                                    {accesos.length === 0 ? 'Aún no hay accesos registrados.' : 'Sin resultados para la búsqueda.'}
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                            <th className="py-2 px-5 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Documento abierto</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Fecha y hora</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f8fafc]">
                                        {filtrados.map(a => (
                                            <tr key={a.id} className="hover:bg-[#f8fafc] transition-colors">
                                                <td className="py-2.5 px-5">
                                                    <div className="text-xs font-semibold text-[#1e293b]">
                                                        {a.nombre_colaborador || <span className="text-[#94a3b8] italic font-normal">Sin nombre</span>}
                                                    </div>
                                                    <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">
                                                        {a.cedula_colaborador || '—'}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <span className="text-xs text-[#334155]">{a.documento?.titulo || '—'}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-right">
                                                    <span className="text-[11px] text-[#64748b]">{fmtDatetime(a.created_at)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    );
                })()}

            </div>

            {/* Modal editar documento */}
            {editando && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
                            <h3 className="font-bold text-[#0f172a] text-sm">Editar documento</h3>
                            <button onClick={() => setEditando(null)} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={guardarEdicion} className="p-6 space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Título *</label>
                                <input
                                    type="text"
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    value={editForm.data.titulo}
                                    onChange={e => editForm.setData('titulo', e.target.value)}
                                    required
                                />
                                {editForm.errors.titulo && <p className="text-red-500 text-[10px]">{editForm.errors.titulo}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Descripción</label>
                                <textarea
                                    rows={3}
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors resize-none"
                                    value={editForm.data.descripcion}
                                    onChange={e => editForm.setData('descripcion', e.target.value)}
                                    maxLength={500}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                <div className="flex gap-2">
                                    {[{ val: true, label: 'Activo' }, { val: false, label: 'Inactivo' }].map(op => (
                                        <button
                                            key={String(op.val)}
                                            type="button"
                                            onClick={() => editForm.setData('estado', op.val)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                                                editForm.data.estado === op.val
                                                    ? op.val
                                                        ? 'bg-green-50 border-green-300 text-green-700'
                                                        : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#64748b]'
                                                    : 'border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f8fafc]'
                                            }`}
                                        >
                                            {op.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Reemplazar PDF (opcional)</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#e0f2fe] file:text-[#0369a1]"
                                    onChange={e => editForm.setData('archivo', e.target.files[0] || null)}
                                />
                                {editForm.errors.archivo && <p className="text-red-500 text-[10px]">{editForm.errors.archivo}</p>}
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditando(null)}
                                    className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal confirmación eliminar */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-[#0f172a] text-sm">¿Eliminar documento?</h3>
                        <p className="text-xs text-[#64748b]">Esta acción eliminará el archivo del servidor y no se puede deshacer.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => eliminar(confirmDelete)}
                                className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
