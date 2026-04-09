import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Dashboard({ auth }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
            .catch(err => {
                console.error("Error cargando stats:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();
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
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Panel de Control <span className="text-[#00a2e1]">SST</span></h2>
                        <p className="text-sm text-gray-500">Monitoreo de Pausas Activas • LFH</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href={route('admin.colaboradores')} className="premium-button-secondary py-2 flex items-center gap-2">
                            👥 Personal
                        </Link>
                        <Link href={route('admin.ejercicios')} className="premium-button-secondary py-2 flex items-center gap-2">
                            🧘‍♂️ Rutinas
                        </Link>
                        <a
                            href={`/admin/exportar-reporte?${getQueryString()}`}
                            className="premium-button-primary py-2 flex items-center gap-2"
                        >
                            📊 Exportar (.xlsx)
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard SST" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="premium-card p-6 flex items-center gap-6 border-l-8 border-[#00a2e1]">
                        <div className="stat-icon bg-blue-50 text-[#00a2e1]">⚡</div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Minutos Totales</p>
                            <h4 className="text-3xl font-black text-gray-800">{stats.total_minutos || 0}</h4>
                        </div>
                    </div>

                    <div className="premium-card p-6 flex items-center gap-6 border-l-8 border-[#9e1a53]">
                        <div className="stat-icon bg-pink-50 text-[#9e1a53]">🔥</div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Realizados</p>
                            <h4 className="text-3xl font-black text-gray-800">{stats.hoy}</h4>
                        </div>
                    </div>

                    <div className="premium-card p-6 flex items-center gap-6 border-l-8 border-green-500">
                        <div className="stat-icon bg-green-50 text-green-500">🧘</div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ejercicios Activos</p>
                            <h4 className="text-3xl font-black text-gray-800">{stats.ejercicios}</h4>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="premium-card p-6 bg-white/50 backdrop-blur">
                    <div className="flex flex-col xl:flex-row items-end gap-4">
                        <div className="flex-grow w-full">
                            <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-tighter">Búsqueda rápida</label>
                            <input
                                type="text"
                                placeholder="Colaborador o documento..."
                                className="premium-input"
                                value={filters.nombre}
                                onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                            />
                        </div>
                        <div className="w-full xl:w-64">
                            <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-tighter">Por Área</label>
                            <select
                                className="premium-input"
                                value={filters.area}
                                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                            >
                                <option value="">Todas las Áreas</option>
                                {stats.areas && stats.areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full xl:w-48">
                            <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-tighter">Desde</label>
                            <input
                                type="date"
                                className="premium-input"
                                value={filters.fecha_inicio}
                                onChange={(e) => setFilters({ ...filters, fecha_inicio: e.target.value })}
                            />
                        </div>
                        <div className="w-full xl:w-48">
                            <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-tighter">Hasta</label>
                            <input
                                type="date"
                                className="premium-input"
                                value={filters.fecha_fin}
                                onChange={(e) => setFilters({ ...filters, fecha_fin: e.target.value })}
                            />
                        </div>
                        {(filters.nombre || filters.area || filters.fecha_inicio || filters.fecha_fin) && (
                            <button
                                onClick={() => setFilters({ nombre: '', area: '', fecha_inicio: '', fecha_fin: '' })}
                                className="text-xs font-bold text-[#9e1a53] hover:underline mb-3 whitespace-nowrap"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Analysis & Table Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lateral Stats Analysis */}
                    <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
                        <div className="premium-card p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00a2e1]"></span> Top Rutinas
                            </h3>
                            <div className="space-y-5">
                                {Object.entries(stats.top_ejercicios || {}).map(([name, count], i) => (
                                    <div key={name} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-gray-700 uppercase">{name}</span>
                                            <span className="text-[10px] font-black text-[#00a2e1]">{count}x</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#00a2e1] to-[#0084b9] rounded-full transition-all duration-700"
                                                style={{ width: `${(count / Object.values(stats.top_ejercicios)[0]) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-card p-6 overflow-hidden">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Actividad Diaria
                            </h3>
                            <div className="space-y-3">
                                {stats.actividad_diaria && stats.actividad_diaria.slice(0, 5).map(day => (
                                    <div key={day.date} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-800">{day.date}</span>
                                            <span className="text-[10px] text-gray-400">{day.count} pausas</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-lg italic">
                                            {day.total_min} <span className="text-[10px] text-gray-400 not-italic">min</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Table */}
                    <div className="lg:col-span-2">
                        <div className="premium-card overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Registro Detallado</h3>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Últimos 50 ingresos</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 italic">
                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">Colaborador</th>
                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase text-center">Área / ID</th>
                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase text-center">Duración</th>
                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase text-right">Fecha/Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {stats.ultimos.map(reg => (
                                            <tr key={reg.id} className="hover:bg-[#00a2e1]/[0.02] transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-gray-800 group-hover:text-[#00a2e1] transition-colors">{reg.nombre_empleado}</div>
                                                    <div className="text-[10px] text-gray-400 truncate max-w-[200px]">{reg.ejercicios_realizados}</div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-block px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase mb-1">{reg.area || 'General'}</span>
                                                    <div className="text-[9px] font-mono text-gray-400">{reg.documento_empleado || 'N/A'}</div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="text-sm font-black text-[#00a2e1] italic">{reg.duracion_minutos} min</span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="text-[11px] font-bold text-gray-700">{new Date(reg.created_at).toLocaleDateString()}</div>
                                                    <div className="text-[9px] text-gray-400 italic">{new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout >
    );
}
