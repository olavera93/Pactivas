import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

const ESTADO_CONFIG = {
    pendiente:      { label: 'Pendiente',      color: '#f59e0b', bg: '#fffbeb', dot: '🟡', icon: '⏳' },
    confirmado:     { label: 'Confirmado',     color: '#22c55e', bg: '#f0fdf4', dot: '🟢', icon: '✅' },
    no_confirmado:  { label: 'No Confirmado',  color: '#ef4444', bg: '#fef2f2', dot: '🔴', icon: '❌' },
};

function KpiCard({ label, value, sub, color = '#00a2e1', icon }) {
    return (
        <div className="premium-card p-4 flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#94a3b8] mb-0.5">{label}</div>
                <div className="text-2xl font-black tracking-tight" style={{ color }}>{value}</div>
                {sub && <div className="text-[10px] text-[#64748b] font-medium mt-0.5 uppercase tracking-tight opacity-70">{sub}</div>}
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner relative z-10" style={{ background: `${color}10`, color }}>
                {icon}
            </div>
        </div>
    );
}

function BarChart({ data, colorFn }) {
    const max = Math.max(...Object.values(data), 1);
    return (
        <div className="space-y-3">
            {Object.entries(data).map(([key, val]) => (
                <div key={key} className="group">
                    <div className="flex justify-between items-end text-[11px] mb-1.5">
                        <span className="font-bold capitalize text-[#1a202c] group-hover:text-[#00a2e1] transition-colors">{key.replace('_', ' ')}</span>
                        <span className="font-black text-[#64748b] bg-gray-50 px-1.5 py-0.5 rounded text-[9px]">{val}</span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(val / max) * 100}%`, background: colorFn ? colorFn(key) : 'linear-gradient(90deg, #00a2e1, #0084b9)' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReporteItem({ r, onGestionar }) {
    const [open, setOpen] = useState(false);
    const cfg = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG.pendiente;

    return (
        <div className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <button
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm border border-white`} style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon}
                    </div>
                    <div className="min-w-0">
                        <span className="font-black text-[13px] text-gray-900 block truncate leading-tight mb-0.5">{r.nombre_responsable || '—'}</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-tight">
                            <span>{r.area_responsable || r.area}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-200" />
                            <span>{new Date(r.created_at).toLocaleDateString('es-CO')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2.5 py-1.5 rounded-md hidden sm:inline">{r.categoria}</span>
                    <svg className={`w-4 h-4 text-[#cbd5e1] transition-transform duration-500 ${open ? 'rotate-180 text-[#00a3e0]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {open && (
                <div className="px-12 pb-5 pt-1 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-3 border-y border-gray-50">
                        {[
                            { label: 'Reportado por', val: r.nombre_empleado },
                            { label: 'Responsable', val: r.nombre_responsable || '—' },
                            { label: 'Fecha caso', val: r.fecha_caso || '—' },
                            { label: 'Área', val: r.area_responsable || r.area },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-0.5">{item.label}</div>
                                <div className="font-bold text-gray-800 text-[11px]">{item.val}</div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Descripción completa de la oportunidad</div>
                            <p className="text-[14px] text-[#334155] font-medium leading-relaxed bg-gray-50/50 rounded-xl p-4 border border-gray-100 italic w-full">
                                "{r.descripcion}"
                            </p>
                        </div>

                        {r.observacion_admin && (
                            <div className="animate-fade-in">
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#f59e0b] mb-1.5">Respuesta Administrativa</div>
                                <p className="text-[12px] text-[#92400e] leading-relaxed bg-[#fffbeb]/50 rounded-xl p-3 border border-[#fde68a]">{r.observacion_admin}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            onClick={() => onGestionar(r)}
                            className="text-[10px] font-black text-[#00a3e0] uppercase tracking-widest hover:underline flex items-center gap-1.5"
                        >
                            <span>⚙️</span> Gestionar Reporte
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Indicadores({ auth, stats }) {
    const [tab, setTab] = useState('indicadores');
    const [modalData, setModalData] = useState(null);
    const [filtros, setFiltros] = useState({ estado: '', area: '', fecha_inicio: '', fecha_fin: '', nombre_responsable: '' });
    const [fechaInd, setFechaInd] = useState({ inicio: '', fin: '' });

    const estadoForm = useForm({ estado: '', observacion_admin: '' });

    const abrirModal = (oportunidad) => {
        setModalData(oportunidad);
        estadoForm.setData({ estado: oportunidad.estado, observacion_admin: oportunidad.observacion_admin || '' });
    };

    const guardarEstado = () => {
        estadoForm.patch(route('admin.indicadores.estado', modalData.id), {
            onSuccess: () => setModalData(null),
        });
    };

    const exportar = () => {
        const params = new URLSearchParams(filtros).toString();
        window.location.href = `/admin/indicadores/export?${params}`;
    };

    const exportarPdf = () => {
        const params = new URLSearchParams(filtros).toString();
        window.location.href = `/admin/indicadores/export-pdf?${params}`;
    };

    const registrosFiltrados = (stats.registros || []).filter(r => {
        if (filtros.estado && r.estado !== filtros.estado) return false;
        if (filtros.area   && (r.area_responsable || r.area) !== filtros.area) return false;
        if (filtros.fecha_inicio && r.created_at < filtros.fecha_inicio) return false;
        if (filtros.fecha_fin    && r.created_at.slice(0, 10) > filtros.fecha_fin) return false;
        if (filtros.nombre_responsable && !(r.nombre_responsable || '').toLowerCase().includes(filtros.nombre_responsable.toLowerCase())) return false;
        return true;
    });

    const registrosInd = (stats.registros || []).filter(r => {
        if (fechaInd.inicio && r.created_at.slice(0, 10) < fechaInd.inicio) return false;
        if (fechaInd.fin    && r.created_at.slice(0, 10) > fechaInd.fin)    return false;
        return true;
    });

    const hayFiltroInd = fechaInd.inicio || fechaInd.fin;

    const agrupar = (arr, key) => arr.reduce((acc, r) => {
        const k = r[key] || 'Sin definir';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    const por_estado    = hayFiltroInd ? agrupar(registrosInd, 'estado')    : (stats.por_estado    || {});
    const por_categoria = hayFiltroInd ? agrupar(registrosInd, 'categoria') : (stats.por_categoria || {});
    const por_area      = hayFiltroInd ? agrupar(registrosInd, 'area')      : (stats.por_area      || {});
    const totalInd      = hayFiltroInd ? registrosInd.length                : (stats.total         || 0);
    const hoyInd        = hayFiltroInd
        ? registrosInd.filter(r => r.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length
        : (stats.hoy || 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Indicadores de <span className="text-[#00a2e1]">Mejora</span></h2>
                        <p className="text-sm text-gray-500">Métricas y reportes detallados del sistema</p>
                    </div>
                   
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        {[
                            { key: 'indicadores', label: 'Resumen', icon: '📊' },
                            { key: 'reportes',    label: 'Listado', icon: '📋' },
                        ].map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-4 py-2 rounded-lg text-[12px] font-black tracking-tight transition-all flex items-center gap-1.5 ${tab === t.key ? 'bg-white text-[#00a2e1] shadow-sm' : 'text-[#64748b] hover:text-[#1a202c]'}`}
                            >
                                <span>{t.icon}</span>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="Indicadores de Mejora" />

            {/* ===== TAB: INDICADORES ===== */}
            {tab === 'indicadores' && (
                <div className="space-y-6 animate-fade-in-up">

                    {/* Rango de fecha compacto */}
                    <div className="premium-card p-4 flex flex-wrap items-end gap-4 bg-white">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] px-1">Fecha Inicio</label>
                            <input
                                type="date"
                                className="premium-input !py-1.5 !px-3 shadow-none border-[#f1f5f9]"
                                value={fechaInd.inicio}
                                onChange={e => setFechaInd(p => ({ ...p, inicio: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] px-1">Fecha Fin</label>
                            <input
                                type="date"
                                className="premium-input !py-1.5 !px-3 shadow-none border-[#f1f5f9]"
                                value={fechaInd.fin}
                                onChange={e => setFechaInd(p => ({ ...p, fin: e.target.value }))}
                            />
                        </div>
                        {hayFiltroInd && (
                            <button
                                onClick={() => setFechaInd({ inicio: '', fin: '' })}
                                className="text-[10px] font-black text-[#9e1a53] uppercase hover:underline mb-2"
                            >
                                Limpiar
                            </button>
                        )}
                        <div className="ml-auto text-right">
                            <div className="text-[9px] font-black text-[#94a3b8] uppercase">Mostrando</div>
                            <div className="text-xs font-black text-[#00a3e0]">{totalInd} casos</div>
                        </div>
                    </div>

                    {/* KPIs principales compactos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard label="Total Reportes" value={totalInd} sub={hayFiltroInd ? 'Filtrado' : 'Total histórico'} color="#00a3e0" icon="📊" />
                        <KpiCard label="Nuevos Hoy" value={hoyInd} sub="Registrados hoy" color="#0ea5e9" icon="✨" />
                        <KpiCard label="Pendientes" value={por_estado.pendiente || 0} sub="Por gestionar" color="#f59e0b" icon="⏳" />
                        <KpiCard label="Confirmados" value={por_estado.confirmado || 0} sub="Finalizados" color="#22c55e" icon="🎯" />
                    </div>

                    {/* Análisis: estado + categorías */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Distribución por estado */}
                        <div className="premium-card p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#64748b] mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00a3e0]" /> Estado Actual
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => {
                                    const val = por_estado[key] || 0;
                                    const pct = totalInd > 0 ? Math.round((val / totalInd) * 100) : 0;
                                    return (
                                        <div key={key} className="group">
                                            <div className="flex justify-between items-end text-[12px] mb-2">
                                                <span className="font-black text-gray-800">{cfg.label}</span>
                                                <div className="text-right">
                                                    <span className="font-black text-[#64748b] mr-2">{val}</span>
                                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-gray-100 rounded text-gray-400">{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden p-[1px]">
                                                <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${pct}%`, background: cfg.color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categorías más reportadas */}
                        <div className="premium-card p-8 lg:col-span-2">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#64748b] mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-pink-500" /> Categorías Top
                            </h3>
                            {Object.keys(por_categoria).length === 0 ? (
                                <div className="h-48 flex items-center justify-center text-[#94a3b8] italic text-sm border-2 border-dashed border-gray-50 rounded-3xl">Sin datos aún en este rango.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(por_categoria)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cat, val]) => (
                                            <div key={cat} className="flex items-center justify-between bg-gray-50/50 hover:bg-[#e6f6fd] border border-transparent hover:border-[#00a3e0]/20 rounded-2xl px-5 py-4 transition-all group">
                                                <span className="text-[13px] font-black text-gray-700 group-hover:text-[#00a3e0]">{cat}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1 w-12 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                                                        <div className="h-full bg-[#00a3e0] opacity-30" style={{ width: `${(val / totalInd) * 100}%` }} />
                                                    </div>
                                                    <span className="text-2xl font-black text-gray-900 group-hover:scale-110 transition-transform">{val}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Participación por área */}
                    {Object.keys(por_area).length > 0 && (
                        <div className="premium-card p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#64748b] mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Rendimiento por Área
                            </h3>
                            <BarChart data={Object.fromEntries(
                                Object.entries(por_area).sort((a, b) => b[1] - a[1])
                            )} />
                        </div>
                    )}
                </div>
            )}

            {/* ===== TAB: REPORTES ===== */}
            {tab === 'reportes' && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Filtros */}
                    <div className="premium-card p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-[#f1f5f9] pb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Filtros de Búsqueda</span>
                            <span className="text-[10px] font-black text-[#00a3e0] bg-[#e6f6fd] px-2.5 py-1 rounded-lg">{registrosFiltrados.length} Resultados</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Responsable</label>
                                <input
                                    type="text"
                                    className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                    placeholder="Buscar por nombre..."
                                    value={filtros.nombre_responsable}
                                    onChange={e => setFiltros(p => ({ ...p, nombre_responsable: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Estado</label>
                                <select
                                    className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                    value={filtros.estado}
                                    onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))}
                                >
                                    <option value="">Todos</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="no_confirmado">No Confirmado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Área</label>
                                <select
                                    className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                    value={filtros.area}
                                    onChange={e => setFiltros(p => ({ ...p, area: e.target.value }))}
                                >
                                    <option value="">Todas</option>
                                    {(stats.areas || []).map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Desde</label>
                                    <input
                                        type="date"
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                        value={filtros.fecha_inicio}
                                        onChange={e => setFiltros(p => ({ ...p, fecha_inicio: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Hasta</label>
                                    <input
                                        type="date"
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                        value={filtros.fecha_fin}
                                        onChange={e => setFiltros(p => ({ ...p, fecha_fin: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 justify-end">
                            <button onClick={exportar} className="premium-button-primary !py-2 !px-4 text-xs !bg-green-600 hover:!bg-green-700 shadow-none">Excel</button>
                            <button onClick={exportarPdf} className="premium-button-primary !py-2 !px-4 text-xs !bg-red-600 hover:!bg-red-700 shadow-none">PDF</button>
                        </div>
                    </div>

                    <div className="premium-card !p-0 overflow-hidden bg-white">
                        {registrosFiltrados.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center gap-2">
                                <div className="text-4xl">🔍</div>
                                <div className="text-gray-400 font-bold italic text-sm">Sin resultados.</div>
                                <button onClick={() => setFiltros({ estado: '', area: '', fecha_inicio: '', fecha_fin: '', nombre_responsable: '' })} className="text-[#00a3e0] font-black text-[10px] uppercase hover:underline mt-2">Limpiar filtros</button>
                            </div>
                        ) : registrosFiltrados.map(r => (
                            <ReporteItem key={r.id} r={r} onGestionar={abrirModal} />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal gestionar estado */}
            {modalData && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[300] p-4 animate-in fade-in duration-300">
                    <div className="premium-card max-w-lg w-full shadow-2xl overflow-hidden border-[#f1f5f9] animate-fade-in-up">
                        <div className="p-8 border-b border-[#f1f5f9] bg-gradient-to-r from-[#e6f6fd] to-white flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-[#00a3e0] tracking-tight">Gestionar Reporte</h3>
                                <p className="text-[12px] font-bold text-[#64748b] mt-1 uppercase tracking-widest">Caso #{modalData.id} · {modalData.area}</p>
                            </div>
                            <button onClick={() => setModalData(null)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light">✕</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-5 text-[13px] text-[#475569] leading-relaxed border border-gray-100 shadow-inner max-h-32 overflow-y-auto">
                                <div className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Descripción del caso</div>
                                {modalData.descripcion}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#64748b] px-1">Cambiar Estado</label>
                                <select
                                    className="premium-input !py-3 !text-base shadow-sm"
                                    value={estadoForm.data.estado}
                                    onChange={e => estadoForm.setData('estado', e.target.value)}
                                >
                                    <option value="pendiente">⏳ Pendiente</option>
                                    <option value="confirmado">✅ Confirmado</option>
                                    <option value="no_confirmado">❌ No Confirmado</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#64748b] px-1">Observación Administrativa</label>
                                <textarea
                                    className="premium-input !py-3 min-h-[100px] resize-none shadow-sm"
                                    placeholder="Detalla las acciones tomadas o comentarios sobre este caso..."
                                    value={estadoForm.data.observacion_admin}
                                    onChange={e => estadoForm.setData('observacion_admin', e.target.value)}
                                />
                                <p className="text-[9px] text-[#94a3b8] font-bold uppercase text-right">Visible para el administrador</p>
                            </div>
                        </div>
                        <div className="p-8 border-t border-[#f1f5f9] flex gap-4 bg-gray-50/30">
                            <button
                                onClick={() => setModalData(null)}
                                className="flex-1 premium-button-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarEstado}
                                disabled={estadoForm.processing}
                                className="flex-1 premium-button-primary"
                            >
                                {estadoForm.processing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

