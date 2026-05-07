import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

const PER_PAGE = 25;

const ESTADO = {
    pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb' },
    aprobado:  { label: 'Aprobado',  color: '#16a34a', bg: '#f0fdf4' },
    rechazado: { label: 'Rechazado', color: '#dc2626', bg: '#fef2f2' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

function EstadoBadge({ estado }) {
    const cfg = ESTADO[estado] || ESTADO.pendiente;
    return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap"
            style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
        </span>
    );
}

function FilaRegistro({ r, open, onToggle, seleccionado, onSeleccionar }) {
    const form = useForm({ estado: r.estado, observacion_admin: r.observacion_admin || '', horas: r.horas });

    const guardar = (e) => {
        e.stopPropagation();
        form.patch(route('admin.horas-extras.estado', r.id), { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <tr className={`border-b border-[#f8fafc] cursor-pointer transition-colors ${seleccionado ? 'bg-[#eff6ff]' : open ? 'bg-[#f0f9ff]' : 'hover:bg-[#f8fafc]'}`}
                onClick={onToggle}>
                <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={seleccionado} onChange={onSeleccionar}
                        className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer" />
                </td>
                <td className="py-2.5 px-2 w-5">
                    <svg className={`w-3 h-3 text-[#cbd5e1] transition-transform ${open ? 'rotate-180 text-[#0284c7]' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
                <td className="py-2.5 px-4">
                    <div className="text-xs font-semibold text-[#1e293b]">{r.nombre_empleado}</div>
                </td>
                <td className="py-2.5 px-4">
                    <span className="text-[10px] text-[#64748b]">{r.area || '—'}</span>
                </td>
                <td className="py-2.5 px-4">
                    <span className="text-xs text-[#475569]">{fmtFecha(r.fecha)}</span>
                </td>
                <td className="py-2.5 px-4">
                    <span className="text-[10px] text-[#94a3b8]">{fmtFecha(r.created_at)}</span>
                </td>
                <td className="py-2.5 px-4 text-center">
                    <span className="text-sm font-black text-[#0284c7]">{r.horas}<span className="text-[9px]">h</span></span>
                </td>
                <td className="py-2.5 px-4">
                    <p className="text-[11px] text-[#64748b] line-clamp-1">{r.motivo || '—'}</p>
                </td>
                <td className="py-2.5 px-4">
                    <EstadoBadge estado={r.estado} />
                    {r.revisado_por && (
                        <div className="text-[9px] text-[#94a3b8] mt-1 truncate max-w-[130px]">{r.revisado_por}</div>
                    )}
                </td>
            </tr>

            {open && (
                <tr className="bg-[#f8fbff] border-b border-[#e0f2fe]">
                    <td colSpan="9" className="px-6 py-4">
                        <div className="space-y-3">
                            <div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Motivo completo</div>
                                <p className="text-xs text-[#334155] leading-relaxed bg-white rounded-lg px-3 py-2 border border-[#e2e8f0] italic">
                                    "{r.motivo}"
                                </p>
                                {r.revisado_por && (
                                    <div className="text-[9px] text-[#94a3b8] mt-1.5">
                                        Revisado por <span className="font-semibold text-[#0284c7]">{r.revisado_por}</span>
                                        {r.fecha_revision && <> · {fmtFecha(r.fecha_revision)}</>}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 border-t border-[#e2e8f0] pt-3" onClick={e => e.stopPropagation()}>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Horas</label>
                                    <input type="number" min="0.5" max="24" step="0.5"
                                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] w-20 transition-colors"
                                        value={form.data.horas} onChange={e => form.setData('horas', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                    <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                        value={form.data.estado} onChange={e => form.setData('estado', e.target.value)}>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobado">Aprobado</option>
                                        <option value="rechazado">Rechazado</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Observación</label>
                                    <textarea rows={2} placeholder="Comentario administrativo..."
                                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors resize-none"
                                        value={form.data.observacion_admin} onChange={e => form.setData('observacion_admin', e.target.value)} />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button onClick={guardar} disabled={form.processing}
                                        className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50 whitespace-nowrap">
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
    const [seleccionados, setSeleccionados] = useState([]);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

    const toggleSeleccion = (id) => setSeleccionados(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    const toggleTodos = (ids) => setSeleccionados(prev =>
        prev.length === ids.length ? [] : ids
    );
    const eliminarSeleccionados = () => {
        router.delete(route('admin.horas-extras.destroy-multiple'), {
            data: { ids: seleccionados },
            onSuccess: () => { setSeleccionados([]); setConfirmBulkDelete(false); },
        });
    };
    const exportarSeleccionados = () => {
        const params = new URLSearchParams();
        seleccionados.forEach(id => params.append('ids[]', id));
        window.location.href = `/admin/horas-extras/export?${params.toString()}`;
    };

    React.useEffect(() => setPage(1), [filtros]);

    const filtrados = registros.filter(r => {
        if (filtros.nombre       && !r.nombre_empleado.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
        if (filtros.estado       && r.estado !== filtros.estado) return false;
        if (filtros.area         && r.area !== filtros.area) return false;
        if (filtros.fecha_inicio && r.fecha < filtros.fecha_inicio) return false;
        if (filtros.fecha_fin    && r.fecha > filtros.fecha_fin)    return false;
        return true;
    });

    const pages    = Math.ceil(filtrados.length / PER_PAGE);
    const paginado = filtrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const totalHoras     = filtrados.reduce((s, r) => s + parseFloat(r.horas), 0);
    const pendientes     = filtrados.filter(r => r.estado === 'pendiente').length;
    const horasAprobadas = filtrados.filter(r => r.estado === 'aprobado').reduce((s, r) => s + parseFloat(r.horas), 0);

    const hoy      = () => new Date().toISOString().slice(0, 10);
    const inicioMes  = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; };
    const inicioAnio = () => `${new Date().getFullYear()}-01-01`;
    const rangos = [
        { label: 'Hoy',      fi: hoy(),       ff: hoy() },
        { label: 'Este mes', fi: inicioMes(),  ff: hoy() },
        { label: 'Este año', fi: inicioAnio(), ff: hoy() },
    ];
    const rangoActivo = rangos.find(r => r.fi === filtros.fecha_inicio && r.ff === filtros.fecha_fin)?.label;

    const chips = [
        filtros.nombre       && { key: 'nombre',       text: `Empleado: ${filtros.nombre}` },
        filtros.estado       && { key: 'estado',        text: `Estado: ${filtros.estado}` },
        filtros.area         && { key: 'area',          text: `Área: ${filtros.area}` },
        filtros.fecha_inicio && { key: 'fecha_inicio',  text: `Desde: ${fmtFecha(filtros.fecha_inicio)}` },
        filtros.fecha_fin    && { key: 'fecha_fin',     text: `Hasta: ${fmtFecha(filtros.fecha_fin)}` },
    ].filter(Boolean);

    const inp = 'px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Horas Extras" />

            <div className="space-y-4">

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total registros',   value: filtrados.length,              color: '#0284c7' },
                        { label: 'Horas registradas', value: `${totalHoras.toFixed(1)}h`,   color: '#8b5cf6' },
                        { label: 'Pendientes',         value: pendientes,                   color: '#f59e0b' },
                        { label: 'Horas aprobadas',    value: `${horasAprobadas.toFixed(1)}h`, color: '#16a34a' },
                    ].map(k => (
                        <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
                            <div>
                                <div className="text-[7px] font-black uppercase tracking-widest text-[#94a3b8] mb-0.5">{k.label}</div>
                                <div className="text-2xl font-black leading-none" style={{ color: k.color }}>{k.value}</div>
                            </div>
                            <div className="w-1.5 h-6 rounded-full opacity-20" style={{ background: k.color }} />
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 space-y-3">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Empleado</label>
                            <input type="text" className={inp} placeholder="Buscar por nombre..."
                                value={filtros.nombre} onChange={e => setFiltros(p => ({ ...p, nombre: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                            <select className={inp} value={filtros.estado} onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))}>
                                <option value="">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                            <select className={inp} value={filtros.area} onChange={e => setFiltros(p => ({ ...p, area: e.target.value }))}>
                                <option value="">Todas</option>
                                {[...new Set(registros.map(r => r.area).filter(Boolean))].sort().map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Desde</label>
                            <input type="date" className={inp} value={filtros.fecha_inicio} onChange={e => setFiltros(p => ({ ...p, fecha_inicio: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hasta</label>
                            <input type="date" className={inp} value={filtros.fecha_fin} onChange={e => setFiltros(p => ({ ...p, fecha_fin: e.target.value }))} />
                        </div>
                        <div className="flex items-center gap-2 ml-auto flex-wrap">
                            <span className="text-[10px] font-bold text-[#94a3b8]">{filtrados.length} registros</span>
                            {seleccionados.length > 0 && (
                                <>
                                    <button onClick={exportarSeleccionados}
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors whitespace-nowrap">
                                        Exportar {seleccionados.length}
                                    </button>
                                    <button onClick={() => setConfirmBulkDelete(true)}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors whitespace-nowrap">
                                        Eliminar {seleccionados.length}
                                    </button>
                                </>
                            )}
                            <button onClick={() => window.location.href = `/admin/horas-extras/export?${new URLSearchParams(filtros).toString()}`}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors whitespace-nowrap">
                                Exportar todo
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 border-t border-[#f1f5f9] pt-2.5 flex-wrap">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8] mr-1">Período</span>
                        {rangos.map(r => (
                            <button key={r.label} onClick={() => setFiltros(p => ({ ...p, fecha_inicio: r.fi, fecha_fin: r.ff }))}
                                className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${rangoActivo === r.label ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]'}`}>
                                {r.label}
                            </button>
                        ))}
                        {chips.length > 0 && (
                            <>
                                <span className="text-[#e2e8f0] mx-1">|</span>
                                {chips.map(c => (
                                    <span key={c.key} className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full">
                                        {c.text}
                                        <button onClick={() => setFiltros(p => ({ ...p, [c.key]: '' }))} className="hover:text-red-500 font-black">×</button>
                                    </span>
                                ))}
                                <button onClick={() => setFiltros({ nombre: '', estado: '', area: '', fecha_inicio: '', fecha_fin: '' })}
                                    className="text-[9px] font-bold text-[#94a3b8] hover:text-red-500 transition-colors">
                                    Limpiar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                    {filtrados.length === 0 ? (
                        <div className="py-16 text-center text-[#94a3b8] text-sm italic">Sin registros para mostrar.</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                            <th className="py-2 px-3 w-8">
                                                <input type="checkbox"
                                                    className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer"
                                                    checked={seleccionados.length === paginado.length && paginado.length > 0}
                                                    onChange={() => toggleTodos(paginado.map(r => r.id))} />
                                            </th>
                                            <th className="py-2 px-2 w-5" />
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Fecha solicitud</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Fecha registro</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Horas</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Motivo</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f8fafc]">
                                        {paginado.map(r => (
                                            <FilaRegistro key={r.id} r={r}
                                                open={openId === r.id}
                                                onToggle={() => setOpenId(openId === r.id ? null : r.id)}
                                                seleccionado={seleccionados.includes(r.id)}
                                                onSeleccionar={() => toggleSeleccion(r.id)} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pages > 1 && (
                                <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center justify-between">
                                    <span className="text-[10px] text-[#94a3b8]">Pág. {page} de {pages} · {filtrados.length} registros</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                                            className="px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-30 transition-colors">‹</button>
                                        {Array.from({ length: pages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-colors ${p === page ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]'}`}>
                                                {p}
                                            </button>
                                        ))}
                                        <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
                                            className="px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-30 transition-colors">›</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

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
