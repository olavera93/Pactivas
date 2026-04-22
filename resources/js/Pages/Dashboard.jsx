import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

const toISO = (dmy) => {
    if (!dmy) return '';
    const [d, m, y] = dmy.split('/');
    if (!d || !m || !y || y.length !== 4) return '';
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const PER_PAGE = 10;

function Paginador({ total, page, onPage }) {
    const pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) return null;
    return (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/30">
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

export default function Dashboard({ auth }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagePausas, setPagePausas] = useState(1);

    const [filters, setFilters] = useState({
        nombre: '',
        area: '',
        fecha_inicio: '',
        fecha_fin: ''
    });

    const getQueryString = () => new URLSearchParams(filters).toString();

    const fetchStats = () => {
        const query = getQueryString();
        fetch(`/admin/stats?${query}`)
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta del servidor");
                return res.json();
            })
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();
        setPagePausas(1);
    }, [filters]);

    if (loading) return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Cargando...</h2>}
        >
            <div className="p-8 text-center text-gray-500 font-bold">Iniciando panel de control...</div>
        </AuthenticatedLayout>
    );

    if (!stats) return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Error</h2>}
        >
            <div className="p-8 text-center text-red-500 font-bold">No se pudieron cargar las estadísticas. Revisa la conexión con la base de datos.</div>
        </AuthenticatedLayout>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Panel de <span className="text-[#00a2e1]">Bienestar</span></h2>
                        <p className="text-sm text-gray-500">Pausas Activas · Gestión LFH</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href={route('admin.colaboradores')} className="premium-button-secondary !py-2 !px-4 text-xs flex items-center gap-2">
                            👥 Personal
                        </Link>
                        <Link href={route('admin.ejercicios')} className="premium-button-secondary !py-2 !px-4 text-xs flex items-center gap-2">
                            🧘‍♂️ Rutinas
                        </Link>
                        <a
                            href={`/admin/exportar-reporte?${getQueryString()}`}
                            className="premium-button-primary !py-2 !px-4 text-xs flex items-center gap-2"
                        >
                            📊 Exportar
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Bienestar · Gestión LFH" />

            <div className="space-y-6 animate-fade-in-up">

                {/* Stats Grid Compacto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="premium-card p-4 flex items-center gap-4 border-l-4 border-[#00a2e1]">
                        <div className="stat-icon !w-10 !h-10 bg-blue-50 text-[#00a2e1] text-xl">⚡</div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Minutos Totales</p>
                            <h4 className="text-2xl font-black text-gray-900">{stats.total_minutos || 0}</h4>
                        </div>
                    </div>

                    <div className="premium-card p-4 flex items-center gap-4 border-l-4 border-[#00a2e1]">
                        <div className="stat-icon !w-10 !h-10 bg-blue-50 text-[#00a2e1] text-xl">🔥</div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Realizados Hoy</p>
                            <h4 className="text-2xl font-black text-gray-900">{stats.hoy}</h4>
                        </div>
                    </div>

                    <div className="premium-card p-4 flex items-center gap-4 border-l-4 border-green-500">
                        <div className="stat-icon !w-10 !h-10 bg-green-50 text-green-500 text-xl">🧘</div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rutinas Activas</p>
                            <h4 className="text-2xl font-black text-gray-900">{stats.ejercicios}</h4>
                        </div>
                    </div>
                </div>

                {/* Filters Row Compacto */}
                <div className="premium-card p-4 bg-white">
                    <div className="flex flex-col xl:flex-row items-end gap-3">
                        <div className="flex-grow w-full">
                            <label className="text-[8px] font-black text-[#94a3b8] mb-1 block uppercase tracking-widest px-1">Colaborador / Documento</label>
                            <input
                                type="text"
                                placeholder="Ej: Juan Perez..."
                                className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                value={filters.nombre}
                                onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                            />
                        </div>
                        <div className="w-full xl:w-56">
                            <label className="text-[8px] font-black text-[#94a3b8] mb-1 block uppercase tracking-widest px-1">Área</label>
                            <select
                                className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                value={filters.area}
                                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                            >
                                <option value="">Todas</option>
                                {stats.areas && stats.areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full xl:w-40">
                            <label className="text-[8px] font-black text-[#94a3b8] mb-1 block uppercase tracking-widest px-1">Desde</label>
                            <input
                                type="date"
                                className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                value={filters.fecha_inicio}
                                onChange={(e) => setFilters({ ...filters, fecha_inicio: e.target.value })}
                            />
                        </div>
                        <div className="w-full xl:w-40">
                            <label className="text-[8px] font-black text-[#94a3b8] mb-1 block uppercase tracking-widest px-1">Hasta</label>
                            <input
                                type="date"
                                className="premium-input !py-2 shadow-none border-[#f1f5f9]"
                                value={filters.fecha_fin}
                                onChange={(e) => setFilters({ ...filters, fecha_fin: e.target.value })}
                            />
                        </div>
                        {(filters.nombre || filters.area || filters.fecha_inicio || filters.fecha_fin) && (
                            <button
                                onClick={() => setFilters({ nombre: '', area: '', fecha_inicio: '', fecha_fin: '' })}
                                className="text-[9px] font-black text-[#00a2e1] uppercase hover:underline mb-2.5"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Analysis & Table Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lateral Analysis */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="premium-card p-5">
                            <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00a2e1]"></span> Rutinas más usadas
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(stats.top_ejercicios || {}).map(([name, count], i) => (
                                    <div key={name} className="group">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{name}</span>
                                            <span className="text-[10px] font-black text-[#00a2e1]">{count}x</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#00a2e1] opacity-70 rounded-full"
                                                style={{ width: `${(count / Math.max(...Object.values(stats.top_ejercicios), 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-card p-5 overflow-hidden">
                            <h3 className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Actividad reciente
                            </h3>
                            <div className="space-y-1">
                                {stats.actividad_diaria && stats.actividad_diaria.slice(0, 5).map(day => (
                                    <div key={day.date} className="flex justify-between items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors border border-transparent">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-gray-800">{day.date}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{day.count} pausas</span>
                                        </div>
                                        <span className="text-[11px] font-black text-[#00a2e1]">
                                            {day.total_min} <span className="text-[8px] uppercase">min</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Table Compacta */}
                    <div className="lg:col-span-2">
                        <div className="premium-card !p-0 overflow-hidden bg-white">
                            <div className="px-5 py-3.5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Registros Detallados</h3>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{stats.ultimos.length} registros</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/30 border-b border-gray-100 italic">
                                            <th className="py-3 px-5 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Colaborador</th>
                                            <th className="py-3 px-5 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Área</th>
                                            <th className="py-3 px-5 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-center">Min</th>
                                            <th className="py-3 px-5 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.ultimos.slice((pagePausas - 1) * PER_PAGE, pagePausas * PER_PAGE).map(reg => (
                                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-3 px-5">
                                                    <div className="font-black text-gray-900 text-[12px] group-hover:text-[#00a2e1] transition-colors">{reg.nombre_empleado}</div>
                                                    <div className="text-[9px] text-[#94a3b8] font-bold truncate max-w-[150px] uppercase tracking-tighter">{reg.ejercicios_realizados}</div>
                                                </td>
                                                <td className="py-3 px-5 text-center">
                                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[#64748b] text-[9px] font-black uppercase tracking-widest">{reg.area || 'Gral'}</span>
                                                </td>
                                                <td className="py-3 px-5 text-center">
                                                    <span className="text-[12px] font-black text-[#00a2e1] italic">{reg.duracion_minutos}′</span>
                                                </td>
                                                <td className="py-3 px-5 text-right">
                                                    <div className="text-[10px] font-black text-gray-800">{String(reg.created_at).slice(0,10).split('-').reverse().join('/')}</div>
                                                    <div className="text-[8px] text-[#94a3b8] font-bold">{new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Paginador total={stats.ultimos.length} page={pagePausas} onPage={setPagePausas} />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout >
    );
}
