import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ESTADOS = {
    asiste:      { label: 'Asiste',      color: '#16a34a', bg: '#f0fdf4' },
    ausente:     { label: 'Ausente',     color: '#dc2626', bg: '#fef2f2' },
    permiso:     { label: 'Permiso',     color: '#f59e0b', bg: '#fffbeb' },
    vacaciones:  { label: 'Vacaciones',  color: '#0284c7', bg: '#e0f2fe' },
    incapacidad:   { label: 'Incapacidad',   color: '#8b5cf6', bg: '#f5f3ff' },
    compensatorio: { label: 'Compensatorio', color: '#0d9488', bg: '#f0fdfa' },
};

const fmtFecha = (val) => {
    if (!val) return '—';
    const [y, m, d] = String(val).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

const fmtHora = (val) => val ? String(val).slice(0, 5) : '—';

function EstadoBadge({ estado }) {
    const cfg = ESTADOS[estado] || ESTADOS.asiste;
    return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
        </span>
    );
}

function FormTurno({ form, colaboradores, onSubmit, processing, errors, submitLabel = 'Guardar' }) {
    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Colaborador</label>
                <input
                    list="colab-list"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                    placeholder="Nombre del colaborador..."
                    value={form.data.nombre_colaborador}
                    onChange={e => {
                        form.setData('nombre_colaborador', e.target.value);
                        const match = colaboradores.find(c => `${c.nombres} ${c.apellidos}` === e.target.value);
                        if (match) form.setData('documento_colaborador', match.documento);
                    }}
                    required
                />
                <datalist id="colab-list">
                    {colaboradores.map(c => (
                        <option key={c.id} value={`${c.nombres} ${c.apellidos}`} />
                    ))}
                </datalist>
                {errors.nombre_colaborador && <p className="text-red-500 text-[10px]">{errors.nombre_colaborador}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Documento (opcional)</label>
                <input
                    type="text"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors font-mono"
                    placeholder="Nº de documento..."
                    value={form.data.documento_colaborador}
                    onChange={e => form.setData('documento_colaborador', e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Fecha *</label>
                <input
                    type="date"
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                    value={form.data.fecha}
                    onChange={e => form.setData('fecha', e.target.value)}
                    required
                />
                {errors.fecha && <p className="text-red-500 text-[10px]">{errors.fecha}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hora inicio *</label>
                    <input
                        type="time"
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                        value={form.data.hora_inicio}
                        onChange={e => form.setData('hora_inicio', e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hora fin *</label>
                    <input
                        type="time"
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                        value={form.data.hora_fin}
                        onChange={e => form.setData('hora_fin', e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado *</label>
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(ESTADOS).map(([key, cfg]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => form.setData('estado', key)}
                            className="text-[9px] font-bold px-2.5 py-1 rounded-full border transition-colors"
                            style={form.data.estado === key
                                ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                                : { background: '#f8fafc', color: '#94a3b8', borderColor: '#e2e8f0' }
                            }
                        >
                            {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Observación</label>
                <textarea
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors resize-none"
                    rows={2}
                    placeholder="Opcional..."
                    value={form.data.observacion}
                    onChange={e => form.setData('observacion', e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50"
            >
                {processing ? 'Guardando...' : submitLabel}
            </button>
        </form>
    );
}

export default function Turnos({ turnos = { data: [], links: [], meta: {} }, turnosVista = [], semanaVista = null, colaboradores = [], areas = [], filtros = {} }) {
    const filasTurnos  = turnos.data      ?? [];
    const turnosLinks  = turnos.links     ?? [];
    const turnosTotal  = turnos.total     ?? 0;
    const turnosFrom   = turnos.from      ?? 0;
    const turnosTo     = turnos.to        ?? 0;
    const lastPage     = turnos.last_page ?? 1;
    const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
    const [modalPlantilla, setModalPlantilla] = useState(false);
    const [plantillaForm, setPlantillaForm] = useState({ semana: todayStr, area: '' });
    const [editando, setEditando] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
    const [tabActiva, setTabActiva] = useState('lista');
    const [importRows, setImportRows] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importError, setImportError] = useState(null);

    const form = useForm({
        nombre_colaborador: '',
        documento_colaborador: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        estado: 'asiste',
        observacion: '',
    });

    const editForm = useForm({
        nombre_colaborador: '',
        documento_colaborador: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        estado: 'asiste',
        observacion: '',
    });

    const filtroForm = useForm({
        fecha_inicio: filtros.fecha_inicio || '',
        fecha_fin:    filtros.fecha_fin    || '',
        estado:       filtros.estado       || '',
        area:         filtros.area         || '',
        buscar:       filtros.buscar       || '',
    });

    const [archivoImport, setArchivoImport] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.turnos.store'), { onSuccess: () => form.reset() });
    };

    const abrirEdicion = (t) => {
        setEditando(t);
        editForm.setData({
            nombre_colaborador:    t.nombre_colaborador,
            documento_colaborador: t.documento_colaborador || '',
            fecha:                 t.fecha,
            hora_inicio:           fmtHora(t.hora_inicio),
            hora_fin:              fmtHora(t.hora_fin),
            estado:                t.estado,
            observacion:           t.observacion || '',
        });
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        editForm.put(route('admin.turnos.update', editando.id), { onSuccess: () => setEditando(null) });
    };

    const toggleSeleccion = (id) => setSeleccionados(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    const toggleTodos = () => setSeleccionados(prev =>
        prev.length === filasTurnos.length ? [] : filasTurnos.map(t => t.id)
    );

    const eliminarSeleccionados = () => {
        router.delete(route('admin.turnos.destroy-multiple'), {
            data: { ids: seleccionados },
            onSuccess: () => { setSeleccionados([]); setConfirmBulkDelete(false); },
        });
    };

    const filtrar = (e) => {
        e.preventDefault();
        router.get(route('admin.turnos'), filtroForm.data, { preserveState: true });
    };

    const previewImport = async (e) => {
        e.preventDefault();
        if (!archivoImport) return;
        setImportLoading(true);
        setImportError(null);
        try {
            const fd = new FormData();
            fd.append('archivo', archivoImport);
            fd.append('_token', document.querySelector('meta[name="csrf-token"]')?.content || '');
            const res = await axios.post(route('admin.turnos.import-preview'), fd);
            setImportRows(res.data);
        } catch (err) {
            setImportError('Error al procesar el archivo. Verifica el formato.');
        } finally {
            setImportLoading(false);
        }
    };

    const getWeekDays = (lunes) => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(lunes + 'T12:00:00');
        d.setDate(d.getDate() + i);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    });

    const [areaSemana, setAreaSemana] = useState('');
    const lunesActual = semanaVista ?? todayStr;
    const diasSemana  = getWeekDays(lunesActual);
    const DIAS_LABEL  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const cambiarSemana = (dir) => {
        const d = new Date(lunesActual + 'T12:00:00');
        d.setDate(d.getDate() + dir * 7);
        router.get(route('admin.turnos'), { semana_vista: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }, { preserveState: true, preserveScroll: true });
    };

    const turnosSemana = turnosVista;

    const colaboradoresSemana = Object.values(
        turnosSemana.reduce((acc, t) => {
            if (!acc[t.nombre_colaborador]) {
                acc[t.nombre_colaborador] = { nombre: t.nombre_colaborador, area: t.area || '—', dias: {} };
            }
            const dia = t.fecha;
            if (!acc[t.nombre_colaborador].dias[dia]) acc[t.nombre_colaborador].dias[dia] = [];
            acc[t.nombre_colaborador].dias[dia].push(t);
            return acc;
        }, {})
    )
    .filter(c => !areaSemana || c.area === areaSemana)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

    const confirmarImport = (modo) => {
        router.post(route('admin.turnos.import'), { filas: importRows, modo }, {
            onSuccess: () => setImportRows(null),
        });
    };

    const conflictos = importRows ? importRows.filter(r => r.existe).length : 0;

    const kpis = [
        { label: 'Total turnos',   value: filasTurnos.length,                                                color: '#0284c7' },
        { label: 'Asisten',        value: filasTurnos.filter(t => t.estado === 'asiste').length,              color: '#16a34a' },
        { label: 'Ausencias',      value: filasTurnos.filter(t => t.estado === 'ausente').length,             color: '#dc2626' },
        { label: 'Permisos',       value: filasTurnos.filter(t => t.estado === 'permiso').length,             color: '#f59e0b' },
        { label: 'Vacaciones',     value: filasTurnos.filter(t => t.estado === 'vacaciones').length,          color: '#0ea5e9' },
        { label: 'Incapacidades',   value: filasTurnos.filter(t => t.estado === 'incapacidad').length,         color: '#8b5cf6' },
        { label: 'Compensatorios', value: filasTurnos.filter(t => t.estado === 'compensatorio').length,        color: '#0d9488' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Turnos · Admin" />

            <div className="space-y-4">

                {/* Tabs */}
                <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-lg w-fit">
                    {[
                        { key: 'lista',  label: 'Lista de turnos' },
                        { key: 'semana', label: 'Vista semanal' },
                        { key: 'nuevo',  label: 'Registrar / Importar' },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTabActiva(t.key)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                tabActiva === t.key ? 'bg-white text-[#0284c7] shadow-sm' : 'text-[#64748b] hover:text-[#1e293b]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Lista */}
                {tabActiva === 'lista' && (
                    <div className="space-y-3">
                        {/* Filtros */}
                        <form onSubmit={filtrar} className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-3 flex flex-wrap gap-3 items-end">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Desde</label>
                                <input type="date" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7]"
                                    value={filtroForm.data.fecha_inicio} onChange={e => filtroForm.setData('fecha_inicio', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Hasta</label>
                                <input type="date" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7]"
                                    value={filtroForm.data.fecha_fin} onChange={e => filtroForm.setData('fecha_fin', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Estado</label>
                                <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7]"
                                    value={filtroForm.data.estado} onChange={e => filtroForm.setData('estado', e.target.value)}>
                                    <option value="">Todos</option>
                                    {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                                <select className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7]"
                                    value={filtroForm.data.area} onChange={e => filtroForm.setData('area', e.target.value)}>
                                    <option value="">Todas</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Buscar colaborador</label>
                                <input type="text" className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7]"
                                    placeholder="Nombre o documento..." value={filtroForm.data.buscar} onChange={e => filtroForm.setData('buscar', e.target.value)} />
                            </div>
                            <button type="submit" className="px-4 py-1.5 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors">
                                Filtrar
                            </button>
                            <button type="button" onClick={() => router.get(route('admin.turnos'))} className="px-4 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
                                Limpiar
                            </button>
                        </form>

                        {/* Tabla */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Turnos registrados</h3>
                                    {seleccionados.length > 0 && (
                                        <button
                                            onClick={() => setConfirmBulkDelete(true)}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                                            </svg>
                                            Eliminar {seleccionados.length} seleccionados
                                        </button>
                                    )}
                                </div>
                                <span className="text-[9px] text-[#94a3b8] font-bold">{filasTurnos.length} registros</span>
                            </div>
                            {filasTurnos.length === 0 ? (
                                <div className="py-16 text-center text-[#94a3b8] text-sm italic">No hay turnos para mostrar.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                                <th className="py-2 px-4 w-8">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer"
                                                        checked={seleccionados.length === filasTurnos.length && filasTurnos.length > 0}
                                                        onChange={toggleTodos}
                                                    />
                                                </th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                            <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Área</th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Fecha</th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Horario</th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Estado</th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">Observación</th>
                                                <th className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f8fafc]">
                                            {filasTurnos.map(t => (
                                                <tr key={t.id} className={`transition-colors ${seleccionados.includes(t.id) ? 'bg-[#eff6ff]' : 'hover:bg-[#f8fafc]'}`}>
                                                    <td className="py-2.5 px-4">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-[#e2e8f0] text-[#0284c7] cursor-pointer"
                                                            checked={seleccionados.includes(t.id)}
                                                            onChange={() => toggleSeleccion(t.id)}
                                                        />
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <div className="text-xs font-semibold text-[#1e293b]">{t.nombre_colaborador}</div>
                                                        {t.documento_colaborador && (
                                                            <div className="text-[10px] text-[#94a3b8] font-mono">{t.documento_colaborador}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <span className="text-[10px] text-[#64748b]">{t.area || '—'}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <span className="text-xs text-[#334155]">{fmtFecha(t.fecha)}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <span className="text-xs font-mono text-[#475569]">{fmtHora(t.hora_inicio)} – {fmtHora(t.hora_fin)}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <EstadoBadge estado={t.estado} />
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <span className="text-[10px] text-[#94a3b8] line-clamp-1">{t.observacion || '—'}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => abrirEdicion(t)} className="text-[10px] font-bold text-[#0284c7] hover:underline">Editar</button>
                                                            <button onClick={() => setConfirmDelete(t.id)} className="text-[10px] font-bold text-red-500 hover:underline">Eliminar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Paginador */}
                            {lastPage > 1 && (
                                <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center justify-between">
                                    <span className="text-[10px] text-[#94a3b8]">
                                        Mostrando {turnosFrom}–{turnosTo} de {turnosTotal} registros
                                    </span>
                                    <div className="flex gap-1">
                                        {turnosLinks.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true, onSuccess: () => setSeleccionados([]) })}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                                    link.active
                                                        ? 'bg-[#0284c7] text-white'
                                                        : link.url
                                                            ? 'text-[#64748b] hover:bg-[#f1f5f9]'
                                                            : 'text-[#cbd5e1] cursor-default'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Vista semanal */}
                {tabActiva === 'semana' && (
                    <div className="space-y-3">

                        {/* Navegación semana */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-3 flex items-center gap-4">
                            <button
                                onClick={() => cambiarSemana(-1)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors shrink-0"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                Anterior
                            </button>
                            <div className="flex-1 text-center">
                                <div className="text-sm font-bold text-[#0f172a]">
                                    {fmtFecha(diasSemana[0])} — {fmtFecha(diasSemana[6])}
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mt-0.5">
                                    {colaboradoresSemana.length} colaboradores · {turnosSemana.length} turnos
                                </div>
                            </div>
                            <select
                                value={areaSemana}
                                onChange={e => setAreaSemana(e.target.value)}
                                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] shrink-0"
                            >
                                <option value="">Todas las áreas</option>
                                {areas.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <button
                                onClick={() => cambiarSemana(1)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors shrink-0"
                            >
                                Siguiente
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>

                        {/* Tabla semanal */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                            {colaboradoresSemana.length === 0 ? (
                                <div className="py-16 text-center text-[#94a3b8] text-sm italic">No hay turnos registrados para esta semana.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                                <th className="py-2.5 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest sticky left-0 bg-[#f8fafc] min-w-[180px]">Colaborador</th>
                                                {diasSemana.map((dia, i) => {
                                                    const esHoy = dia === todayStr;
                                                    return (
                                                        <th key={dia} className={`py-2.5 px-3 text-center min-w-[110px] ${esHoy ? 'bg-[#e0f2fe]' : ''}`}>
                                                            <div className={`text-[8px] font-black uppercase tracking-widest ${esHoy ? 'text-[#0284c7]' : 'text-[#94a3b8]'}`}>{DIAS_LABEL[i]}</div>
                                                            <div className={`text-[10px] font-bold mt-0.5 ${esHoy ? 'text-[#0284c7]' : 'text-[#64748b]'}`}>{fmtFecha(dia)}</div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f8fafc]">
                                            {colaboradoresSemana.map(c => (
                                                <tr key={c.nombre} className="hover:bg-[#f8fafc] transition-colors">
                                                    <td className="py-2.5 px-4 sticky left-0 bg-white border-r border-[#f1f5f9] min-w-[200px]">
                                                        <div className="text-xs font-semibold text-[#1e293b] whitespace-nowrap">{c.nombre}</div>
                                                        <div className="text-[9px] text-[#94a3b8] mt-0.5">{c.area}</div>
                                                    </td>
                                                    {diasSemana.map((dia, i) => {
                                                        const turnoDia = c.dias[dia] || [];
                                                        const esHoy = dia === todayStr;
                                                        return (
                                                            <td key={dia} className={`py-2 px-3 text-center align-top ${esHoy ? 'bg-[#f0f9ff]' : ''}`}>
                                                                {turnoDia.length === 0 ? (
                                                                    <span className="text-[#e2e8f0] text-lg">—</span>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {turnoDia.map(t => {
                                                                            const cfg = ESTADOS[t.estado] || ESTADOS.asiste;
                                                                            return (
                                                                                <div key={t.id} className="rounded-lg px-2 py-1.5 text-center" style={{ background: cfg.bg }}>
                                                                                    <div className="text-[9px] font-black" style={{ color: cfg.color }}>{cfg.label}</div>
                                                                                    {t.estado === 'asiste' && (
                                                                                        <div className="text-[9px] font-mono text-[#475569] mt-0.5">{fmtHora(t.hora_inicio)}–{fmtHora(t.hora_fin)}</div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Registrar + Importar */}
                {tabActiva === 'nuevo' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                        {/* Formulario manual */}
                        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" /> Registrar turno manual
                            </h3>
                            <FormTurno form={form} colaboradores={colaboradores} onSubmit={submit} processing={form.processing} errors={form.errors} submitLabel="Registrar turno" />
                        </div>

                        {/* Importar Excel */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" /> Importar desde Excel
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setModalPlantilla(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-colors"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        Descargar plantilla
                                    </button>
                                </div>
                                <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-3 mb-4 text-[10px] text-[#64748b] space-y-1">
                                    <p className="font-bold text-[#334155]">Formato esperado de columnas:</p>
                                    <p>A: Nombre &nbsp;·&nbsp; B: Documento &nbsp;·&nbsp; C: Fecha (YYYY-MM-DD)</p>
                                    <p>D: Hora inicio &nbsp;·&nbsp; E: Hora fin &nbsp;·&nbsp; F: Estado &nbsp;·&nbsp; G: Observación</p>
                                </div>
                                <form onSubmit={previewImport} className="flex gap-3 items-end">
                                    <div className="flex flex-col gap-1 flex-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Archivo Excel *</label>
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs bg-[#f8fafc] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#e0f2fe] file:text-[#0369a1]"
                                            onChange={e => setArchivoImport(e.target.files[0] || null)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={importLoading} className="px-4 py-2 bg-[#0284c7] text-white rounded-lg font-bold text-xs hover:bg-[#0369a1] transition-colors disabled:opacity-50 whitespace-nowrap">
                                        {importLoading ? 'Leyendo...' : 'Vista previa'}
                                    </button>
                                </form>
                                {importError && <p className="text-red-500 text-xs mt-2">{importError}</p>}
                            </div>

                            {importRows && (
                                <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                                    <div className="px-5 py-3 border-b border-[#f1f5f9] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#64748b]">Vista previa — {importRows.length} registros</h3>
                                                {conflictos > 0 && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                        {conflictos} con turno existente
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => setImportRows(null)} className="px-3 py-1.5 text-xs font-bold text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors">Cancelar</button>
                                        </div>
                                        {conflictos > 0 ? (
                                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                <span className="text-[10px] text-amber-700 font-medium flex-1">
                                                    {conflictos} registro(s) ya tienen turno programado para esa fecha.
                                                </span>
                                                <button onClick={() => confirmarImport('omitir')} className="px-3 py-1.5 text-[10px] font-bold text-[#64748b] border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f1f5f9] transition-colors whitespace-nowrap">
                                                    Omitir existentes
                                                </button>
                                                <button onClick={() => confirmarImport('sobreescribir')} className="px-3 py-1.5 text-[10px] font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
                                                    Sobreescribir todos
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end">
                                                <button onClick={() => confirmarImport('omitir')} className="px-4 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                    Confirmar importación
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                                                    {['Colaborador', 'Documento', 'Fecha', 'Inicio', 'Fin', 'Estado', 'Observación'].map(h => (
                                                        <th key={h} className="py-2 px-4 text-[8px] font-black text-[#94a3b8] uppercase tracking-widest">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f8fafc]">
                                                {importRows.map((r, i) => (
                                                    <tr key={i} className={r.existe ? 'bg-amber-50' : 'hover:bg-[#f8fafc]'}>
                                                        <td className="py-2 px-4 text-xs text-[#1e293b]">
                                                            <div className="flex items-center gap-1.5">
                                                                {r.existe && <span title="Ya existe un turno" className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                                                                {r.nombre_colaborador}
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-4 text-[10px] text-[#94a3b8] font-mono">{r.documento_colaborador || '—'}</td>
                                                        <td className="py-2 px-4 text-xs text-[#334155]">{r.fecha}</td>
                                                        <td className="py-2 px-4 text-xs font-mono text-[#475569]">{r.hora_inicio}</td>
                                                        <td className="py-2 px-4 text-xs font-mono text-[#475569]">{r.hora_fin}</td>
                                                        <td className="py-2 px-4"><EstadoBadge estado={r.estado} /></td>
                                                        <td className="py-2 px-4 text-[10px] text-[#94a3b8]">{r.observacion || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Modal plantilla */}
            {modalPlantilla && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm">
                        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
                            <h3 className="font-bold text-[#0f172a] text-sm">Generar plantilla</h3>
                            <button onClick={() => setModalPlantilla(false)} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Semana (selecciona cualquier día)</label>
                                <input
                                    type="date"
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    value={plantillaForm.semana}
                                    onChange={e => setPlantillaForm(p => ({ ...p, semana: e.target.value }))}
                                />
                                <p className="text-[9px] text-[#94a3b8] mt-0.5">El archivo incluirá los 7 días de esa semana (Lun–Dom).</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">Área</label>
                                <select
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs outline-none bg-[#f8fafc] focus:border-[#0284c7] transition-colors"
                                    value={plantillaForm.area}
                                    onChange={e => setPlantillaForm(p => ({ ...p, area: e.target.value }))}
                                >
                                    <option value="">Todas las áreas</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-3 text-[10px] text-[#64748b] space-y-1">
                                <p className="font-bold text-[#334155]">El archivo incluirá:</p>
                                <p>· Una fila por colaborador por cada día de la semana</p>
                                <p>· Nombre, documento y fecha pre-llenados</p>
                                <p>· Organizados por nombre y luego por fecha</p>
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button onClick={() => setModalPlantilla(false)} className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors">
                                    Cancelar
                                </button>
                                <a
                                    href={route('admin.turnos.plantilla', plantillaForm)}
                                    onClick={() => setModalPlantilla(false)}
                                    className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold text-xs hover:bg-green-700 transition-colors flex items-center gap-1.5"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Descargar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal eliminar seleccionados */}
            {confirmBulkDelete && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-[#0f172a] text-sm">¿Eliminar {seleccionados.length} turnos?</h3>
                        <p className="text-xs text-[#64748b]">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmBulkDelete(false)} className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors">Cancelar</button>
                            <button onClick={eliminarSeleccionados} className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal editar */}
            {editando && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="font-bold text-[#0f172a] text-sm">Editar turno</h3>
                            <button onClick={() => setEditando(null)} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <FormTurno form={editForm} colaboradores={colaboradores} onSubmit={guardarEdicion} processing={editForm.processing} errors={editForm.errors} submitLabel="Guardar cambios" />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-[#0f172a] text-sm">¿Eliminar turno?</h3>
                        <p className="text-xs text-[#64748b]">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors">Cancelar</button>
                            <button onClick={() => router.delete(route('admin.turnos.destroy', confirmDelete), { onSuccess: () => setConfirmDelete(null) })} className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
