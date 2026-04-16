import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

const ESTADO_CONFIG = {
    pendiente:      { label: 'Pendiente',      color: '#f59e0b', bg: '#fffbeb', dot: '🟡' },
    confirmado:     { label: 'Confirmado',     color: '#22c55e', bg: '#f0fdf4', dot: '🟢' },
    no_confirmado:  { label: 'No Confirmado',  color: '#ef4444', bg: '#fef2f2', dot: '🔴' },
};


function KpiCard({ label, value, sub, color = '#00a3e0' }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-[#edf2f7] shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">{label}</div>
            <div className="text-[36px] font-black leading-none" style={{ color }}>{value}</div>
            {sub && <div className="text-[11px] text-[#94a3b8] mt-1">{sub}</div>}
        </div>
    );
}

function BarChart({ data, colorFn }) {
    const max = Math.max(...Object.values(data), 1);
    return (
        <div className="space-y-3">
            {Object.entries(data).map(([key, val]) => (
                <div key={key}>
                    <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-bold capitalize text-[#1a202c]">{key.replace('_', ' ')}</span>
                        <span className="font-black text-[#64748b]">{val}</span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(val / max) * 100}%`, background: colorFn ? colorFn(key) : '#00a3e0' }}
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
        <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
            {/* Cabecera clicable */}
            <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f5f9ff] transition-colors"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[11px] font-mono text-[#94a3b8] shrink-0">#{r.id}</span>
                    {r.no_orden && (
                        <span className="text-[11px] font-mono bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded shrink-0">{r.no_orden}</span>
                    )}
                    <div className="min-w-0">
                        <span className="font-bold text-[13px] text-[#1a202c] block truncate">{r.nombre_responsable || '—'}</span>
                        <span className="text-[11px] text-[#94a3b8]">{r.area_responsable || r.area} · {new Date(r.created_at).toLocaleDateString('es-CO')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[10px] font-bold bg-[#e6f6fd] text-[#00a3e0] px-2 py-1 rounded-lg hidden sm:inline">{r.categoria}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                    </span>
                    <svg className={`w-4 h-4 text-[#94a3b8] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Contenido desplegable */}
            {open && (
                <div className="px-5 pb-5 border-t border-[#f1f5f9] pt-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Reportado por</div>
                            <div className="font-bold text-[#1a202c]">{r.nombre_empleado}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Responsable</div>
                            <div className="font-bold text-[#1a202c]">{r.nombre_responsable || '—'}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Fecha del caso</div>
                            <div className="font-bold text-[#1a202c]">{r.fecha_caso || '—'}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Área</div>
                            <div className="font-bold text-[#1a202c]">{r.area_responsable || r.area}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Quien Socializa</div>
                            <div className="font-bold text-[#1a202c]">{r.nombre_socializador || '—'}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Colaborador que Recibe</div>
                            <div className="font-bold text-[#1a202c]">{r.nombre_receptor || '—'}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Descripción</div>
                        <p className="text-[13px] text-[#64748b] leading-relaxed bg-[#f8fafc] rounded-xl p-3">{r.descripcion}</p>
                    </div>

                    {r.observacion_admin && (
                        <div>
                            <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Observación Admin</div>
                            <p className="text-[13px] text-[#64748b] leading-relaxed bg-[#fffbeb] rounded-xl p-3">{r.observacion_admin}</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={() => onGestionar(r)}
                            className="bg-[#00a3e0] text-white text-[12px] font-bold px-4 py-2 rounded-xl hover:bg-[#007db0] transition-colors"
                        >
                            Gestionar
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

    const por_estado    = stats.por_estado    || {};
    const por_categoria = stats.por_categoria || {};
    const por_area      = stats.por_area      || {};

    const tabs = [
        { key: 'indicadores', label: 'Indicadores' },
        { key: 'reportes',    label: 'Reportes' },
        { key: 'analisis',    label: 'Análisis' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                            Indicadores de <span className="text-[#00a3e0]">Mejora</span>
                        </h2>
                        <p className="text-sm text-gray-500">Gestión de oportunidades de mejora SST</p>
                    </div>
                    <a
                        href="/oportunidades"
                        className="text-xs font-bold text-[#00a3e0] border border-[#00a3e0] px-4 py-2 rounded-xl hover:bg-[#00a3e0] hover:text-white transition-colors"
                        target="_blank"
                    >
                        Ver Landing
                    </a>
                </div>
            }
        >
            <Head title="Indicadores de Mejora" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Tabs */}
                <div className="flex gap-1 bg-[#f1f5f9] rounded-xl p-1 mb-8 w-fit">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === t.key ? 'bg-white text-[#00a3e0] shadow-sm' : 'text-[#64748b] hover:text-[#1a202c]'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ===== TAB: INDICADORES ===== */}
                {tab === 'indicadores' && (
                    <div className="space-y-8">
                        {/* KPIs principales */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <KpiCard label="Total Reportes" value={stats.total} sub="Desde el inicio" color="#00a3e0" />
                            <KpiCard label="Hoy" value={stats.hoy} sub="Nuevos hoy" color="#00a2e1" />
                            <KpiCard label="Pendientes" value={por_estado.pendiente || 0} sub="Sin gestionar" color="#f59e0b" />
                            <KpiCard label="Cerradas" value={por_estado.cerrada || 0} sub="Gestionadas" color="#22c55e" />
                        </div>

                        {/* Gráficas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Por Estado</h3>
                                <BarChart
                                    data={por_estado}
                                    colorFn={k => ESTADO_CONFIG[k]?.color || '#00a3e0'}
                                />
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Por Categoría</h3>
                                <BarChart data={por_categoria} />
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Por Área</h3>
                                <BarChart data={por_area} />
                            </div>
                        </div>

                        {/* Recientes */}
                        {stats.registros && stats.registros.length > 0 && (
                            <div className="bg-white rounded-2xl border border-[#edf2f7] shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-[#f1f5f9]">
                                    <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b]">Últimos Reportes</h3>
                                </div>
                                <div className="divide-y divide-[#f8fafc]">
                                    {stats.registros.slice(0, 5).map(r => (
                                        <div key={r.id} className="p-4 flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-[13px] text-[#1a202c]">{r.nombre_empleado}</div>
                                                <div className="text-[11px] text-[#64748b] mt-0.5">{r.categoria} · {r.area}</div>
                                                <div className="text-[12px] text-[#94a3b8] mt-1 truncate">{r.descripcion}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                                                    style={{ color: ESTADO_CONFIG[r.estado]?.color, background: ESTADO_CONFIG[r.estado]?.bg }}>
                                                    {ESTADO_CONFIG[r.estado]?.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== TAB: REPORTES ===== */}
                {tab === 'reportes' && (
                    <div className="space-y-5">
                        {/* Filtros */}
                        <div className="bg-white rounded-2xl p-5 border border-[#edf2f7] shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748b]">Filtros</span>
                                <span className="text-[11px] font-bold text-[#00a3e0]">{registrosFiltrados.length} resultado{registrosFiltrados.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                                {/* Buscador por nombre del reportado */}
                                <input
                                    type="text"
                                    className="p-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#00a3e0]"
                                    placeholder="Buscar reportado..."
                                    value={filtros.nombre_responsable}
                                    onChange={e => setFiltros(p => ({ ...p, nombre_responsable: e.target.value }))}
                                />
                                {/* Estado */}
                                <select
                                    className="p-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#00a3e0]"
                                    value={filtros.estado}
                                    onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))}
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="no_confirmado">No Confirmado</option>
                                </select>

                                {/* Área desde BD */}
                                <select
                                    className="p-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#00a3e0]"
                                    value={filtros.area}
                                    onChange={e => setFiltros(p => ({ ...p, area: e.target.value }))}
                                >
                                    <option value="">Todas las áreas</option>
                                    {(stats.areas || []).map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>

                                {/* Fecha inicio */}
                                <div className="flex flex-col gap-0.5">
                                    <label className="text-[9px] font-bold uppercase text-[#94a3b8] px-1">Desde</label>
                                    <input
                                        type="date"
                                        className="p-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#00a3e0]"
                                        value={filtros.fecha_inicio}
                                        onChange={e => setFiltros(p => ({ ...p, fecha_inicio: e.target.value }))}
                                    />
                                </div>

                                {/* Fecha fin */}
                                <div className="flex flex-col gap-0.5">
                                    <label className="text-[9px] font-bold uppercase text-[#94a3b8] px-1">Hasta</label>
                                    <input
                                        type="date"
                                        className="p-2 border border-[#cbd5e1] rounded-xl text-[13px] outline-none focus:border-[#00a3e0]"
                                        value={filtros.fecha_fin}
                                        onChange={e => setFiltros(p => ({ ...p, fecha_fin: e.target.value }))}
                                    />
                                </div>

                                {/* Exportar Excel */}
                                <button
                                    onClick={exportar}
                                    className="p-2 bg-green-600 text-white rounded-xl text-[12px] font-bold hover:bg-green-700 transition-colors self-end"
                                >
                                    📊 Excel
                                </button>

                                {/* Exportar PDF */}
                                <button
                                    onClick={exportarPdf}
                                    className="p-2 bg-red-600 text-white rounded-xl text-[12px] font-bold hover:bg-red-700 transition-colors self-end"
                                >
                                    📄 PDF
                                </button>
                            </div>
                        </div>

                        {/* Lista desplegable */}
                        <div className="space-y-2">
                            {registrosFiltrados.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center text-[#94a3b8] italic border border-[#edf2f7]">
                                    No hay reportes que coincidan con los filtros.
                                </div>
                            ) : registrosFiltrados.map(r => (
                                <ReporteItem key={r.id} r={r} onGestionar={abrirModal} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== TAB: ANÁLISIS ===== */}
                {tab === 'analisis' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Distribución por estado */}
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm md:col-span-1">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Estado de Reportes</h3>
                                <div className="space-y-4">
                                    {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => {
                                        const val = por_estado[key] || 0;
                                        const pct = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
                                        return (
                                            <div key={key}>
                                                <div className="flex justify-between text-[12px] mb-1">
                                                    <span className="font-bold">{cfg.dot} {cfg.label}</span>
                                                    <span className="font-black text-[#64748b]">{pct}% ({val})</span>
                                                </div>
                                                <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Top categorías */}
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm md:col-span-2">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Categorías más Reportadas</h3>
                                {Object.keys(por_categoria).length === 0 ? (
                                    <p className="text-[#94a3b8] text-sm italic">Sin datos aún.</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(por_categoria)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([cat, val]) => (
                                                <div key={cat} className="flex items-center justify-between bg-[#e6f6fd] rounded-xl px-4 py-3">
                                                    <span className="text-[13px] font-bold text-[#00a3e0]">{cat}</span>
                                                    <span className="text-[20px] font-black text-[#00a3e0]">{val}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Áreas con más reportes */}
                        {Object.keys(por_area).length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-[#edf2f7] shadow-sm">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-[#64748b] mb-5">Participación por Área</h3>
                                <BarChart data={Object.fromEntries(
                                    Object.entries(por_area).sort((a, b) => b[1] - a[1])
                                )} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal gestionar estado */}
            {modalData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-[#f1f5f9] bg-[#e6f6fd]">
                            <h3 className="text-[16px] font-black text-[#00a3e0]">Gestionar Oportunidad #{modalData.id}</h3>
                            <p className="text-[12px] text-[#64748b] mt-1">{modalData.nombre_empleado} · {modalData.area}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-[#f8fafc] rounded-xl p-4 text-[13px] text-[#64748b] leading-relaxed">
                                {modalData.descripcion}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-[#64748b] mb-2 block">Cambiar Estado</label>
                                <select
                                    className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none focus:border-[#00a3e0]"
                                    value={estadoForm.data.estado}
                                    onChange={e => estadoForm.setData('estado', e.target.value)}
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="no_confirmado">No Confirmado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-[#64748b] mb-2 block">Observación (opcional)</label>
                                <textarea
                                    className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none focus:border-[#00a3e0] resize-none"
                                    rows={3}
                                    placeholder="Acciones tomadas, comentarios..."
                                    value={estadoForm.data.observacion_admin}
                                    onChange={e => estadoForm.setData('observacion_admin', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-[#f1f5f9] flex gap-3">
                            <button
                                onClick={() => setModalData(null)}
                                className="flex-1 p-3 border border-[#cbd5e1] rounded-xl text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarEstado}
                                disabled={estadoForm.processing}
                                className="flex-1 p-3 bg-[#00a3e0] text-white rounded-xl text-[13px] font-bold hover:bg-[#007db0] transition-colors"
                            >
                                {estadoForm.processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
