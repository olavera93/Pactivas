import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const ESTADO_CONFIG = {
    pendiente:     { label: 'Pendiente',     color: '#f59e0b', bg: '#fffbeb' },
    confirmado:    { label: 'Confirmado',    color: '#16a34a', bg: '#f0fdf4' },
    no_confirmado: { label: 'No confirmado', color: '#dc2626', bg: '#fef2f2' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

function KpiCard({ label, value, sub, color }) {
    return (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex items-center justify-between">
            <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">{label}</div>
                <div className="text-2xl font-black leading-none" style={{ color }}>{value}</div>
                {sub && <div className="text-[10px] text-[#94a3b8] mt-1">{sub}</div>}
            </div>
            <div className="w-2 h-8 rounded-full opacity-30" style={{ background: color }} />
        </div>
    );
}

function SectionHeader({ label, count, color = '#00a3e0' }) {
    return (
        <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                {label}
            </h2>
            {count !== undefined && (
                <span className="text-[9px] font-black text-[#94a3b8] bg-[#f8fafc] border border-[#f1f5f9] px-2 py-0.5 rounded-md">{count} registros</span>
            )}
        </div>
    );
}

const HE_ESTADO = {
    pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb' },
    aprobado:  { label: 'Aprobado',  color: '#16a34a', bg: '#f0fdf4' },
    rechazado: { label: 'Rechazado', color: '#dc2626', bg: '#fef2f2' },
};

function FormHorasExtras({ nombreEmpleado, documento, colaboradores = [] }) {
    const [fields, setFields] = useState({ fecha: '', horas: '', motivo: '' });
    const [processing, setProcessing] = useState(false);
    const [enviado, setEnviado]       = useState(false);
    const [errors, setErrors]         = useState({});

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
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
                    Horas extras registradas correctamente.
                </div>
            )}
            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Fecha</label>
                <input
                    type="date"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#475569]"
                    value={fields.fecha}
                    onChange={e => set('fecha', e.target.value)}
                    required
                />
                {errors.fecha && <p className="text-red-500 text-xs">{errors.fecha[0]}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Cantidad de horas</label>
                <input
                    type="number"
                    min="0.5" max="24" step="0.5"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                    placeholder="Ej: 2.5"
                    value={fields.horas}
                    onChange={e => set('horas', e.target.value)}
                    required
                />
                {errors.horas && <p className="text-red-500 text-xs">{errors.horas[0]}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Motivo</label>
                <textarea
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors resize-none"
                    rows={3}
                    placeholder="Describe el motivo de las horas extras..."
                    value={fields.motivo}
                    onChange={e => set('motivo', e.target.value)}
                    required
                />
                {errors.motivo && <p className="text-red-500 text-xs">{errors.motivo[0]}</p>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 bg-[#0284c7] text-white rounded-xl font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50"
            >
                {processing ? 'Registrando...' : 'Registrar horas extras'}
            </button>
        </form>
    );
}

export default function Consulta({ resultado, documento, fecha_inicio, fecha_fin, colaboradores = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        documento:    documento    || '',
        fecha_inicio: fecha_inicio || '',
        fecha_fin:    fecha_fin    || '',
    });

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
                <div className="px-6 py-3 flex items-center gap-4">
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                        <div>
                            <div className="text-[12px] font-bold text-[#0f172a] leading-tight">Gestión <span className="text-[#0284c7]">LFH</span></div>
                            <div className="text-[8px] text-[#94a3b8] font-medium uppercase tracking-widest">Consulta de gestión</div>
                        </div>
                    </div>

                    <form onSubmit={buscar} className="flex gap-2 flex-1 ml-4 flex-wrap justify-end items-center">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[7px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Documento</label>
                            <input
                                type="text"
                                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors tracking-widest w-40"
                                placeholder="Nº de documento..."
                                value={data.documento}
                                onChange={e => setData('documento', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[7px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Desde</label>
                            <input
                                type="date"
                                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#64748b]"
                                value={data.fecha_inicio}
                                onChange={e => setData('fecha_inicio', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label className="text-[7px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Hasta</label>
                            <input
                                type="date"
                                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors text-[#64748b]"
                                value={data.fecha_fin}
                                onChange={e => setData('fecha_fin', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-[7px] opacity-0 px-0.5">.</label>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-1.5 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                                {processing ? 'Buscando...' : 'Consultar'}
                            </button>
                        </div>
                        {errors.documento && <p className="text-red-500 text-xs w-full">{errors.documento}</p>}
                    </form>
                </div>
            </header>

            <div className="px-6 py-6">

                {/* Estado inicial */}
                {!resultado && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-12 h-12 bg-[#e0f2fe] rounded-xl flex items-center justify-center mb-5">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-[#0f172a] mb-2">Consulta tu historial</h2>
                        <p className="text-[#64748b] text-sm max-w-xs">Ingresa tu número de documento para ver tus pausas activas y los reportes de oportunidades de mejora asociados.</p>
                    </div>
                )}

                {/* No encontrado */}
                {noEncontrado && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-12 h-12 bg-[#fef2f2] rounded-xl flex items-center justify-center mb-5">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </div>
                        <div className="font-bold text-gray-700 text-base mb-1">Documento no encontrado</div>
                        <p className="text-[#64748b] text-sm">Verifica el número ingresado o contacta a tu administrador.</p>
                    </div>
                )}

                {/* Resultados */}
                {resultado && !noEncontrado && (
                    <div className="space-y-4">

                        {/* Perfil */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-xl font-black text-[#0284c7] shrink-0">
                                {colab ? colab.nombres.charAt(0) : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[15px] text-[#0f172a] leading-tight">
                                    {colab ? `${colab.nombres} ${colab.apellidos}` : 'Colaborador'}
                                </div>
                                <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mt-0.5">
                                    {colab?.area || '—'} &mdash; Doc. {data.documento}
                                </div>
                            </div>
                            {(data.fecha_inicio || data.fecha_fin) && (
                                <div className="text-right shrink-0">
                                    <div className="text-[7px] font-black uppercase tracking-widest text-[#94a3b8]">Período</div>
                                    <div className="text-xs font-bold text-[#334155]">{fmtFecha(data.fecha_inicio)} — {fmtFecha(data.fecha_fin)}</div>
                                </div>
                            )}
                        </div>

                        {/* KPIs + Formulario */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Izquierda: KPIs comprimidos */}
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] inline-block" /> Pausas activas
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <KpiCard label="Total pausas"    value={resultado.total_pausas}  sub="Historial completo" color="#0284c7" />
                                        <KpiCard label="Minutos totales" value={resultado.total_minutos} sub="Tiempo acumulado"   color="#0ea5e9" />
                                        <KpiCard label="Este mes"        value={resultado.pausas_mes}    sub="Mes actual"         color="#8b5cf6" />
                                        <KpiCard label="Esta semana"     value={resultado.pausas_semana} sub="Semana actual"      color="#22c55e" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" /> Oportunidades de mejora
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <KpiCard label="Total reportes"  value={resultado.op_total}          sub="Historial completo" color="#64748b" />
                                        <KpiCard label="Pendientes"      value={resultado.op_pendientes}     sub="Aguarda revisión"   color="#f59e0b" />
                                        <KpiCard label="Confirmados"     value={resultado.op_confirmadas}    sub="Gestionados"        color="#16a34a" />
                                        <KpiCard label="No confirmados"  value={resultado.op_no_confirmadas} sub="Sin confirmar"      color="#dc2626" />
                                    </div>
                                </div>
                            </div>

                            {/* Derecha: Formulario horas extras */}
                            <div className="bg-white rounded-xl border-2 border-[#8b5cf6]/20 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-[#8b5cf6] inline-block" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]">Registrar horas extras</h3>
                                </div>
                                <FormHorasExtras
                                    nombreEmpleado={colab ? `${colab.nombres} ${colab.apellidos}` : ''}
                                    documento={data.documento}
                                    colaboradores={colaboradores}
                                />
                            </div>
                        </div>

                        {/* Tablas detalle */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Pausas */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden flex flex-col">
                                <SectionHeader label="Últimas pausas activas" count={resultado.ultimas_pausas.length} color="#0284c7" />
                                {resultado.ultimas_pausas.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-[#94a3b8]">
                                        <div className="text-sm font-medium italic">Sin registros de pausas</div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                                    <th className="py-2 px-5 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Ejercicios</th>
                                                    <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Min</th>
                                                    <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f8fafc]">
                                                {resultado.ultimas_pausas.map(r => (
                                                    <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors">
                                                        <td className="py-2.5 px-5">
                                                            <div className="text-[12px] font-medium text-[#334155]">{r.ejercicios_realizados}</div>
                                                            <div className="text-[9px] text-[#94a3b8] uppercase tracking-widest mt-0.5">{r.area}</div>
                                                        </td>
                                                        <td className="py-2.5 px-4 text-center">
                                                            <span className="text-[13px] font-black text-[#0284c7]">{r.duracion_minutos}′</span>
                                                        </td>
                                                        <td className="py-2.5 px-4 text-right">
                                                            <span className="text-[11px] text-[#64748b]">{fmtFecha(r.created_at)}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Oportunidades */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden flex flex-col">
                                <SectionHeader label="Mis reportes de oportunidades" count={resultado.oportunidades.length} color="#f472b6" />
                                {resultado.oportunidades.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-[#94a3b8]">
                                        <div className="text-sm font-medium italic">Sin reportes registrados</div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f8fafc] overflow-y-auto max-h-[520px]">
                                        {resultado.oportunidades.map(o => {
                                            const cfg = ESTADO_CONFIG[o.estado] || ESTADO_CONFIG.pendiente;
                                            return (
                                                <div key={o.id} className="px-5 py-3.5 hover:bg-[#f8fafc] transition-colors">
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
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
                                                    <div className="text-[9px] text-[#94a3b8] mb-1.5">
                                                        Fecha del caso: <span className="font-bold text-[#64748b]">{fmtFecha(o.fecha_caso)}</span>
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
