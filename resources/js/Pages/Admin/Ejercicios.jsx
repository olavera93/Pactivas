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
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Catálogo de <span className="text-[#00a2e1]">Ejercicios</span></h2>
                        <p className="text-sm text-gray-500">Contenido educativo para pausas activas diarias</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1">Total Rutinas</div>
                            <div className="text-lg font-black text-[#00a2e1] leading-none">{ejercicios.length}</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] shadow-sm flex items-center justify-center text-lg">🧘</div>
                    </div>
                </div>
            }
        >
            <Head title="Ejercicios" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">

                {/* Panel lateral - Formulario */}
                <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start space-y-6 z-10">
                    <div className="premium-card p-6 border-l-4 border-[#00a2e1]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00a2e1] flex items-center justify-center text-xl shadow-inner">
                                {editingEx ? '⚙️' : '✨'}
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 leading-tight">{editingEx ? 'Configurar Rutina' : 'Nueva Rutina'}</h3>
                                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest mt-0.5">Diseña el contenido</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Título del Ejercicio</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Estiramiento de Cuello"
                                    value={data.titulo}
                                    onChange={e => setData('titulo', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Instrucciones</label>
                                <textarea
                                    className="premium-input !bg-gray-50/50 h-32 resize-none"
                                    placeholder="Detalla los pasos para el usuario..."
                                    value={data.instrucciones}
                                    onChange={e => setData('instrucciones', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Beneficio Principal</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Reduce tensión cervical"
                                    value={data.beneficio}
                                    onChange={e => setData('beneficio', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Duración (min)</label>
                                    <input
                                        type="number"
                                        className="premium-input !bg-gray-50/50 text-center"
                                        min="1"
                                        value={data.duracion}
                                        onChange={e => setData('duracion', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Estado</label>
                                    <select
                                        className="premium-input !bg-gray-50/50"
                                        value={data.activo}
                                        onChange={e => setData('activo', e.target.value)}
                                    >
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Imagen Ilustrativa</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#00a2e1] transition-all cursor-pointer relative group">
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setData('imagen_file', e.target.files[0])} />
                                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-500">🖼️</div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate px-2">
                                        {data.imagen_file ? data.imagen_file.name : 'Subir o arrastrar imagen'}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="premium-button-primary !bg-[#00a2e1] hover:!bg-[#0084b9] shadow-[#00a2e1]/20 w-full !py-3 !text-sm"
                                    disabled={processing}
                                >
                                    {editingEx ? 'Guardar Cambios' : 'Registrar Rutina'}
                                </button>
                                {editingEx && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingEx(null); reset(); }}
                                        className="premium-button-secondary w-full"
                                    >
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* Listado de Ejercicios */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ejercicios.length > 0 ? ejercicios.map(ej => (
                            <div key={ej.id} className="premium-card group overflow-hidden">
                                <div className="relative h-44 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {ej.imagen ? (
                                        <img src={`/` + ej.imagen} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-3" alt={ej.titulo} />
                                    ) : (
                                        <div className="text-4xl grayscale opacity-20 select-none">🧘</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-xl shadow-sm border border-white">
                                        <span className="text-[9px] font-black text-[#00a2e1] uppercase tracking-widest">{ej.duracion} min</span>
                                    </div>
                                    {!ej.activo && (
                                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-xl">Inactiva</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className="text-base font-black text-gray-900 tracking-tight group-hover:text-[#00a2e1] transition-colors">{ej.titulo}</h4>
                                    </div>
                                    <div className="inline-block px-2 py-0.5 bg-blue-50 rounded-lg text-[8px] font-black text-[#00a2e1] uppercase tracking-widest mb-3">
                                        {ej.beneficio}
                                    </div>
                                    <p className="text-[12px] text-[#64748b] leading-relaxed line-clamp-2 mb-5 min-h-[36px] italic">"{ej.instrucciones}"</p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 whitespace-nowrap">
                                        <button
                                            onClick={() => edit(ej)}
                                            className="text-[9px] font-black text-[#00a2e1] hover:underline uppercase tracking-widest transition-all flex items-center gap-1.5"
                                        >
                                            <span className="text-sm">🛠️</span> Editar
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('¿Seguro?')) destroy(route('admin.ejercicios.destroy', ej.id)) }}
                                            className="text-[9px] font-black text-gray-400 hover:text-red-500 hover:underline uppercase tracking-widest transition-all flex items-center gap-1.5"
                                        >
                                            <span className="text-sm">🗑️</span> Borrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full premium-card p-20 text-center flex flex-col items-center gap-4 bg-gray-50/50 border-dashed border-2">
                                <div className="text-6xl">🧘‍♀️</div>
                                <div className="text-gray-400 font-bold italic">No se han registrado rutinas aún.</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

