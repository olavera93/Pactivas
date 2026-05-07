import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function fmtFecha(val) {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
}

export default function Anuncios({ anuncios = [] }) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        imagen: null,
    });

    const activo = anuncios.find(a => a.activo);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.anuncios.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); },
        });
    };

    const activar = (id) => router.patch(route('admin.anuncios.activar', id), {}, { preserveScroll: true });
    const desactivar = (id) => router.patch(route('admin.anuncios.desactivar', id), {}, { preserveScroll: true });
    const eliminar = (id) => router.delete(route('admin.anuncios.destroy', id), { onSuccess: () => setConfirmDelete(null) });

    return (
        <AuthenticatedLayout>
            <Head title="Anuncios · Admin" />

            <div className="space-y-5">

                {/* Anuncio activo */}
                {activo && (
                    <div className="bg-white rounded-xl border-2 border-[#0284c7]/20 overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Anuncio activo ahora</h3>
                        </div>
                        <div className="p-5 flex items-center gap-5">
                            <img
                                src={`/${activo.imagen}`}
                                alt={activo.titulo}
                                className="w-32 h-24 object-cover rounded-lg border border-[#e2e8f0] cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setPreview(activo)}
                            />
                            <div className="flex-1">
                                <div className="font-bold text-sm text-[#0f172a]">{activo.titulo}</div>
                                <div className="text-[10px] text-[#94a3b8] mt-0.5">Subido el {fmtFecha(activo.created_at)}</div>
                                <button
                                    onClick={() => desactivar(activo.id)}
                                    className="mt-3 px-3 py-1.5 text-[10px] font-bold text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors"
                                >
                                    Desactivar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                    {/* Formulario */}
                    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                            Subir nuevo anuncio
                        </h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Título *</label>
                                <input
                                    type="text"
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    placeholder="Ej: Aviso de seguridad mayo"
                                    value={data.titulo}
                                    onChange={e => setData('titulo', e.target.value)}
                                    required
                                />
                                {errors.titulo && <p className="text-red-500 text-[10px]">{errors.titulo}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Imagen *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#e0f2fe] file:text-[#0369a1]"
                                    onChange={e => {
                                        const f = e.target.files[0];
                                        setData('imagen', f);
                                        setPreview(f ? { imagen: URL.createObjectURL(f) } : null);
                                    }}
                                    required
                                />
                                {errors.imagen && <p className="text-red-500 text-[10px]">{errors.imagen}</p>}
                            </div>
                            {preview && (
                                <img src={preview.imagen ? `/${preview.imagen}` : preview} alt="preview" className="w-full rounded-lg border border-[#e2e8f0] object-cover max-h-40" />
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Subiendo...' : 'Subir anuncio'}
                            </button>
                        </form>
                    </div>

                    {/* Lista */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Todos los anuncios</h3>
                            <span className="text-[9px] text-[#94a3b8] font-bold">{anuncios.length} total</span>
                        </div>
                        {anuncios.length === 0 ? (
                            <div className="py-16 text-center text-[#94a3b8] text-sm italic">No hay anuncios registrados.</div>
                        ) : (
                            <div className="divide-y divide-[#f8fafc]">
                                {anuncios.map(a => (
                                    <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8fafc] transition-colors">
                                        <img
                                            src={`/${a.imagen}`}
                                            alt={a.titulo}
                                            className="w-16 h-12 object-cover rounded-lg border border-[#e2e8f0] shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setPreview(a)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-[#1e293b] truncate">{a.titulo}</div>
                                            <div className="text-[10px] text-[#94a3b8] mt-0.5">{fmtFecha(a.created_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {a.activo ? (
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Activo
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => activar(a.id)}
                                                    className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] hover:bg-[#e0f2fe] hover:text-[#0284c7] transition-colors"
                                                >
                                                    Activar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setConfirmDelete(a.id)}
                                                className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Modal preview imagen */}
            {preview && preview.imagen && !preview.titulo?.startsWith('blob') && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreview(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-[#64748b] hover:text-[#0f172a] transition-colors z-10"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                        <img src={`/${preview.imagen}`} alt={preview.titulo} className="w-full rounded-xl shadow-2xl" />
                        <div className="text-center mt-3 text-white text-sm font-semibold">{preview.titulo}</div>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-[#0f172a] text-sm">¿Eliminar anuncio?</h3>
                        <p className="text-xs text-[#64748b]">La imagen se eliminará del servidor permanentemente.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button onClick={() => eliminar(confirmDelete)} className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
