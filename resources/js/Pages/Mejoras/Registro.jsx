import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const toISO = (dmy) => {
    if (!dmy) return '';
    const [d, m, y] = dmy.split('/');
    if (!d || !m || !y || y.length !== 4) return '';
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

export default function RegistroMejoras({ colaboradores = [], categorias = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [showReporta, setShowReporta] = useState(false);
    const [showResponsable, setShowResponsable] = useState(false);
    const [fechaCasoDisplay, setFechaCasoDisplay] = useState('');

    const { data, setData, post, reset, processing, errors } = useForm({
        no_orden:               '',
        nombre_empleado:        '',
        nombre_responsable:     '',
        documento_responsable:  '',
        area_responsable:       '',
        fecha_caso:             '',
        documento_empleado:     '',
        area:                   '',
        categoria:              '',
        descripcion:            '',
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
            onSuccess: () => {
                setShowModal(true);
                reset();
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#f0faff] p-4 font-['Outfit'] text-[#1e293b]">
            <Head title="Oportunidades de Mejora" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
                .cat-card { border: 2px solid transparent; transition: all 0.2s; cursor: pointer; }
                .cat-card:hover { border-color: #00a3e0; background: #e6f6fd; }
                .cat-card.active { border-color: #00a3e0; background: #e6f6fd; }
            `}</style>

            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-[32px] font-black text-[#1a202c] leading-tight">
                        Reporte de <span className="text-[#00a3e0]">Oportunidades</span> de Mejora
                    </h1>
                    <p className="text-[#64748b] text-[15px] mt-2 max-w-xl mx-auto">
                        Tu aporte es clave para mejorar nuestros procesos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                    {/* Columna Izquierda: Formulario principal */}
                    <div className="space-y-5">

                        {/* Categorías */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#edf2f7]">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-4 block">
                                1. Categoría de la Oportunidad
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {categorias.map(cat => (
                                    <div
                                        key={cat}
                                        className={`cat-card rounded-xl p-3 text-center ${data.categoria === cat ? 'active' : ''}`}
                                        onClick={() => setData('categoria', cat)}
                                    >
                                        <div className="text-[13px] font-bold text-[#1a202c]">{cat}</div>
                                    </div>
                                ))}
                            </div>
                            {errors.categoria && <p className="text-red-500 text-xs mt-2">{errors.categoria}</p>}
                        </div>

                        {/* Descripción */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#edf2f7]">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-3 block">
                                2. Descripción detallada
                            </label>
                            <textarea
                                className="w-full p-4 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors resize-none"
                                rows={5}
                                placeholder="Describe la situación que observaste, dónde ocurre, con qué frecuencia y cuál sería el impacto de mejorarla..."
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.descripcion && <p className="text-red-500 text-xs">{errors.descripcion}</p>}
                                <span className={`text-xs ml-auto ${data.descripcion.length < 10 ? 'text-gray-400' : 'text-green-500'}`}>
                                    {data.descripcion.length} caracteres {data.descripcion.length < 10 ? '(mín. 10)' : '✓'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Datos del colaborador + envío */}
                    <aside className="bg-white rounded-2xl p-6 flex flex-col gap-5 border border-[#edf2f7] shadow-sm sticky top-4 h-fit">
                        <div>
                            <h2 className="text-[18px] font-bold">Datos del Reporte</h2>
                        </div>

                        {/* No de orden */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase text-[#64748b]">Nº de Orden del Pedido</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors"
                                placeholder="Ej: PED-2026-001"
                                value={data.no_orden}
                                onChange={e => setData('no_orden', e.target.value)}
                            />
                            {errors.no_orden && <p className="text-red-500 text-xs">{errors.no_orden}</p>}
                        </div>

                        {/* Fecha del caso */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase text-[#64748b]">Fecha del Caso</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors"
                                value={data.fecha_caso}
                                onChange={e => setData('fecha_caso', e.target.value)}
                            />
                            {errors.fecha_caso && <p className="text-red-500 text-xs">{errors.fecha_caso}</p>}
                        </div>

                        {/* Responsable del error */}
                        <div className="relative flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase text-[#64748b]">Responsable del caso</label>
                            <p className="text-[10px] text-[#94a3b8] -mt-1">Persona que originó o debe gestionar la oportunidad</p>
                            <input
                                type="text"
                                className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors"
                                placeholder="Nombre del responsable..."
                                value={data.nombre_responsable}
                                onChange={e => { setData('nombre_responsable', e.target.value); setShowResponsable(true); setShowReporta(false); }}
                                onFocus={() => { setShowResponsable(true); setShowReporta(false); }}
                            />
                            {showResponsable && data.nombre_responsable.length > 1 && filteredResponsable.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {filteredResponsable.map(c => (
                                        <div
                                            key={c.id}
                                            className="p-3 hover:bg-[#e6f6fd] cursor-pointer text-sm border-b border-gray-50 last:border-0"
                                            onClick={() => {
                                                setData(prev => ({
                                                    ...prev,
                                                    nombre_responsable:    c.nombres + ' ' + c.apellidos,
                                                    documento_responsable: c.documento || '',
                                                    area_responsable:      c.area,
                                                }));
                                                setShowResponsable(false);
                                            }}
                                        >
                                            <div className="font-bold text-[#1a202c]">{c.nombres} {c.apellidos}</div>
                                            <div className="text-[10px] text-[#94a3b8] uppercase">{c.area}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.nombre_responsable && <p className="text-red-500 text-xs">{errors.nombre_responsable}</p>}
                        </div>

                        {/* Quien reporta */}
                        <div className="relative flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase text-[#64748b]">Reportado por</label>
                            <p className="text-[10px] text-[#94a3b8] -mt-1">Persona que identifica y registra la oportunidad</p>
                            <input
                                type="text"
                                className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors"
                                placeholder="Nombre de quien reporta..."
                                value={data.nombre_empleado}
                                onChange={e => { setData('nombre_empleado', e.target.value); setShowReporta(true); setShowResponsable(false); }}
                                onFocus={() => { setShowReporta(true); setShowResponsable(false); }}
                            />
                            {showReporta && data.nombre_empleado.length > 1 && filteredReporta.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {filteredReporta.map(c => (
                                        <div
                                            key={c.id}
                                            className="p-3 hover:bg-[#e6f6fd] cursor-pointer text-sm border-b border-gray-50 last:border-0"
                                            onClick={() => {
                                                setData(prev => ({
                                                    ...prev,
                                                    nombre_empleado:    c.nombres + ' ' + c.apellidos,
                                                    documento_empleado: c.documento || '',
                                                    area:               c.area,
                                                }));
                                                setShowReporta(false);
                                            }}
                                        >
                                            <div className="font-bold text-[#1a202c]">{c.nombres} {c.apellidos}</div>
                                            <div className="text-[10px] text-[#94a3b8] uppercase">{c.area}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.nombre_empleado && <p className="text-red-500 text-xs">{errors.nombre_empleado}</p>}
                        </div>

                        <button
                            className={`w-full p-4 rounded-xl font-bold text-[14px] uppercase transition-all ${isReady && !processing ? 'bg-[#00a3e0] text-white shadow-lg shadow-[#00a3e0]/30 cursor-pointer' : 'bg-[#cbd5e1] text-white cursor-not-allowed opacity-50'}`}
                            disabled={!isReady || processing}
                            onClick={enviar}
                        >
                            {processing ? 'Enviando...' : 'Enviar Reporte'}
                        </button>
                    </aside>
                </div>
            </div>

            {/* Modal éxito */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white p-8 rounded-[20px] text-center max-w-sm w-full shadow-2xl">
                        <div className="text-[40px] mb-4">✅</div>
                        <h2 className="text-[22px] font-bold text-[#00a3e0] mb-2">¡Reporte Enviado!</h2>
                        <p className="text-[#64748b] text-[14px]">Tu oportunidad de mejora ha sido registrada. ¡Gracias por tu aporte!</p>
                        <button
                            onClick={() => { setShowModal(false); window.location.reload(); }}
                            className="mt-6 bg-[#00a3e0] text-white py-3 px-8 rounded-lg font-bold hover:scale-105 transition-transform cursor-pointer"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {/* Botón Admin Flotante */}
            <a
                href="/dashboard"
                className="fixed bottom-8 right-8 w-[55px] h-[55px] bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#00a3e0] hover:scale-110 hover:bg-[#00a3e0] group transition-all z-[1000]"
                title="Acceso Administrador"
            >
                <svg className="w-6 h-6 fill-[#00a3e0] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </a>
        </div>
    );
}
