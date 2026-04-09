import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Ejercicios({ auth, ejercicios }) {
    const [editingEx, setEditingEx] = useState(null);

    const { data, setData, post, processing, reset, delete: destroy } = useForm({
        id: null,
        titulo: '',
        instrucciones: '',
        beneficio: '',
        duracion: 1,
        activo: 1,
        imagen_file: null,
        _method: 'POST'
    });

    const edit = (ex) => {
        setEditingEx(ex.id);
        setData({
            id: ex.id,
            titulo: ex.titulo,
            instrucciones: ex.instrucciones,
            beneficio: ex.beneficio,
            duracion: ex.duracion,
            activo: ex.activo,
            imagen_file: null,
            _method: 'POST'
        });
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editingEx ? route('admin.ejercicios.update', editingEx) : route('admin.ejercicios.store');
        post(url, {
            onSuccess: () => { setEditingEx(null); reset(); },
            forceFormData: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Gestión de <span className="text-[#9e1a53]">Rutinas</span></h2>
                        <p className="text-sm text-gray-500">Configuración de ejercicios y tiempos</p>
                    </div>
                </div>
            }
        >
            <Head title="Ejercicios" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Panel lateral - Formulario */}
                <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-6 z-10">
                    <div className="premium-card p-6 border-l-8 border-[#9e1a53]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#9e1a53] flex items-center justify-center text-xl">
                                {editingEx ? '⚙️' : '✨'}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{editingEx ? 'Configurar Rutina' : 'Nueva Rutina'}</h3>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Título del Ejercicio</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: Estiramiento de Cuello"
                                    value={data.titulo}
                                    onChange={e => setData('titulo', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Descripción Guía / Instrucciones</label>
                                <textarea
                                    className="premium-input h-24 resize-none"
                                    placeholder="Instrucciones para el usuario..."
                                    value={data.instrucciones}
                                    onChange={e => setData('instrucciones', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Beneficio Principal</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Ej: Reduce tensión cervical"
                                    value={data.beneficio}
                                    onChange={e => setData('beneficio', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Duración (min)</label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        min="1"
                                        value={data.duracion}
                                        onChange={e => setData('duracion', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Estado</label>
                                    <select
                                        className="premium-input"
                                        value={data.activo}
                                        onChange={e => setData('activo', e.target.value)}
                                    >
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">Imagen Ilustrativa</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#9e1a53] transition-colors cursor-pointer relative">
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setData('imagen_file', e.target.files[0])} />
                                    <div className="text-2xl mb-1">🖼️</div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate">
                                        {data.imagen_file ? data.imagen_file.name : 'Subir nueva imagen'}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    className="premium-button-primary !bg-[#9e1a53] hover:!bg-[#7a1440] shadow-[#9e1a53]/20 w-full"
                                    disabled={processing}
                                >
                                    {editingEx ? 'Guardar Cambios' : 'Publicar Rutina'}
                                </button>
                                {editingEx && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingEx(null); reset(); }}
                                        className="premium-button-secondary w-full"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* Listado de Ejercicios */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ejercicios.map(ej => (
                            <div key={ej.id} className="premium-card group overflow-hidden">
                                <div className="relative h-48 overflow-hidden bg-gray-100 italic flex items-center justify-center">
                                    {ej.imagen ? (
                                        <img src={`/` + ej.imagen} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={ej.titulo} />
                                    ) : (
                                        <div className="text-gray-300 select-none">Sin Imagen</div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                                        <span className="text-[10px] font-black text-gray-700 uppercase italic">{ej.duracion} min</span>
                                    </div>
                                    {!ej.activo && (
                                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Inactivo</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black text-gray-800 uppercase tracking-tight group-hover:text-[#9e1a53] transition-colors">{ej.titulo}</h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">{ej.beneficio}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-6 h-8 italic">{ej.instrucciones}</p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 whitespace-nowrap">
                                        <button
                                            onClick={() => edit(ej)}
                                            className="text-[10px] font-bold text-gray-400 hover:text-[#9e1a53] uppercase tracking-widest transition-colors"
                                        >
                                            🛠️ Configurar
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('¿Seguro?')) destroy(route('admin.ejercicios.destroy', ej.id)) }}
                                            className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
