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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Gestión de <span className="text-[#00a2e1]">Departamentos</span></h2>
                        <p className="text-sm text-gray-500">Administra las áreas de la empresa</p>
                    </div>
                </div>
            }
        >
            <Head title="Departamentos" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-6">
                    <div className="premium-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00a2e1] flex items-center justify-center text-xl">
                                {isEditing ? '📝' : '🏢'}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Editar Departamento' : 'Nuevo Departamento'}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Nombre del Departamento</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: Recursos Humanos"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className="premium-button-primary w-full"
                                    disabled={processing}
                                >
                                    {isEditing ? 'Actualizar Departamento' : 'Crear Departamento'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); reset(); }}
                                        className="premium-button-secondary w-full"
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
                        <div className="p-6 border-b border-gray-50">
                            <div className="relative w-full md:w-96">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar departamento..."
                                    className="premium-input !pl-12 !py-2"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 italic border-b border-gray-100">
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">Nombre</th>
                                        <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.length > 0 ? filtered.map(d => (
                                        <tr key={d.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-800">{d.nombre}</div>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => edit(d)}
                                                    className="text-[#00a2e1] font-bold text-xs hover:underline uppercase tracking-tighter"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('¿Deseas eliminar este departamento?')) destroy(route('admin.departamentos.destroy', d.id)) }}
                                                    className="text-red-500 font-bold text-xs hover:underline uppercase tracking-tighter"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="py-20 text-center text-gray-400 italic">
                                                No se encontraron departamentos.
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
