import React from 'react';
import { Head, useForm } from '@inertiajs/react';

const ESTADO_CONFIG = {
    pendiente:     { label: 'Pendiente',     color: '#f59e0b', bg: '#fffbeb', icon: '⏳' },
    confirmado:    { label: 'Confirmado',    color: '#22c55e', bg: '#f0fdf4', icon: '✅' },
    no_confirmado: { label: 'No confirmado', color: '#ef4444', bg: '#fef2f2', icon: '❌' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

export default function Consulta({ resultado, documento, fecha_inicio, fecha_fin }) {
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
        <div className="min-h-screen bg-[#f0faff] font-['Outfit'] text-[#1e293b]">
            <Head title="Mi Gestión · LFH" />
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');`}</style>

            {/* ── Top bar ── */}
            <header className="bg-white border-b border-[#edf2f7] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 bg-[#00a3e0] rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shadow-[#00a3e0]/30">P</div>
                        <div>
                            <div className="text-[13px] font-black text-[#1a202c] leading-tight">Gestión <span className="text-[#00a3e0]">LFH</span></div>
                            <div className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">Indicadores · Bienestar</div>
                        </div>
                    </div>

                    {/* Buscador + filtros de fecha */}
                    <form onSubmit={buscar} className="flex gap-2 flex-1 ml-auto flex-wrap justify-end">
                        <input
                            type="text"
                            className="px-4 py-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors font-medium tracking-widest w-44"
                            placeholder="Número de documento..."
                            value={data.documento}
                            onChange={e => setData('documento', e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border border-[#cbd5e1] rounded-xl text-[12px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors text-[#64748b] w-36"
                            title="Fecha inicial"
                            value={data.fecha_inicio}
                            onChange={e => setData('fecha_inicio', e.target.value)}
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border border-[#cbd5e1] rounded-xl text-[12px] outline-none bg-[#f8fafc] focus:border-[#00a3e0] transition-colors text-[#64748b] w-36"
                            title="Fecha final"
                            value={data.fecha_fin}
                            onChange={e => setData('fecha_fin', e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-[#00a3e0] text-white rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-[#0084b9] transition-all disabled:opacity-50 shrink-0"
                        >
                            {processing ? '...' : 'Consultar'}
                        </button>
                    </form>
                    {errors.documento && <p className="text-red-500 text-xs">{errors.documento}</p>}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Estado inicial ── */}
                {!resultado && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-[#e6f6fd] rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">🧘</div>
                        <h2 className="text-2xl font-black text-[#1a202c] mb-2">Consulta tu historial de gestión</h2>
                        <p className="text-[#64748b] text-sm max-w-xs">Ingresa tu número de documento para ver tus pausas activas y los reportes de oportunidades de mejora asociados.</p>
                    </div>
                )}

                {/* ── No encontrado ── */}
                {noEncontrado && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <div className="font-black text-gray-700 text-xl mb-2">Documento no encontrado</div>
                        <p className="text-[#64748b] text-sm">Verifica el número ingresado o contacta a tu administrador.</p>
                    </div>
                )}

                {/* ── Resultados ── */}
                {resultado && !noEncontrado && (
                    <div className="space-y-6">

                        {/* Perfil + KPIs en una fila */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                            {/* Tarjeta de perfil */}
                            <div className="lg:col-span-1 bg-white rounded-2xl border border-[#edf2f7] shadow-sm p-5 flex flex-col items-center justify-center text-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-[#e6f6fd] flex items-center justify-center text-3xl font-black text-[#00a3e0]">
                                    {colab ? colab.nombres.charAt(0) : '?'}
                                </div>
                                <div>
                                    <div className="font-black text-[15px] text-[#1a202c] leading-tight">
                                        {colab ? `${colab.nombres} ${colab.apellidos}` : 'Colaborador'}
                                    </div>
                                    <div className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest mt-0.5">
                                        {colab?.area || '—'}
                                    </div>
                                </div>
                                <div className="text-[10px] text-[#94a3b8] font-medium border-t border-[#f1f5f9] pt-2 w-full">
                                    Doc. {data.documento}
                                </div>
                            </div>

                            {/* KPIs */}
                            <div className="lg:col-span-4 space-y-4">
                                {/* Fila pausas */}
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a3e0] inline-block" /> Pausas activas
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total pausas',    value: resultado.total_pausas,  sub: 'Historial completo', color: '#00a3e0', icon: '🧘' },
                                            { label: 'Minutos totales', value: resultado.total_minutos, sub: 'Tiempo acumulado',   color: '#0ea5e9', icon: '⏱️' },
                                            { label: 'Este mes',        value: resultado.pausas_mes,    sub: 'Mes actual',         color: '#8b5cf6', icon: '📅' },
                                            { label: 'Esta semana',     value: resultado.pausas_semana, sub: 'Semana actual',      color: '#22c55e', icon: '✨' },
                                        ].map(k => (
                                            <div key={k.label} className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm p-5 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#94a3b8] mb-0.5">{k.label}</div>
                                                    <div className="text-3xl font-black" style={{ color: k.color }}>{k.value}</div>
                                                    <div className="text-[10px] text-[#64748b] font-medium mt-0.5">{k.sub}</div>
                                                </div>
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${k.color}15` }}>{k.icon}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Fila oportunidades */}
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" /> Oportunidades de mejora
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total reportes',   value: resultado.op_total,          sub: 'Historial completo',  color: '#64748b', icon: '📋' },
                                            { label: 'Pendientes',       value: resultado.op_pendientes,     sub: 'Aguarda revisión',    color: '#f59e0b', icon: '⏳' },
                                            { label: 'Confirmados',      value: resultado.op_confirmadas,    sub: 'Gestionados',         color: '#22c55e', icon: '✅' },
                                            { label: 'No confirmados',   value: resultado.op_no_confirmadas, sub: 'Sin confirmar',       color: '#ef4444', icon: '❌' },
                                        ].map(k => (
                                            <div key={k.label} className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm p-5 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#94a3b8] mb-0.5">{k.label}</div>
                                                    <div className="text-3xl font-black" style={{ color: k.color }}>{k.value}</div>
                                                    <div className="text-[10px] text-[#64748b] font-medium mt-0.5">{k.sub}</div>
                                                </div>
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${k.color}15` }}>{k.icon}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pausas + Oportunidades en dos columnas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Historial de pausas */}
                            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
                                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00a3e0]" /> Últimas pausas activas
                                    </h2>
                                    <span className="text-[9px] font-black text-[#94a3b8] bg-gray-50 px-2 py-0.5 rounded-md">{resultado.ultimas_pausas.length} registros</span>
                                </div>
                                {resultado.ultimas_pausas.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-[#94a3b8]">
                                        <div className="text-4xl mb-2">🧘</div>
                                        <div className="text-sm font-bold italic">Sin registros de pausas</div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/60 border-b border-[#f1f5f9]">
                                                    <th className="py-2.5 px-5 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Ejercicios</th>
                                                    <th className="py-2.5 px-4 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Min</th>
                                                    <th className="py-2.5 px-4 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f8fafc]">
                                                {resultado.ultimas_pausas.map(r => (
                                                    <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors">
                                                        <td className="py-3 px-5">
                                                            <div className="text-[12px] font-bold text-[#334155] leading-tight">{r.ejercicios_realizados}</div>
                                                            <div className="text-[9px] text-[#94a3b8] uppercase tracking-widest mt-0.5">{r.area}</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className="text-[13px] font-black text-[#00a3e0]">{r.duracion_minutos}′</span>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <span className="text-[11px] text-[#64748b] font-medium">{fmtFecha(r.created_at)}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Oportunidades de mejora */}
                            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
                                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-400" /> Mis reportes de oportunidades
                                    </h2>
                                    <span className="text-[9px] font-black text-[#94a3b8] bg-gray-50 px-2 py-0.5 rounded-md">{resultado.oportunidades.length} reportes</span>
                                </div>
                                {resultado.oportunidades.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-[#94a3b8]">
                                        <div className="text-4xl mb-2">📋</div>
                                        <div className="text-sm font-bold italic">Sin reportes registrados</div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#f8fafc] overflow-y-auto max-h-[520px]">
                                        {resultado.oportunidades.map(o => {
                                            const cfg = ESTADO_CONFIG[o.estado] || ESTADO_CONFIG.pendiente;
                                            return (
                                                <div key={o.id} className="px-5 py-4 hover:bg-[#f8fafc] transition-colors">
                                                    {/* Fila superior: badges + estado */}
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                                                            {o.no_orden && (
                                                                <span className="text-[9px] font-black bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-md font-mono tracking-widest shrink-0">{o.no_orden}</span>
                                                            )}
                                                            <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">{o.categoria}</span>
                                                            {o.area_responsable && (
                                                                <span className="text-[9px] font-bold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md shrink-0">{o.area_responsable}</span>
                                                            )}
                                                        </div>
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                                                            {cfg.icon} {cfg.label}
                                                        </span>
                                                    </div>
                                                    {/* Fecha */}
                                                    <div className="text-[10px] text-[#94a3b8] mb-1.5">Fecha del caso: <span className="font-bold text-[#64748b]">{fmtFecha(o.fecha_caso)}</span></div>
                                                    {/* Descripción */}
                                                    <p className="text-[12px] text-[#475569] font-medium leading-relaxed italic">"{o.descripcion}"</p>
                                                    {/* Respuesta admin */}
                                                    {o.observacion_admin && (
                                                        <div className="mt-2 bg-[#fffbeb] rounded-lg p-2.5 border border-[#fde68a]">
                                                            <div className="text-[8px] font-black uppercase tracking-widest text-[#f59e0b] mb-1">Respuesta</div>
                                                            <p className="text-[11px] text-[#92400e] leading-relaxed">{o.observacion_admin}</p>
                                                        </div>
                                                    )}
                                                    {/* Revisado por */}
                                                    {o.revisado_por && (
                                                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
                                                            <span>👤</span>
                                                            <span>Revisado por <span className="text-[#00a3e0] font-bold">{o.revisado_por}</span> · {fmtFecha(o.fecha_revision)}</span>
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
