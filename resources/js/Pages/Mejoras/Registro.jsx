import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function RegistroMejoras({ colaboradores = [], categorias = [] }) {
    const [showModal, setShowModal]           = useState(false);
    const [showReporta, setShowReporta]       = useState(false);
    const [showResponsable, setShowResponsable] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        no_orden:              '',
        nombre_empleado:       '',
        nombre_responsable:    '',
        documento_responsable: '',
        area_responsable:      '',
        fecha_caso:            '',
        documento_empleado:    '',
        area:                  '',
        categoria:             '',
        descripcion:           '',
    });

    const filteredReporta = colaboradores.filter(c =>
        (c.nombres + ' ' + c.apellidos).toLowerCase().includes(data.nombre_empleado.toLowerCase())
    ).slice(0, 5);

    const filteredResponsable = colaboradores.filter(c =>
        (c.nombres + ' ' + c.apellidos).toLowerCase().includes(data.nombre_responsable.toLowerCase())
    ).slice(0, 5);

    const isReady = data.nombre_empleado.length >= 3
        && data.fecha_caso
        && data.area
        && data.categoria
        && data.descripcion.length >= 10;

    const enviar = () => {
        if (!isReady) return;
        post('/api/oportunidades', {
            preserveScroll: true,
            onSuccess: () => { setShowModal(true); reset(); },
        });
    };

    const responsableSeleccionado = data.nombre_responsable && data.area_responsable;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
            <Head title="Oportunidades de Mejora" />

            <style>{`
                .cat-chip { border: 1.5px solid #e2e8f0; transition: all 0.15s; cursor: pointer; }
                .cat-chip:hover { border-color: #0284c7; background: #e0f2fe; color: #0369a1; }
                .cat-chip.active { border-color: #0284c7; background: #e0f2fe; color: #0369a1; font-weight: 700; }
            `}</style>

            {/* Header */}
            <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                        <div>
                            <div className="text-[12px] font-bold text-[#0f172a] leading-tight">Gestión <span className="text-[#0284c7]">LFH</span></div>
                            <div className="text-[8px] text-[#94a3b8] font-medium uppercase tracking-widest">Oportunidades de mejora</div>
                        </div>
                    </div>
                    <a href="/consulta" className="text-[10px] font-bold text-[#0284c7] hover:underline">Mi historial →</a>
                </div>
            </header>

            <div className="px-6 py-6 max-w-5xl mx-auto">

                {/* Título */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-[#0f172a]">Registrar oportunidad de mejora</h1>
                    <p className="text-sm text-[#64748b] mt-1">Tu aporte es clave para mejorar nuestros procesos.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                    {/* Columna principal */}
                    <div className="space-y-4">

                        {/* Responsable — sección destacada */}
                        <div className="bg-white rounded-xl border-2 border-[#0284c7]/20 p-5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block"></span>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0284c7]">Responsable del caso</label>
                            </div>

                            {/* Tarjeta de responsable seleccionado */}
                            {responsableSeleccionado ? (
                                <div className="flex items-center gap-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#0284c7] flex items-center justify-center text-white font-black text-base shrink-0">
                                        {data.nombre_responsable.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-[14px] text-[#0f172a] leading-tight">{data.nombre_responsable}</div>
                                        <div className="text-[10px] text-[#0369a1] uppercase tracking-widest mt-0.5">{data.area_responsable}</div>
                                    </div>
                                    <button
                                        onClick={() => setData(p => ({ ...p, nombre_responsable: '', documento_responsable: '', area_responsable: '' }))}
                                        className="text-[#94a3b8] hover:text-[#dc2626] text-lg font-light transition-colors shrink-0"
                                    >×</button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-[13px] outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                        placeholder="Busca por nombre del responsable..."
                                        value={data.nombre_responsable}
                                        onChange={e => { setData('nombre_responsable', e.target.value); setShowResponsable(true); setShowReporta(false); }}
                                        onFocus={() => { setShowResponsable(true); setShowReporta(false); }}
                                    />
                                    {showResponsable && data.nombre_responsable.length > 1 && filteredResponsable.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-[#e2e8f0] mt-1 rounded-xl shadow-lg z-50 overflow-hidden">
                                            {filteredResponsable.map(c => (
                                                <div
                                                    key={c.id}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0f9ff] cursor-pointer border-b border-[#f8fafc] last:border-0"
                                                    onClick={() => {
                                                        setData(p => ({ ...p, nombre_responsable: c.nombres + ' ' + c.apellidos, documento_responsable: c.documento || '', area_responsable: c.area }));
                                                        setShowResponsable(false);
                                                    }}
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] font-black text-xs shrink-0">
                                                        {c.nombres.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[13px] text-[#0f172a]">{c.nombres} {c.apellidos}</div>
                                                        <div className="text-[9px] text-[#94a3b8] uppercase tracking-widest">{c.area}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {errors.nombre_responsable && <p className="text-red-500 text-xs mt-1">{errors.nombre_responsable}</p>}
                        </div>

                        {/* Categoría */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-3 block">Categoría de la oportunidad</label>
                            <div className="flex flex-wrap gap-2">
                                {categorias.map(cat => (
                                    <div
                                        key={cat}
                                        className={`cat-chip rounded-lg px-3 py-2 text-[12px] font-medium text-[#475569] ${data.categoria === cat ? 'active' : ''}`}
                                        onClick={() => setData('categoria', cat)}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                            {errors.categoria && <p className="text-red-500 text-xs mt-2">{errors.categoria}</p>}
                        </div>

                        {/* Descripción */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-3 block">Descripción detallada</label>
                            <textarea
                                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-[13px] outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors resize-none"
                                rows={5}
                                placeholder="Describe la situación que observaste, dónde ocurre, con qué frecuencia y cuál sería el impacto de mejorarla..."
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                            />
                            <div className="flex justify-end mt-1">
                                <span className={`text-[10px] ${data.descripcion.length < 10 ? 'text-[#94a3b8]' : 'text-green-500 font-bold'}`}>
                                    {data.descripcion.length} caracteres {data.descripcion.length >= 10 ? '— listo' : '(mín. 10)'}
                                </span>
                            </div>
                            {errors.descripcion && <p className="text-red-500 text-xs">{errors.descripcion}</p>}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sticky top-20 space-y-4">

                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-0.5">Datos del reporte</div>
                                <div className="text-[11px] text-[#94a3b8]">Completa los campos para registrar</div>
                            </div>

                            {/* Nº de orden */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Nº de orden</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors font-mono tracking-widest"
                                    placeholder="PED-2026-001"
                                    value={data.no_orden}
                                    onChange={e => setData('no_orden', e.target.value)}
                                />
                                {errors.no_orden && <p className="text-red-500 text-xs">{errors.no_orden}</p>}
                            </div>

                            {/* Fecha */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Fecha del caso</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#475569]"
                                    value={data.fecha_caso}
                                    onChange={e => setData('fecha_caso', e.target.value)}
                                />
                                {errors.fecha_caso && <p className="text-red-500 text-xs">{errors.fecha_caso}</p>}
                            </div>

                            {/* Reportado por */}
                            <div className="relative flex flex-col gap-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Reportado por</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    placeholder="Nombre de quien reporta..."
                                    value={data.nombre_empleado}
                                    onChange={e => { setData('nombre_empleado', e.target.value); setShowReporta(true); setShowResponsable(false); }}
                                    onFocus={() => { setShowReporta(true); setShowResponsable(false); }}
                                />
                                {showReporta && data.nombre_empleado.length > 1 && filteredReporta.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-[#e2e8f0] mt-1 rounded-xl shadow-lg z-50 overflow-hidden">
                                        {filteredReporta.map(c => (
                                            <div
                                                key={c.id}
                                                className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#f0f9ff] cursor-pointer border-b border-[#f8fafc] last:border-0"
                                                onClick={() => {
                                                    setData(p => ({ ...p, nombre_empleado: c.nombres + ' ' + c.apellidos, documento_empleado: c.documento || '', area: c.area }));
                                                    setShowReporta(false);
                                                }}
                                            >
                                                <div className="w-6 h-6 rounded-md bg-[#f1f5f9] flex items-center justify-center text-[#64748b] font-black text-xs shrink-0">
                                                    {c.nombres.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[12px] text-[#0f172a]">{c.nombres} {c.apellidos}</div>
                                                    <div className="text-[9px] text-[#94a3b8] uppercase">{c.area}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.nombre_empleado && <p className="text-red-500 text-xs">{errors.nombre_empleado}</p>}
                            </div>

                            {/* Separador */}
                            <div className="border-t border-[#f1f5f9]" />

                            {/* Checklist de completitud */}
                            <div className="space-y-1.5">
                                {[
                                    { label: 'Responsable',  ok: !!data.nombre_responsable },
                                    { label: 'Categoría',    ok: !!data.categoria },
                                    { label: 'Descripción',  ok: data.descripcion.length >= 10 },
                                    { label: 'Fecha',        ok: !!data.fecha_caso },
                                    { label: 'Reportado por',ok: data.nombre_empleado.length >= 3 },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${item.ok ? 'bg-green-500' : 'bg-[#f1f5f9]'}`}>
                                            {item.ok && (
                                                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-[11px] ${item.ok ? 'text-green-600 font-medium' : 'text-[#94a3b8]'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-3 rounded-xl font-bold text-[13px] transition-all ${isReady && !processing ? 'bg-[#0284c7] text-white hover:bg-[#0369a1] cursor-pointer' : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'}`}
                                disabled={!isReady || processing}
                                onClick={enviar}
                            >
                                {processing ? 'Enviando...' : 'Enviar reporte'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modal éxito */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl border border-[#e2e8f0]">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-[#0f172a] mb-2">Reporte enviado</h2>
                        <p className="text-[#64748b] text-sm">Tu oportunidad de mejora ha sido registrada correctamente. ¡Gracias por tu aporte!</p>
                        <button
                            onClick={() => { setShowModal(false); window.location.reload(); }}
                            className="mt-6 bg-[#0284c7] text-white py-2.5 px-8 rounded-xl font-bold text-sm hover:bg-[#0369a1] transition-colors"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {/* Botón admin */}
            <a
                href="/admin/dashboard"
                title="Acceso Administrador"
                className="fixed bottom-6 right-6 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e2e8f0] hover:border-[#0284c7] hover:bg-[#0284c7] group transition-all z-[100]"
            >
                <svg className="w-5 h-5 fill-[#64748b] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </a>
        </div>
    );
}
