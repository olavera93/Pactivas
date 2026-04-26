import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

const PER_PAGE = 25;

const ESTADO_CONFIG = {
    pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb' },
    aprobado:  { label: 'Aprobado',  color: '#16a34a', bg: '#f0fdf4' },
    rechazado: { label: 'Rechazado', color: '#dc2626', bg: '#fef2f2' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

function FilaRegistro({ r, open, onToggle }) {
    const cfg = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG.pendiente;
    const form = useForm({ estado: r.estado, observacion_admin: r.observacion_admin || '' });

    const guardar = (e) => {
        e.stopPropagation();
        form.patch(route('admin.horas-extras.estado', r.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <tr
                className={`border-b border-gray-50 cursor-pointer transition-colors ${open ? 'bg-[#f0f9ff]' : 'hover:bg-gray-50/60'}`}
                onClick={onToggle}
            >
                <td className="py-2 px-4 w-8">
                    <svg className={`w-3.5 h-3.5 text-[#cbd5e1] transition-transform duration-300 ${open ? 'rotate-180 text-[#00a3e0]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
                <td className="py-2 px-3">
                    <div className="text-[12px] font-semibold text-gray-900">{r.nombre_empleado}</div>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[11px] text-gray-600">{r.area || <span className="text-[#cbd5e1]">—</span>}</span>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[11px] text-[#64748b]">{fmtFecha(r.fecha)}</span>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[13px] font-black text-[#0284c7]">{r.horas}h</span>
                </td>
                <td className="py-2 px-3">
                    <div className="text-[11px] text-gray-900 font-medium">{r.revisado_por || <span className="text-[#cbd5e1]">—</span>}</div>
                </td>
                <td className="py-2 px-3 hidden md:table-cell">
                    <span className="text-[11px] text-[#64748b] line-clamp-1">{r.motivo}</span>
                </td>
                <td className="py-2 px-3">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                    </span>
                </td>
                <td className="py-2 px-3 hidden md:table-cell">
                    <span className="text-[10px] text-[#94a3b8]">{fmtFecha(r.created_at)}</span>
                </td>
            </tr>

            {open && (
                <tr className="bg-[#f8fbff] border-b border-[#e6f6fd]">
                    <td colSpan="9" className="px-6 py-4">
                        <div className="space-y-3">
                            {/* Motivo */}
                            <div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Motivo</div>
                                <p className="text-[12px] text-[#334155] leading-relaxed bg-white rounded-lg p-3 border border-gray-100 italic">
                                    "{r.motivo}"
                                </p>
                                {r.revisado_por && (
                                    <div className="text-[9px] text-[#94a3b8] mt-1.5">
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
                                        <option value="aprobado">Aprobado</option>
                                        <option value="rechazado">Rechazado</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Observación</label>
                                    <textarea
                                        className="premium-input !py-2 shadow-none border-[#f1f5f9] w-full resize-none"
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

export default function HorasExtras({ auth, registros = [], areas = [] }) {
    const [filtros, setFiltros] = useState({ nombre: '', estado: '', area: '', fecha_inicio: '', fecha_fin: '' });
    const [page, setPage]       = useState(1);
    const [openId, setOpenId]   = useState(null);

    React.useEffect(() => setPage(1), [filtros]);

    const filtrados = registros.filter(r => {
        if (filtros.nombre  && !r.nombre_empleado.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
        if (filtros.estado  && r.estado !== filtros.estado) return false;
        if (filtros.area    && r.area !== filtros.area) return false;
        if (filtros.fecha_inicio && r.fecha < filtros.fecha_inicio) return false;
        if (filtros.fecha_fin    && r.fecha > filtros.fecha_fin)    return false;
        return true;
    });

    const pages    = Math.ceil(filtrados.length / PER_PAGE);
    const paginado = filtrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const totalHoras    = filtrados.reduce((s, r) => s + parseFloat(r.horas), 0);
    const pendientes    = filtrados.filter(r => r.estado === 'pendiente').length;
    const aprobados     = filtrados.filter(r => r.estado === 'aprobado').length;
    const horasAprobadas = filtrados.filter(r => r.estado === 'aprobado').reduce((s, r) => s + parseFloat(r.horas), 0);

    const hoy = () => new Date().toISOString().slice(0, 10);
    const inicioMes = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; };
    const inicioAnio = () => `${new Date().getFullYear()}-01-01`;

    const rangos = [
        { label: 'Hoy',      fi: hoy(),        ff: hoy() },
        { label: 'Este mes', fi: inicioMes(),   ff: hoy() },
        { label: 'Este año', fi: inicioAnio(),  ff: hoy() },
    ];
    const rangoActivo = rangos.find(r => r.fi === filtros.fecha_inicio && r.ff === filtros.fecha_fin)?.label;

    const chips = [
        filtros.nombre       && { key: 'nombre',       text: `Empleado: ${filtros.nombre}` },
        filtros.estado       && { key: 'estado',        text: `Estado: ${filtros.estado}` },
        filtros.area         && { key: 'area',          text: `Área: ${filtros.area}` },
        filtros.fecha_inicio && { key: 'fecha_inicio',  text: `Desde: ${fmtFecha(filtros.fecha_inicio)}` },
        filtros.fecha_fin    && { key: 'fecha_fin',     text: `Hasta: ${fmtFecha(filtros.fecha_fin)}` },
    ].filter(Boolean);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Horas <span className="text-[#00a2e1]">Extras</span></h2>
                        <p className="text-sm text-gray-500">Registro y gestión de horas adicionales</p>
                    </div>
                </div>
            }
        >
            <Head title="Horas Extras" />

            <div className="space-y-4">

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total registros',  value: filtrados.length,              color: '#0284c7' },
                        { label: 'Horas registradas',value: `${totalHoras.toFixed(1)}h`,   color: '#8b5cf6' },
                        { label: 'Pendientes',        value: pendientes,                    color: '#f59e0b' },
                        { label: 'Horas aprobadas',   value: `${horasAprobadas.toFixed(1)}h`, color: '#16a34a' },
                    ].map(k => (
                        <div key={k.label} className="premium-card p-4 flex items-center justify-between">
                            <div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">{k.label}</div>
                                <div className="text-2xl font-black" style={{ color: k.color }}>{k.value}</div>
                            </div>
                            <div className="w-2 h-8 rounded-full opacity-30" style={{ background: k.color }} />
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="premium-card p-3 space-y-2">
                    <div className="flex flex-wrap items-end gap-2">
                        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Empleado</label>
                            <input
                                type="text"
                                className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs"
                                placeholder="Buscar por nombre..."
                                value={filtros.nombre}
                                onChange={e => setFiltros(p => ({ ...p, nombre: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                            <select className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={filtros.estado} onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))}>
                                <option value="">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                            <select className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={filtros.area} onChange={e => setFiltros(p => ({ ...p, area: e.target.value }))}>
                                <option value="">Todas</option>
                                {[...new Set(registros.map(r => r.area).filter(Boolean))].sort().map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Desde</label>
                            <input type="date" className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={filtros.fecha_inicio} onChange={e => setFiltros(p => ({ ...p, fecha_inicio: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hasta</label>
                            <input type="date" className="premium-input !py-1.5 shadow-none border-[#f1f5f9] text-xs" value={filtros.fecha_fin} onChange={e => setFiltros(p => ({ ...p, fecha_fin: e.target.value }))} />
                        </div>
                                        <div className="flex items-end gap-2 ml-auto">
                            <span className="text-[10px] font-black text-[#00a3e0] bg-[#e6f6fd] px-2.5 py-1.5 rounded-lg whitespace-nowrap">{filtrados.length} resultados</span>
                            <button
                                onClick={() => window.location.href = `/admin/horas-extras/export?${new URLSearchParams(filtros).toString()}`}
                                className="premium-button-primary !py-1.5 !px-3 text-xs !bg-green-600 hover:!bg-green-700 shadow-none whitespace-nowrap"
                            >Excel</button>
                        </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="flex items-center gap-1.5 border-t border-[#f1f5f9] pt-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#cbd5e1] mr-1">Período</span>
                        {rangos.map(r => (
                            <button key={r.label} onClick={() => setFiltros(p => ({ ...p, fecha_inicio: r.fi, fecha_fin: r.ff }))}
                                className={`text-[9px] font-black px-2.5 py-1 rounded-md transition-all ${rangoActivo === r.label ? 'bg-[#00a3e0] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e0f2fe] hover:text-[#00a3e0]'}`}>
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Chips */}
                    {chips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f1f5f9] pt-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#cbd5e1] mr-1">Activos</span>
                            {chips.map(c => (
                                <span key={c.key} className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full">
                                    {c.text}
                                    <button onClick={() => setFiltros(p => ({ ...p, [c.key]: '' }))} className="hover:text-[#dc2626] font-black">×</button>
                                </span>
                            ))}
                            <button onClick={() => setFiltros({ nombre: '', estado: '', area: '', fecha_inicio: '', fecha_fin: '' })} className="text-[9px] font-black text-[#94a3b8] hover:text-[#dc2626] ml-1 transition-colors">Limpiar todo</button>
                        </div>
                    )}
                </div>

                {/* Tabla */}
                <div className="premium-card !p-0 overflow-hidden">
                    {filtrados.length === 0 ? (
                        <div className="p-20 text-center text-gray-400 italic text-sm">Sin registros.</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left table-fixed">
                                    <colgroup>
                                        <col className="w-8" />
                                        <col />
                                        <col className="w-32" />
                                        <col className="w-24" />
                                        <col className="w-16" />
                                        <col className="w-36" />
                                        <col className="w-36 hidden md:table-column" />
                                        <col className="w-28" />
                                        <col className="w-24 hidden md:table-column" />
                                    </colgroup>
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-[#f1f5f9]">
                                            <th className="py-2 px-4" />
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Empleado</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Fecha</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Horas</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Revisado por</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden md:table-cell">Motivo</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Estado</th>
                                            <th className="py-2 px-3 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest hidden md:table-cell">Registro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginado.map(r => (
                                            <FilaRegistro key={r.id} r={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {pages > 1 && (
                                <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 bg-gray-50/30">
                                    <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
                                        Pág. {page} de {pages} · {filtrados.length} registros
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                                            className="w-7 h-7 rounded-lg border border-[#f1f5f9] bg-white text-[#64748b] text-xs font-black hover:bg-[#00a2e1] hover:text-white disabled:opacity-30 transition-all">‹</button>
                                        {Array.from({ length: pages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`w-7 h-7 rounded-lg border text-[10px] font-black transition-all ${p === page ? 'bg-[#00a2e1] text-white border-[#00a2e1]' : 'border-[#f1f5f9] bg-white text-[#64748b] hover:bg-gray-50'}`}>
                                                {p}
                                            </button>
                                        ))}
                                        <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
                                            className="w-7 h-7 rounded-lg border border-[#f1f5f9] bg-white text-[#64748b] text-xs font-black hover:bg-[#00a2e1] hover:text-white disabled:opacity-30 transition-all">›</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
