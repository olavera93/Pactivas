import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Departamentos({ auth, departamentos }) {
    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        id: null,
        nombre: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.departamentos.update', data.id), {
                onSuccess: () => { setIsEditing(false); reset(); }
            });
        } else {
            post(route('admin.departamentos.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const edit = (dept) => {
        setData({
            id: dept.id,
            nombre: dept.nombre
        });
        setIsEditing(true);
    };

    const filtered = departamentos.filter(d =>
        d.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Estructura <span className="text-[#00a2e1]">Organizacional</span></h2>
                        <p className="text-sm text-gray-500">Gestión de áreas y departamentos de la empresa</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1">Total Áreas</div>
                            <div className="text-lg font-black text-[#00a2e1] leading-none">{departamentos.length}</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] shadow-sm flex items-center justify-center text-lg">🏢</div>
                    </div>
                </div>
            }
        >
            <Head title="Departamentos" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
                <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start space-y-6">
                    <div className="premium-card p-6 border-l-4 border-[#00a2e1]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00a2e1] flex items-center justify-center text-xl shadow-inner">
                                {isEditing ? '📝' : '🏢'}
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 tracking-tight">{isEditing ? 'Editar Área' : 'Nueva Área'}</h3>
                                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest mt-0.5">Define la estructura</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Nombre del Departamento</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Recursos Humanos"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className="premium-button-primary w-full !py-3 !text-sm"
                                    disabled={processing}
                                >
                                    {isEditing ? 'Actualizar Datos' : 'Registrar Área'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); reset(); }}
                                        className="premium-button-secondary w-full !py-3 !text-sm"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                <div className="lg:col-span-8 space-y-6">
                    <div className="premium-card overflow-hidden">
                        <div className="p-8 border-b border-[#f1f5f9] bg-[#fbfdfe]">
                            <div className="relative w-full md:w-96 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar área..."
                                    className="premium-input !pl-14 !py-3 shadow-sm placeholder:italic"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left">
                                <thead>
                                     <tr className="bg-gray-50/50 border-b border-[#f1f5f9]">
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Nombre de la Unidad</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {filtered.length > 0 ? filtered.map(d => (
                                        <tr key={d.id} className="hover:bg-[#f8fafc] transition-colors group">
                                            <td className="py-3 px-6">
                                                <div className="font-black text-gray-900 text-[13px] group-hover:text-[#00a2e1] transition-colors">{d.nombre}</div>
                                            </td>
                                            <td className="py-3 px-6 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => edit(d)}
                                                    className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-[#00a3e0] shadow-sm hover:bg-[#00a3e0] hover:text-white transition-all transform hover:scale-105"
                                                    title="Editar"
                                                >
                                                    📝
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('¿Deseas eliminar esta área?')) destroy(route('admin.departamentos.destroy', d.id)) }}
                                                    className="w-10 h-10 rounded-xl bg-white border border-[#f1f5f9] text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="py-32 text-center text-gray-400 italic">
                                                <div className="text-5xl mb-4 text-center">🏢</div>
                                                <div className="font-bold">No se encontraron departamentos.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

