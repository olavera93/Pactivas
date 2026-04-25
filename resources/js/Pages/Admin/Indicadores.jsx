import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

const PER_PAGE = 10;

function Paginador({ total, page, onPage }) {
    const pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) return null;
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 bg-gray-50/30">
            <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
                Pág. {page} de {pages} · {total} registros
            </span>
            <div className="flex gap-1">
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="w-7 h-7 rounded-lg border border-[#f1f5f9] bg-white text-[#64748b] text-xs font-black hover:bg-[#00a2e1] hover:text-white disabled:opacity-30 transition-all"
                >‹</button>
                {Array.from({ length: pages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                    <button
                        key={p}
                        onClick={() => onPage(p)}
                        className={`w-7 h-7 rounded-lg border text-[10px] font-black transition-all ${p === page ? 'bg-[#00a2e1] text-white border-[#00a2e1]' : 'border-[#f1f5f9] bg-white text-[#64748b] hover:bg-gray-50'}`}
                    >{p}</button>
                ))}
                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === pages}
                    className="w-7 h-7 rounded-lg border border-[#f1f5f9] bg-white text-[#64748b] text-xs font-black hover:bg-[#00a2e1] hover:text-white disabled:opacity-30 transition-all"
                >›</button>
            </div>
        </div>
    );
}

const fmtFecha = (val) => {
    if (!val) return '—';
    const s = String(val).slice(0, 10);
    const [y, m, d] = s.split('-');
    return `${d}/${m}/${y}`;
};

const toISO = (dmy) => {
    if (!dmy) return '';
    const [d, m, y] = dmy.split('/');
    if (!d || !m || !y || y.length !== 4) return '';
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

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

function ReporteItem({ r, open, onToggle }) {
    const cfg = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG.pendiente;
    const form = useForm({ estado: r.estado, observacion_admin: r.observacion_admin || '' });

    const guardar = (e) => {
        e.stopPropagation();
        form.patch(route('admin.indicadores.estado', r.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <tr
                className={`border-b border-gray-50 cursor-pointer transition-colors ${open ? 'bg-[#f0f9ff]' : 'hover:bg-gray-50/60'}`}
                onClick={onToggle}
            >
                <td className="py-3 px-4 w-8">
                    <svg className={`w-3.5 h-3.5 text-[#cbd5e1] transition-transform duration-300 ${open ? 'rotate-180 text-[#00a3e0]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
                <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-[#0369a1] bg-[#e0f2fe] px-2 py-0.5 rounded font-mono">{r.no_orden || '—'}</span>
                </td>
                <td className="py-3 px-3">
                    <div className="font-black text-[12px] text-gray-900 leading-tight">{r.nombre_responsable || '—'}</div>
                    <div className="text-[9px] text-[#94a3b8] font-bold uppercase">{r.nombre_empleado}</div>
                </td>
                <td className="py-3 px-3 hidden md:table-cell">
                    <span className="text-[11px] text-gray-600 font-medium">{r.area_responsable || r.area}</span>
                </td>
                <td className="py-3 px-3 hidden lg:table-cell">
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-widest">{r.categoria}</span>
                </td>
                <td className="py-3 px-3 hidden sm:table-cell">
                    <span className="text-[11px] text-[#64748b] font-medium">{fmtFecha(r.fecha_caso)}</span>
                </td>
                <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                    </span>
                </td>
                <td className="py-3 px-3 hidden lg:table-cell">
                    <span className="text-[10px] text-[#94a3b8] font-medium">{fmtFecha(r.created_at)}</span>
                </td>
            </tr>

            {open && (
                <tr className="bg-[#f8fbff] border-b border-[#e6f6fd]">
                    <td colSpan="8" className="px-6 py-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Columna izquierda: info + descripción */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Reportado por', val: r.nombre_empleado },
                                        { label: 'Responsable',   val: r.nombre_responsable || '—' },
                                        { label: 'Fecha caso',    val: fmtFecha(r.fecha_caso) },
                                        { label: 'Área',          val: r.area_responsable || r.area },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-0.5">{item.label}</div>
                                            <div className="font-semibold text-gray-800 text-[12px]">{item.val}</div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Descripción</div>
                                    <p className="text-[12px] text-[#334155] leading-relaxed bg-white rounded-lg p-3 border border-gray-100 italic">
                                        "{r.descripcion}"
                                    </p>
                                </div>
                                {r.revisado_por && (
                                    <div className="text-[10px] text-[#64748b]">
                                        Revisado por <span className="font-semibold text-[#00a3e0]">{r.revisado_por}</span>
                                        {r.fecha_revision && <span className="text-[#94a3b8]"> · {fmtFecha(r.fecha_revision)}</span>}
                                    </div>
                                )}
                            </div>

                            {/* Columna derecha: formulario inline */}
                            <div className="space-y-3" onClick={e => e.stopPropagation()}>
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Estado</label>
                                    <select
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9] w-full"
                                        value={form.data.estado}
                                        onChange={e => form.setData('estado', e.target.value)}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="confirmado">Confirmado</option>
                                        <option value="no_confirmado">No Confirmado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5 block">Observación</label>
                                    <textarea
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9] w-full resize-none"
                                        rows={3}
                                        placeholder="Comentario administrativo..."
                                        value={form.data.observacion_admin}
                                        onChange={e => form.setData('observacion_admin', e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={guardar}
                                    disabled={form.processing}
                                    className="premium-button-primary !py-2 !px-4 text-xs w-full"
                                >
                                    {form.processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function Indicadores({ auth, stats, categorias = [] }) {
    const [tab, setTab] = useState('reportes');
    const [filtros, setFiltros] = useState({ estado: '', area: '', fecha_inicio: '', fecha_fin: '', nombre_responsable: '' });
    const [fechaInd, setFechaInd] = useState({ inicio: '', fin: '' });
    const [pageOp, setPageOp] = useState(1);
    const [showCatModal, setShowCatModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [openReporteId, setOpenReporteId] = useState(null);

    const catForm = useForm({ nombre: '' });
    const catEditForm = useForm({ nombre: '' });

    const abrirEditCat = (cat) => {
        setEditingCat(cat.id);
        catEditForm.setData('nombre', cat.nombre);
    };

    const guardarCat = (e) => {
        e.preventDefault();
        catForm.post(route('admin.categorias.store'), {
            onSuccess: () => catForm.reset(),
        });
    };

    const actualizarCat = (e, id) => {
        e.preventDefault();
        catEditForm.put(route('admin.categorias.update', id), {
            onSuccess: () => setEditingCat(null),
        });
    };

    const eliminarCat = (id) => {
        if (confirm('¿Eliminar esta categoría?')) {
            catEditForm.delete(route('admin.categorias.destroy', id));
        }
    };

    const exportar = () => {
        const p = { ...filtros, fecha_inicio: toISO(filtros.fecha_inicio), fecha_fin: toISO(filtros.fecha_fin) };
        window.location.href = `/admin/indicadores/export?${new URLSearchParams(p).toString()}`;
    };

    const exportarPdf = () => {
        const p = { ...filtros, fecha_inicio: toISO(filtros.fecha_inicio), fecha_fin: toISO(filtros.fecha_fin) };
        window.location.href = `/admin/indicadores/export-pdf?${new URLSearchParams(p).toString()}`;
    };

    React.useEffect(() => { setPageOp(1); }, [filtros]);

    const registrosFiltrados = (stats.registros || []).filter(r => {
        if (filtros.estado && r.estado !== filtros.estado) return false;
        if (filtros.area   && (r.area_responsable || r.area) !== filtros.area) return false;
        const fi = toISO(filtros.fecha_inicio);
        const ff = toISO(filtros.fecha_fin);
        if (fi && r.created_at.slice(0, 10) < fi) return false;
        if (ff && r.created_at.slice(0, 10) > ff) return false;
        if (filtros.nombre_responsable && !(r.nombre_responsable || '').toLowerCase().includes(filtros.nombre_responsable.toLowerCase())) return false;
        return true;
    });

    const registrosInd = (stats.registros || []).filter(r => {
        if (fechaInd.inicio && r.created_at.slice(0, 10) < fechaInd.inicio) return false;
        if (fechaInd.fin    && r.created_at.slice(0, 10) > fechaInd.fin)    return false;
        if (fechaInd.area   && (r.area_responsable || r.area) !== fechaInd.area) return false;
        if (fechaInd.buscar) {
            const q = fechaInd.buscar.toLowerCase();
            if (!(r.nombre_responsable || '').toLowerCase().includes(q) &&
                !(r.nombre_empleado   || '').toLowerCase().includes(q) &&
                !(r.area              || '').toLowerCase().includes(q) &&
                !(r.categoria         || '').toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const hayFiltroInd = fechaInd.inicio || fechaInd.fin || fechaInd.area;

    const agrupar = (arr, key) => arr.reduce((acc, r) => {
        const k = r[key] || 'Sin definir';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    const por_estado    = hayFiltroInd ? agrupar(registrosInd, 'estado')    : (stats.por_estado    || {});
    const por_categoria = hayFiltroInd ? agrupar(registrosInd, 'categoria') : (stats.por_categoria || {});
    const por_area      = hayFiltroInd ? agrupar(registrosInd, 'area_responsable') : (stats.por_area || {});
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
                   
                    <div className="flex items-center gap-2">
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
                        <button
                            onClick={() => setShowCatModal(true)}
                            className="w-9 h-9 rounded-xl bg-white border border-[#f1f5f9] shadow-sm flex items-center justify-center text-[#64748b] hover:text-[#00a2e1] hover:border-[#00a2e1] transition-all"
                            title="Configurar categorías"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Indicadores de Mejora" />

            {/* ===== TAB: INDICADORES ===== */}
            {tab === 'indicadores' && (
                <div className="space-y-6 animate-fade-in-up">

                    {/* Buscador + Rango de fecha */}
                    <div className="premium-card p-4 flex flex-wrap items-end gap-4 bg-white">
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] px-1">Buscar</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm">🔍</span>
                                <input
                                    type="text"
                                    className="premium-input !py-1.5 !pl-8 !pr-3 shadow-none border-[#f1f5f9] w-full"
                                    placeholder="Responsable, área, categoría..."
                                    value={fechaInd.buscar || ''}
                                    onChange={e => setFechaInd(p => ({ ...p, buscar: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] px-1">Área</label>
                            <select
                                className="premium-input !py-1.5 !px-3 shadow-none border-[#f1f5f9]"
                                value={fechaInd.area || ''}
                                onChange={e => setFechaInd(p => ({ ...p, area: e.target.value }))}
                            >
                                <option value="">Todas</option>
                                {(stats.areas || []).map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
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
                        {(hayFiltroInd || fechaInd.buscar) && (
                            <button
                                onClick={() => setFechaInd({ inicio: '', fin: '', area: '', buscar: '' })}
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
                        <KpiCard label="Pendientes" value={por_estado.pendiente || 0} sub="Por revisar" color="#f59e0b" icon="⏳" />
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
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-[#f1f5f9]">
                                                <th className="py-3 px-4 w-8" />
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Nº Orden</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Responsable / Reportado</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden md:table-cell">Área</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden lg:table-cell">Categoría</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden sm:table-cell">Fecha caso</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Estado</th>
                                                <th className="py-3 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden lg:table-cell">Registro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrosFiltrados.slice((pageOp - 1) * PER_PAGE, pageOp * PER_PAGE).map(r => (
                                                <ReporteItem key={r.id} r={r} open={openReporteId === r.id} onToggle={() => setOpenReporteId(openReporteId === r.id ? null : r.id)} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Paginador total={registrosFiltrados.length} page={pageOp} onPage={setPageOp} />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Configurar Categorías */}
            {showCatModal && createPortal(
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[300] p-4">
                    <div className="premium-card max-w-md w-full shadow-2xl overflow-hidden border-[#f1f5f9]">
                        <div className="p-6 border-b border-[#f1f5f9] bg-gradient-to-r from-[#e6f6fd] to-white flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black text-[#00a3e0] tracking-tight">Categorías</h3>
                                <p className="text-[11px] font-bold text-[#64748b] mt-0.5 uppercase tracking-widest">Configurar categorías de oportunidades</p>
                            </div>
                            <button onClick={() => { setShowCatModal(false); setEditingCat(null); }} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light">✕</button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Agregar nueva */}
                            <form onSubmit={guardarCat} className="flex gap-2">
                                <input
                                    type="text"
                                    className="premium-input flex-1 !py-2 shadow-none"
                                    placeholder="Nueva categoría..."
                                    value={catForm.data.nombre}
                                    onChange={e => catForm.setData('nombre', e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={catForm.processing}
                                    className="premium-button-primary !py-2 !px-4 text-xs shadow-none whitespace-nowrap"
                                >
                                    + Agregar
                                </button>
                            </form>
                            {catForm.errors.nombre && <p className="text-red-500 text-xs -mt-2">{catForm.errors.nombre}</p>}

                            {/* Lista de categorías */}
                            <div className="divide-y divide-[#f1f5f9]">
                                {categorias.map(cat => (
                                    <div key={cat.id} className="py-2.5">
                                        {editingCat === cat.id ? (
                                            <form onSubmit={e => actualizarCat(e, cat.id)} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="premium-input flex-1 !py-1.5 shadow-none text-sm"
                                                    value={catEditForm.data.nombre}
                                                    onChange={e => catEditForm.setData('nombre', e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                                <button type="submit" disabled={catEditForm.processing} className="w-8 h-8 rounded-lg bg-[#00a3e0] text-white text-xs font-black shadow-sm hover:bg-[#0084b9] transition-all">✓</button>
                                                <button type="button" onClick={() => setEditingCat(null)} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 text-xs font-black hover:bg-gray-200 transition-all">✕</button>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[13px] font-bold text-[#1a202c]">{cat.nombre}</span>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => abrirEditCat(cat)}
                                                        className="w-7 h-7 rounded-lg bg-white border border-[#f1f5f9] text-[#00a3e0] shadow-sm hover:bg-[#00a3e0] hover:text-white transition-all text-xs"
                                                        title="Editar"
                                                    >
                                                        📝
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarCat(cat.id)}
                                                        className="w-7 h-7 rounded-lg bg-white border border-[#f1f5f9] text-red-400 shadow-sm hover:bg-red-500 hover:text-white transition-all text-xs"
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#f1f5f9] bg-gray-50/30">
                            <button
                                onClick={() => { setShowCatModal(false); setEditingCat(null); }}
                                className="w-full premium-button-secondary !py-2 text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AuthenticatedLayout>
    );
}

