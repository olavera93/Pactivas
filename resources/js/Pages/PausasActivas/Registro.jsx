import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Registro({ colaboradores = [] }) {
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEx, setSelectedEx] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, reset } = useForm({
        nombre_empleado: '',
        documento_empleado: '',
        ejercicios_realizados: [],
        duracion_minutos: 0
    });

    useEffect(() => {
        fetch('/ejercicios')
            .then(res => res.json())
            .then(data => setEjercicios(data));
    }, []);

    const toggleEx = (titulo) => {
        if (selectedEx.includes(titulo)) {
            setSelectedEx(selectedEx.filter(e => e !== titulo));
        } else {
            setSelectedEx([...selectedEx, titulo]);
        }
    };

    const isReady = data.nombre_empleado.length >= 3 && selectedEx.length > 0;

    const filteredColabs = colaboradores.filter(c =>
        (c.nombres + ' ' + c.apellidos).toLowerCase().includes(data.nombre_empleado.toLowerCase())
    ).slice(0, 5);

    const enviarReporte = () => {
        if (!isReady) return;

        post('/api/registro', {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(true);
                setSelectedEx([]);
                reset();
            }
        });
    };

    useEffect(() => {
        const totalMin = selectedEx.reduce((acc, titulo) => {
            const ex = ejercicios.find(e => e.titulo === titulo);
            return acc + (ex ? ex.duracion : 0);
        }, 0);

        setData(prev => ({
            ...prev,
            ejercicios_realizados: selectedEx,
            duracion_minutos: totalMin
        }));
    }, [selectedEx, ejercicios]);

    return (
        <div className="min-h-screen bg-[#f5fafd] p-4 font-['Outfit'] text-[#1e293b]">
            <Head title="Pausas Activas · Gestión LFH" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
                
                .ex-card.active { border-color: #00a2e1; background: #f0f9ff; }
                .ex-img { mix-blend-mode: multiply; transform: scale(1.25); transition: transform 0.3s ease; }
                .ex-card:hover .ex-img { transform: scale(1.35); }
                .check-square.active { background: #00a2e1; border-color: #00a2e1; color: white; }
            `}</style>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 h-full">
                {/* Columna Izquierda: Ejercicios */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {ejercicios.map((ex, i) => (
                        <div
                            key={ex.id}
                            className={`ex-card bg-white rounded-xl p-3 cursor-pointer transition-all border-2 border-transparent shadow-sm hover:translate-y-[-3px] hover:shadow-md ${selectedEx.includes(ex.titulo) ? 'active' : ''}`}
                            onClick={() => toggleEx(ex.titulo)}
                        >
                            <div className="bg-[#e6f6fe] rounded-lg h-[150px] w-full flex items-center justify-center mb-3 relative overflow-hidden">
                                <span className="absolute top-2 left-2 text-[20px] font-bold text-[#00a2e1]">{i + 1}</span>
                                <img src={ex.imagen} className="ex-img w-full h-full object-contain" alt={ex.titulo} />
                            </div>

                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[18px] font-bold text-[#1a202c]">{ex.titulo}</span>
                                <span className="text-[14px] font-bold text-[#0084b9]">⏱️ {ex.duracion} min</span>
                            </div>

                            <div className="text-[14.5px] leading-relaxed mt-2">
                                <span className="font-bold block text-[12px] uppercase text-[#2d3748] tracking-wider mb-1">Beneficio</span>
                                <span className="text-[#64748b] block mb-2">{ex.beneficio}</span>

                                <span className="font-bold block text-[12px] uppercase text-[#2d3748] tracking-wider mb-1">Instrucciones</span>
                                <span className="text-[#64748b] block">{ex.instrucciones}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Columna Derecha: Panel de Registro */}
                <aside className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-[#edf2f7] sticky top-4 h-fit">
                    <div className="text-[#00a2e1] text-[10px] font-bold uppercase tracking-widest">GESTIÓN LFH</div>
                    <h2 className="text-[18px] font-bold">Registro Directo</h2>

                    <div className="flex flex-col gap-1 relative">
                        <label className="text-[11px] font-bold uppercase">Colaborador</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-[#cbd5e1] rounded-xl text-[14px] outline-none bg-[#f8fafc] focus:border-[#00a2e1] transition-colors"
                            placeholder="Escriba su nombre..."
                            value={data.nombre_empleado}
                            onChange={(e) => {
                                setData('nombre_empleado', e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => setShowResults(true)}
                        />
                        {showResults && data.nombre_empleado.length > 2 && filteredColabs.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-xl shadow-lg z-[50] overflow-hidden">
                                {filteredColabs.map(c => (
                                    <div
                                        key={c.id}
                                        className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                                        onClick={() => {
                                            setData(prev => ({
                                                ...prev,
                                                nombre_empleado: c.nombres + ' ' + c.apellidos,
                                                documento_empleado: c.documento
                                            }));
                                            setShowResults(false);
                                        }}
                                    >
                                        <div className="font-bold">{c.nombres} {c.apellidos}</div>
                                        <div className="text-[10px] text-gray-400 uppercase">{c.area}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow flex flex-col gap-2 mt-4">
                        <label className="text-[11px] font-bold uppercase mb-2">Rutinas Marcadas</label>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
                            {ejercicios.map(ex => (
                                <div
                                    key={`chk-${ex.id}`}
                                    className={`flex items-center gap-2 text-[12px] transition-colors ${selectedEx.includes(ex.titulo) ? 'text-[#1e293b] font-semibold' : 'text-[#64748b]'}`}
                                >
                                    <div className={`w-4 h-4 border-2 border-[#cbd5e1] rounded flex items-center justify-center text-[10px] transition-all ${selectedEx.includes(ex.titulo) ? 'bg-[#00a2e1] border-[#00a2e1] text-white' : ''}`}>
                                        {selectedEx.includes(ex.titulo) ? '✓' : ''}
                                    </div>
                                    {ex.titulo}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className={`w-full p-4 rounded-xl font-bold text-[14px] uppercase transition-all mt-4 ${isReady ? 'bg-[#00a2e1] text-white shadow-lg shadow-[#00a2e1]/30 cursor-pointer opacity-100' : 'bg-[#cbd5e1] text-white cursor-not-allowed opacity-50'}`}
                        disabled={!isReady}
                        onClick={enviarReporte}
                    >
                        Registrar Pausa
                    </button>
                </aside>
            </div>

            {/* Modal de Éxito */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[20px] text-center max-w-sm w-full shadow-2xl">
                        <div className="text-[40px] mb-4 text-[#00a2e1]">✅</div>
                        <h2 className="text-[22px] font-bold text-[#0084b9] mb-2">¡Registro Exitoso!</h2>
                        <p className="text-[#64748b] text-[14px]">Tu pausa activa ha sido guardada correctamente.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 bg-[#9e1a53] text-white py-3 px-8 rounded-lg font-bold hover:scale-105 transition-transform cursor-pointer"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {/* Botón Admin Flotante */}
            <a
                href="/admin/dashboard"
                className="fixed bottom-8 right-8 w-[55px] h-[55px] bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#00a2e1] hover:scale-110 hover:rotate-6 hover:bg-[#00a2e1] group transition-all z-[1000]"
                title="Acceso Administrador"
            >
                <svg className="w-6 h-6 fill-[#00a2e1] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </a>
        </div>
    );
}
