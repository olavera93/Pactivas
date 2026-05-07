import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Paginador({ total, page, perPage, onPage, onPerPage }) {
    const pages = Math.ceil(total / perPage);
    return (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
                    Pág. {page} de {Math.max(pages, 1)} · {total} registros
                </span>
                <select
                    value={perPage}
                    onChange={e => onPerPage(Number(e.target.value))}
                    className="text-[9px] font-black text-[#64748b] border border-[#f1f5f9] rounded-lg px-2 py-1 bg-white"
                >
                    {[10, 25, 50, 100].map(n => (
                        <option key={n} value={n}>Ver {n}</option>
                    ))}
                </select>
            </div>
            {pages > 1 && (
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
            )}
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

function SimpleBar({ data, colorFn }) {
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

function ReporteItem({ r, open, onToggle, seleccionado, onSeleccionar }) {
    const cfg = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG.pendiente;
    const form = useForm({ estado: r.estado, observacion_admin: r.observacion_admin || '' });

    const guardar = (e) => {
        e.stopPropagation();
        form.patch(route('admin.indicadores.estado', r.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <tr
                className={`border-b border-gray-50 cursor-pointer transition-colors ${seleccionado ? 'bg-[#eff6ff]' : open ? 'bg-[#f0f9ff]' : 'hover:bg-gray-50/60'}`}
                onClick={onToggle}
            >
                <td className="py-2 px-3 w-8" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={!!seleccionado} onChange={onSeleccionar}
                        className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer" />
                </td>
                <td className="py-2 px-2 w-6">
                    <svg className={`w-3.5 h-3.5 text-[#cbd5e1] transition-transform duration-300 ${open ? 'rotate-180 text-[#00a3e0]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[10px] font-bold text-[#0369a1] bg-[#e0f2fe] px-2 py-0.5 rounded font-mono whitespace-nowrap">{r.no_orden || '—'}</span>
                </td>
                <td className="py-2 px-3">
                    <div className="text-[12px] font-semibold text-gray-900 leading-tight">{r.nombre_responsable || '—'}</div>
                </td>
                <td className="py-2 px-3">
                    <div className="text-[11px] text-[#64748b]">{r.nombre_empleado}</div>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[11px] text-gray-600">{r.area_responsable || r.area}</span>
                </td>
                <td className="py-2 px-3 hidden md:table-cell">
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-widest">{r.categoria}</span>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[11px] text-[#64748b]">{fmtFecha(r.fecha_caso)}</span>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                    </span>
                </td>
                <td className="py-2 px-3 hidden md:table-cell">
                    <span className="text-[10px] text-[#94a3b8]">{fmtFecha(r.created_at)}</span>
                </td>
            </tr>

            {open && (
                <tr className="bg-[#f8fbff] border-b border-[#e6f6fd]">
                    <td colSpan="11" className="px-6 py-4">
                        <div className="space-y-3">
                            {/* Descripción */}
                            <div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Descripción</div>
                                <p className="text-[12px] text-[#334155] leading-relaxed bg-white rounded-lg p-3 border border-gray-100 italic">
                                    "{r.descripcion}"
                                </p>
                                {r.revisado_por && (
                                    <div className="text-[10px] text-[#94a3b8] mt-1.5">
                                        Revisado por <span className="font-semibold text-[#00a3e0]">{r.revisado_por}</span>
                                        {r.fecha_revision && <span> · {fmtFecha(r.fecha_revision)}</span>}
                                    </div>
                                )}
                            </div>

                            {/* Gestión */}
                            <div className="flex gap-3 border-t border-[#e6f6fd] pt-3" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                    <select
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                        value={form.data.estado}
                                        onChange={e => form.setData('estado', e.target.value)}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="confirmado">Confirmado</option>
                                        <option value="no_confirmado">No Confirmado</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Observación</label>
                                    <textarea
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9] w-full resize-none flex-1"
                                        rows={2}
                                        placeholder="Comentario administrativo..."
                                        value={form.data.observacion_admin}
                                        onChange={e => form.setData('observacion_admin', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button
                                        onClick={guardar}
                                        disabled={form.processing}
                                        className="premium-button-primary !py-2 !px-4 text-xs whitespace-nowrap"
                                    >
                                        {form.processing ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
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
    const [perPage, setPerPage] = useState(25);
    const [showCatModal, setShowCatModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [openReporteId, setOpenReporteId] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

    const toggleSeleccion = (id) => setSeleccionados(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    const toggleTodos = (ids) => setSeleccionados(prev =>
        prev.length === ids.length ? [] : ids
    );
    const eliminarSeleccionados = () => {
        router.delete(route('admin.indicadores.destroy-multiple'), {
            data: { ids: seleccionados },
            onSuccess: () => { setSeleccionados([]); setConfirmBulkDelete(false); },
        });
    };
    const exportarSeleccionados = () => {
        const params = new URLSearchParams();
        seleccionados.forEach(id => params.append('ids[]', id));
        window.location.href = `/admin/indicadores/export?${params.toString()}`;
    };

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
        window.location.href = `/admin/indicadores/export?${new URLSearchParams(filtros).toString()}`;
    };

    const exportarPdf = () => {
        window.location.href = `/admin/indicadores/export-pdf?${new URLSearchParams(filtros).toString()}`;
    };

    React.useEffect(() => { setPageOp(1); }, [filtros, perPage]);

    const registrosFiltrados = (stats.registros || []).filter(r => {
        if (filtros.estado && r.estado !== filtros.estado) return false;
        if (filtros.area   && (r.area_responsable || r.area) !== filtros.area) return false;
        if (filtros.fecha_inicio && r.created_at.slice(0, 10) < filtros.fecha_inicio) return false;
        if (filtros.fecha_fin   && r.created_at.slice(0, 10) > filtros.fecha_fin)   return false;
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
        >
            <Head title="Indicadores de Mejora" />

            <div className="flex items-center gap-2 mb-4">
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

            {/* ===== TAB: INDICADORES ===== */}
            {tab === 'indicadores' && (() => {
                const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                const fmtMes = ym => { const [y,m] = ym.split('-'); return `${MESES[+m-1]} ${y.slice(2)}`; };

                const tendenciaMap = registrosInd.reduce((acc, r) => {
                    const k = r.created_at.slice(0, 7);
                    acc[k] = (acc[k] || 0) + 1;
                    return acc;
                }, {});
                const tendencia = Object.entries(tendenciaMap)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([k, v]) => ({ mes: fmtMes(k), total: v }));

                const areaData = Object.entries(por_area)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8);
                const maxArea = Math.max(...areaData.map(([,v]) => v), 1);

                return (
                <div className="space-y-4 animate-fade-in-up">

                    {/* Filtros */}
                    <div className="premium-card p-3 flex flex-wrap items-end gap-2">
                        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Buscar</label>
                            <input
                                type="text"
                                className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                placeholder="Responsable, área, categoría..."
                                value={fechaInd.buscar || ''}
                                onChange={e => setFechaInd(p => ({ ...p, buscar: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                            <select
                                className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                value={fechaInd.area || ''}
                                onChange={e => setFechaInd(p => ({ ...p, area: e.target.value }))}
                            >
                                <option value="">Todas</option>
                                {(stats.areas || []).map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Desde</label>
                            <input type="date" className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={fechaInd.inicio} onChange={e => setFechaInd(p => ({ ...p, inicio: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hasta</label>
                            <input type="date" className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={fechaInd.fin} onChange={e => setFechaInd(p => ({ ...p, fin: e.target.value }))} />
                        </div>
                        {(hayFiltroInd || fechaInd.buscar) && (
                            <button onClick={() => setFechaInd({ inicio: '', fin: '', area: '', buscar: '' })} className="text-[9px] font-black text-[#94a3b8] hover:text-[#dc2626] transition-colors self-end mb-0.5">Limpiar</button>
                        )}
                        <div className="ml-auto text-right self-end">
                            <div className="text-[9px] font-black text-[#94a3b8] uppercase">Mostrando</div>
                            <div className="text-xs font-black text-[#00a3e0]">{totalInd} casos</div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <KpiCard label="Total Reportes" value={totalInd} sub={hayFiltroInd ? 'Filtrado' : 'Total histórico'} color="#00a3e0" icon="📊" />
                        <KpiCard label="Nuevos Hoy"     value={hoyInd}   sub="Registrados hoy"  color="#0ea5e9" icon="✨" />
                        <KpiCard label="Pendientes"     value={por_estado.pendiente || 0}  sub="Por revisar" color="#f59e0b" icon="⏳" />
                        <KpiCard label="Confirmados"    value={por_estado.confirmado || 0} sub="Finalizados"  color="#22c55e" icon="🎯" />
                    </div>

                    {/* Tendencia temporal */}
                    <div className="premium-card p-5">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00a3e0]" /> Tendencia por mes
                        </h3>
                        {tendencia.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-[#94a3b8] italic text-sm">Sin datos en este rango.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={tendencia} barSize={28} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ border: '1px solid #f1f5f9', borderRadius: 8, fontSize: 11, fontWeight: 700 }}
                                        formatter={v => [v, 'Registros']}
                                    />
                                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                        {tendencia.map((_, i) => (
                                            <Cell key={i} fill={i === tendencia.length - 1 ? '#00a3e0' : '#bfdbfe'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Estado + Categorías + Áreas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Estado */}
                        <div className="premium-card p-5">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] mb-5 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00a3e0]" /> Por estado
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => {
                                    const val = por_estado[key] || 0;
                                    const pct = totalInd > 0 ? Math.round((val / totalInd) * 100) : 0;
                                    return (
                                        <div key={key}>
                                            <div className="flex justify-between items-center text-[11px] mb-1.5">
                                                <span className="font-bold text-gray-700">{cfg.label}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-black text-gray-800">{val}</span>
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 font-bold">{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cfg.color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categorías */}
                        <div className="premium-card p-5">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] mb-5 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-pink-400" /> Por categoría
                            </h3>
                            {Object.keys(por_categoria).length === 0 ? (
                                <div className="h-32 flex items-center justify-center text-[#94a3b8] italic text-xs">Sin datos.</div>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(por_categoria).sort((a,b) => b[1]-a[1]).map(([cat, val]) => {
                                        const pct = totalInd > 0 ? Math.round((val / totalInd) * 100) : 0;
                                        return (
                                            <div key={cat}>
                                                <div className="flex justify-between text-[11px] mb-1">
                                                    <span className="font-bold text-gray-700 truncate">{cat}</span>
                                                    <span className="font-black text-gray-800 ml-2">{val}</span>
                                                </div>
                                                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-700 bg-pink-400" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Áreas */}
                        <div className="premium-card p-5">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] mb-5 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-400" /> Por área
                            </h3>
                            {areaData.length === 0 ? (
                                <div className="h-32 flex items-center justify-center text-[#94a3b8] italic text-xs">Sin datos.</div>
                            ) : (
                                <div className="space-y-3">
                                    {areaData.map(([area, val]) => (
                                        <div key={area}>
                                            <div className="flex justify-between text-[11px] mb-1">
                                                <span className="font-bold text-gray-700 truncate">{area || 'Sin área'}</span>
                                                <span className="font-black text-gray-800 ml-2">{val}</span>
                                            </div>
                                            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700 bg-violet-400" style={{ width: `${(val / maxArea) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
                );
            })()}

            {/* ===== TAB: REPORTES ===== */}
            {tab === 'reportes' && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Filtros */}
                    {(() => {
                        const hoy = () => new Date().toISOString().slice(0, 10);
                        const inicioSemana = () => {
                            const d = new Date();
                            d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
                            return d.toISOString().slice(0, 10);
                        };
                        const inicioMes = () => {
                            const d = new Date();
                            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
                        };
                        const inicioAnio = () => `${new Date().getFullYear()}-01-01`;

                        const rangos = [
                            { label: 'Hoy',        fi: hoy(),        ff: hoy() },
                            { label: 'Esta semana', fi: inicioSemana(), ff: hoy() },
                            { label: 'Este mes',   fi: inicioMes(),  ff: hoy() },
                            { label: 'Este año',   fi: inicioAnio(), ff: hoy() },
                        ];

                        const FILTRO_LABELS = {
                            nombre_responsable: { label: 'Responsable', fmt: v => v },
                            estado:             { label: 'Estado',      fmt: v => v.replace('_', ' ') },
                            area:               { label: 'Área',        fmt: v => v },
                            fecha_inicio:       { label: 'Desde',       fmt: v => fmtFecha(v) },
                            fecha_fin:          { label: 'Hasta',       fmt: v => fmtFecha(v) },
                        };

                        const chips = Object.entries(filtros)
                            .filter(([, v]) => v)
                            .map(([k, v]) => ({ key: k, text: `${FILTRO_LABELS[k].label}: ${FILTRO_LABELS[k].fmt(v)}` }));

                        const rangoActivo = rangos.find(r =>
                            r.fi === filtros.fecha_inicio && r.ff === filtros.fecha_fin
                        )?.label;

                        return (
                            <div className="premium-card p-3 space-y-2">
                                {/* Fila de inputs */}
                                <div className="flex flex-wrap items-end gap-2">
                                    <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Responsable</label>
                                        <input
                                            type="text"
                                            className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                            placeholder="Buscar por nombre..."
                                            value={filtros.nombre_responsable}
                                            onChange={e => setFiltros(p => ({ ...p, nombre_responsable: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Estado</label>
                                        <select
                                            className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                            value={filtros.estado}
                                            onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))}
                                        >
                                            <option value="">Todos</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="confirmado">Confirmado</option>
                                            <option value="no_confirmado">No Confirmado</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Área</label>
                                        <select
                                            className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                            value={filtros.area}
                                            onChange={e => setFiltros(p => ({ ...p, area: e.target.value }))}
                                        >
                                            <option value="">Todas</option>
                                            {(stats.areas || []).map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Desde</label>
                                        <input
                                            type="date"
                                            className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                            value={filtros.fecha_inicio}
                                            onChange={e => setFiltros(p => ({ ...p, fecha_inicio: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] px-0.5">Hasta</label>
                                        <input
                                            type="date"
                                            className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                            value={filtros.fecha_fin}
                                            onChange={e => setFiltros(p => ({ ...p, fecha_fin: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2 ml-auto flex-wrap">
                                        <span className="text-[10px] font-black text-[#00a3e0] bg-[#e6f6fd] px-2.5 py-1.5 rounded-lg whitespace-nowrap">{registrosFiltrados.length} resultados</span>
                                        {seleccionados.length > 0 && (
                                            <>
                                                <button onClick={exportarSeleccionados}
                                                    className="premium-button-primary !py-1.5 !px-3 text-xs !bg-green-600 hover:!bg-green-700 shadow-none whitespace-nowrap">
                                                    Exportar {seleccionados.length}
                                                </button>
                                                <button onClick={() => setConfirmBulkDelete(true)}
                                                    className="premium-button-primary !py-1.5 !px-3 text-xs !bg-red-500 hover:!bg-red-600 shadow-none whitespace-nowrap">
                                                    Eliminar {seleccionados.length}
                                                </button>
                                            </>
                                        )}
                                        <button onClick={exportar} className="premium-button-primary !py-1.5 !px-3 text-xs !bg-green-600 hover:!bg-green-700 shadow-none whitespace-nowrap">Excel</button>
                                        <button onClick={exportarPdf} className="premium-button-primary !py-1.5 !px-3 text-xs !bg-red-600 hover:!bg-red-700 shadow-none whitespace-nowrap">PDF</button>
                                    </div>
                                </div>

                                {/* Accesos rápidos de fecha */}
                                <div className="flex items-center gap-1.5 border-t border-[#f1f5f9] pt-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[#cbd5e1] mr-1">Período</span>
                                    {rangos.map(r => (
                                        <button
                                            key={r.label}
                                            onClick={() => setFiltros(p => ({ ...p, fecha_inicio: r.fi, fecha_fin: r.ff }))}
                                            className={`text-[9px] font-black px-2.5 py-1 rounded-md transition-all ${
                                                rangoActivo === r.label
                                                    ? 'bg-[#00a3e0] text-white'
                                                    : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e0f2fe] hover:text-[#00a3e0]'
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Chips de filtros activos */}
                                {chips.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f1f5f9] pt-2">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#cbd5e1] mr-1">Activos</span>
                                        {chips.map(c => (
                                            <span
                                                key={c.key}
                                                className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full"
                                            >
                                                {c.text}
                                                <button
                                                    onClick={() => setFiltros(p => ({ ...p, [c.key]: '' }))}
                                                    className="text-[#0369a1] hover:text-[#dc2626] font-black leading-none"
                                                >×</button>
                                            </span>
                                        ))}
                                        <button
                                            onClick={() => setFiltros({ estado: '', area: '', fecha_inicio: '', fecha_fin: '', nombre_responsable: '' })}
                                            className="text-[9px] font-black text-[#94a3b8] hover:text-[#dc2626] ml-1 transition-colors"
                                        >
                                            Limpiar todo
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

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
                                        <colgroup>
                                            <col className="w-8" />
                                            <col className="w-6" />
                                            <col className="w-24" />
                                            <col className="w-40" />
                                            <col className="w-40" />
                                            <col className="w-28" />
                                            <col className="w-28 hidden md:table-column" />
                                            <col className="w-24" />
                                            <col className="w-28" />
                                            <col className="w-24 hidden md:table-column" />
                                        </colgroup>
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-[#f1f5f9]">
                                                <th className="py-2 px-3 w-8">
                                                    <input type="checkbox"
                                                        className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer"
                                                        checked={seleccionados.length === registrosFiltrados.slice((pageOp-1)*perPage, pageOp*perPage).length && registrosFiltrados.length > 0}
                                                        onChange={() => toggleTodos(registrosFiltrados.slice((pageOp-1)*perPage, pageOp*perPage).map(r => r.id))}
                                                    />
                                                </th>
                                                <th className="py-2 px-2 w-6" />
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest whitespace-nowrap">Nº Orden</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Responsable</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Reportado por</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden md:table-cell">Categoría</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Fecha caso</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Estado</th>
                                                <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden md:table-cell">Registro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrosFiltrados.slice((pageOp - 1) * perPage, pageOp * perPage).map(r => (
                                                <ReporteItem key={r.id} r={r}
                                                    open={openReporteId === r.id}
                                                    onToggle={() => setOpenReporteId(openReporteId === r.id ? null : r.id)}
                                                    seleccionado={seleccionados.includes(r.id)}
                                                    onSeleccionar={() => toggleSeleccion(r.id)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Paginador total={registrosFiltrados.length} page={pageOp} perPage={perPage} onPage={setPageOp} onPerPage={setPerPage} />
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
            {confirmBulkDelete && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-[#0f172a] text-sm">¿Eliminar {seleccionados.length} registros?</h3>
                        <p className="text-xs text-[#64748b]">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmBulkDelete(false)} className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors">Cancelar</button>
                            <button onClick={eliminarSeleccionados} className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

