import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

const ESTADO_CONFIG = {
    pendiente:     { label: 'Pendiente',     color: '#f59e0b', bg: '#fffbeb' },
    confirmado:    { label: 'Confirmado',    color: '#16a34a', bg: '#f0fdf4' },
    no_confirmado: { label: 'No confirmado', color: '#dc2626', bg: '#fef2f2' },
};

const HE_ESTADO = {
    pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb' },
    aprobado:  { label: 'Aprobado',  color: '#16a34a', bg: '#f0fdf4' },
    rechazado: { label: 'Rechazado', color: '#dc2626', bg: '#fef2f2' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

function KpiCard({ label, value, color }) {
    return (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
            <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">{label}</div>
                <div className="text-2xl font-black leading-none" style={{ color }}>{value}</div>
            </div>
            <div className="w-1.5 h-8 rounded-full opacity-20" style={{ background: color }} />
        </div>
    );
}

function FormHorasExtras({ nombreEmpleado, documento }) {
    const [fields, setFields] = useState({ fecha: '', horas: '', motivo: '' });
    const [processing, setProcessing] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (k, v) => setFields(p => ({ ...p, [k]: v }));

    const enviar = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.post(route('horas-extras.store'), {
                nombre_empleado:    nombreEmpleado || '',
                documento_empleado: documento || '',
                ...fields,
                nombre_autorizador: '—',
            });
            setFields({ fecha: '', horas: '', motivo: '' });
            setEnviado(true);
            setTimeout(() => setEnviado(false), 4000);
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors || {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={enviar} className="space-y-3">
            {enviado && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-xs text-green-700 font-medium">
                    Horas extras registradas correctamente.
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Fecha</label>
                    <input
                        type="date"
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#8b5cf6] transition-colors text-[#475569]"
                        value={fields.fecha}
                        onChange={e => set('fecha', e.target.value)}
                        required
                    />
                    {errors.fecha && <p className="text-red-500 text-[10px]">{errors.fecha[0]}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Horas</label>
                    <input
                        type="number"
                        min="0.5" max="24" step="0.5"
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#8b5cf6] transition-colors"
                        placeholder="Ej: 2.5"
                        value={fields.horas}
                        onChange={e => set('horas', e.target.value)}
                        required
                    />
                    {errors.horas && <p className="text-red-500 text-[10px]">{errors.horas[0]}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Motivo</label>
                <textarea
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#8b5cf6] transition-colors resize-none"
                    rows={3}
                    placeholder="Describe el motivo de las horas extras..."
                    value={fields.motivo}
                    onChange={e => set('motivo', e.target.value)}
                    required
                />
                {errors.motivo && <p className="text-red-500 text-[10px]">{errors.motivo[0]}</p>}
            </div>
            <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 bg-[#8b5cf6] text-white rounded-lg font-bold text-xs hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
            >
                {processing ? 'Registrando...' : 'Registrar horas extras'}
            </button>
        </form>
    );
}

function SeccionDocumentos({ documentos, cedula }) {
    if (!documentos || documentos.length === 0) return null;
    return (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
                <h2 className="text-[9px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                    Documentos disponibles
                </h2>
                <span className="text-[9px] font-bold text-[#94a3b8] bg-[#f8fafc] border border-[#f1f5f9] px-2 py-0.5 rounded-md">{documentos.length} documentos</span>
            </div>
            <div className="divide-y divide-[#f8fafc]">
                {documentos.map(doc => (
                    <div key={doc.id} className="px-5 py-3 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-[#1e293b] truncate">{doc.titulo}</div>
                            {doc.descripcion && <div className="text-[10px] text-[#94a3b8] mt-0.5 truncate">{doc.descripcion}</div>}
                        </div>
                        <a
                            href={route('documentos.acceder', { documento: doc.id, cedula: cedula || '' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-3 py-1.5 bg-[#e0f2fe] text-[#0369a1] rounded-lg text-[10px] font-bold hover:bg-[#bae6fd] transition-colors"
                        >
                            Ver / Imprimir
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Consulta({ resultado, documento, fecha_inicio, fecha_fin, colaboradores = [], documentos = [], anuncio = null }) {
    const { data, setData, post, processing, errors } = useForm({
        documento:    documento    || '',
        fecha_inicio: fecha_inicio || '',
        fecha_fin:    fecha_fin    || '',
    });

    const [modalAbierto, setModalAbierto] = useState(!!anuncio);

    const buscar = (e) => { e.preventDefault(); post(route('consulta.buscar')); };

    const noEncontrado = resultado && !resultado.colaborador
        && resultado.total_pausas === 0
        && resultado.op_total === 0;

    const colab = resultado?.colaborador;

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
            <Head title="Mi Gestión · LFH" />

            {/* Header */}
            <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
                <div className="px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                        <div>
                            <div className="text-[12px] font-bold text-[#0f172a] leading-tight">Gestión <span className="text-[#0284c7]">LFH</span></div>
                            <div className="text-[8px] text-[#94a3b8] font-medium uppercase tracking-widest">Portal del colaborador</div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#94a3b8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Salir
                    </button>
                </div>
            </header>

            {/* Modal anuncio */}
            {modalAbierto && anuncio && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black">
                    <img
                        src={`/${anuncio.imagen}`}
                        alt={anuncio.titulo}
                        className="flex-1 w-full h-full object-contain"
                    />
                    <div className="bg-black/80 px-6 py-4 flex items-center justify-between shrink-0">
                        <span className="text-sm font-semibold text-white">{anuncio.titulo}</span>
                        <button
                            onClick={() => setModalAbierto(false)}
                            className="px-6 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-sm hover:bg-[#0369a1] transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <div className="px-6 py-6 space-y-5">

                {/* Tarjeta de búsqueda */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
                    <form onSubmit={buscar} className="flex flex-wrap gap-3 items-end">
                        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Número de documento</label>
                            <input
                                type="text"
                                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors tracking-widest"
                                placeholder="Ej: 10293847"
                                value={data.documento}
                                onChange={e => setData('documento', e.target.value)}
                                required
                            />
                            {errors.documento && <p className="text-red-500 text-[10px]">{errors.documento}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Desde</label>
                            <input
                                type="date"
                                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#64748b]"
                                value={data.fecha_inicio}
                                onChange={e => setData('fecha_inicio', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hasta</label>
                            <input
                                type="date"
                                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#64748b]"
                                value={data.fecha_fin}
                                onChange={e => setData('fecha_fin', e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-sm hover:bg-[#0369a1] transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                            {processing ? 'Buscando...' : 'Consultar'}
                        </button>
                    </form>
                </div>

                {/* Estado inicial */}
                {!resultado && (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-14 h-14 bg-[#e0f2fe] rounded-2xl flex items-center justify-center mb-5">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-[#0f172a] mb-1">Ingresa tu número de documento</h2>
                        <p className="text-[#94a3b8] text-sm max-w-xs">Consulta tus pausas activas, oportunidades de mejora y horas extras registradas.</p>
                    </div>
                )}

                {/* No encontrado */}
                {noEncontrado && (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-14 h-14 bg-[#fef2f2] rounded-2xl flex items-center justify-center mb-5">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <div className="font-bold text-[#0f172a] text-base mb-1">Documento no encontrado</div>
                        <p className="text-[#94a3b8] text-sm">Verifica el número ingresado o contacta a tu administrador.</p>
                    </div>
                )}

                {/* Resultados */}
                {resultado && !noEncontrado && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                        {/* Columna izquierda: perfil + documentos + horas extras */}
                        <div className="space-y-4">

                            {/* Perfil */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-lg font-black text-[#0284c7] shrink-0">
                                        {colab ? colab.nombres.charAt(0) : '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-[#0f172a] leading-tight">
                                            {colab ? `${colab.nombres} ${colab.apellidos}` : 'Colaborador'}
                                        </div>
                                        <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mt-0.5">
                                            {colab?.area || '—'}
                                        </div>
                                    </div>
                                </div>
                                {(data.fecha_inicio || data.fecha_fin) && (
                                    <div className="text-center border-t border-[#f1f5f9] pt-3">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Período</div>
                                        <div className="text-[10px] font-bold text-[#334155] mt-0.5">{fmtFecha(data.fecha_inicio)} — {fmtFecha(data.fecha_fin)}</div>
                                    </div>
                                )}
                            </div>

                            {/* Documentos */}
                            <SeccionDocumentos documentos={documentos} cedula={data.documento} />

                            {/* Horas extras */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#f1f5f9]">
                                    <h2 className="text-[9px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] inline-block" />
                                        Registrar horas extras
                                    </h2>
                                </div>
                                <div className="p-5">
                                    <FormHorasExtras
                                        nombreEmpleado={colab ? `${colab.nombres} ${colab.apellidos}` : ''}
                                        documento={data.documento}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Columna derecha: KPIs + oportunidades */}
                        <div className="lg:col-span-2 space-y-4">

                            {/* KPIs */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] inline-block" /> Pausas activas
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <KpiCard label="Total pausas"    value={resultado.total_pausas}  color="#0284c7" />
                                        <KpiCard label="Minutos totales" value={resultado.total_minutos} color="#0ea5e9" />
                                        <KpiCard label="Este mes"        value={resultado.pausas_mes}    color="#8b5cf6" />
                                        <KpiCard label="Esta semana"     value={resultado.pausas_semana} color="#22c55e" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" /> Oportunidades de mejora
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <KpiCard label="Total reportes"  value={resultado.op_total}          color="#64748b" />
                                        <KpiCard label="Pendientes"      value={resultado.op_pendientes}     color="#f59e0b" />
                                        <KpiCard label="Confirmados"     value={resultado.op_confirmadas}    color="#16a34a" />
                                        <KpiCard label="No confirmados"  value={resultado.op_no_confirmadas} color="#dc2626" />
                                    </div>
                                </div>
                            </div>

                            {/* Oportunidades */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
                                    <h2 className="text-[9px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                                        Mis oportunidades de mejora
                                    </h2>
                                    <span className="text-[9px] font-black text-[#94a3b8] bg-[#f8fafc] border border-[#f1f5f9] px-2 py-0.5 rounded-md">{resultado.oportunidades.length} registros</span>
                                </div>
                                {resultado.oportunidades.length === 0 ? (
                                    <div className="flex items-center justify-center py-16 text-[#94a3b8] text-sm italic">
                                        Sin reportes registrados
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f8fafc] overflow-y-auto max-h-[520px]">
                                        {resultado.oportunidades.map(o => {
                                            const cfg = ESTADO_CONFIG[o.estado] || ESTADO_CONFIG.pendiente;
                                            return (
                                                <div key={o.id} className="px-5 py-3.5 hover:bg-[#f8fafc] transition-colors">
                                                    <div className="flex items-start justify-between gap-3 mb-1.5">
                                                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                                            {o.no_orden && (
                                                                <span className="text-[9px] font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded font-mono tracking-widest shrink-0">{o.no_orden}</span>
                                                            )}
                                                            <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-widest shrink-0">{o.categoria}</span>
                                                            {o.area_responsable && (
                                                                <span className="text-[9px] text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded shrink-0">{o.area_responsable}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                                                            {cfg.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] text-[#94a3b8] mb-1">
                                                        Fecha: <span className="font-bold text-[#64748b]">{fmtFecha(o.fecha_caso)}</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#475569] leading-relaxed italic">"{o.descripcion}"</p>
                                                    {o.observacion_admin && (
                                                        <div className="mt-2 bg-[#fffbeb] rounded-lg p-2.5 border border-[#fde68a]">
                                                            <div className="text-[7px] font-black uppercase tracking-widest text-[#f59e0b] mb-1">Respuesta admin</div>
                                                            <p className="text-[11px] text-[#92400e] leading-relaxed">{o.observacion_admin}</p>
                                                        </div>
                                                    )}
                                                    {o.revisado_por && (
                                                        <div className="mt-1.5 text-[9px] text-[#94a3b8]">
                                                            Revisado por <span className="text-[#0284c7] font-semibold">{o.revisado_por}</span> · {fmtFecha(o.fecha_revision)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
