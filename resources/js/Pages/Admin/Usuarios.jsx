import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const ROLE_CONFIG = {
    admin: { label: 'Administrador', color: '#00a2e1', bg: '#e6f6fd', icon: '🛡️' },
    user:  { label: 'Usuario',        color: '#64748b', bg: '#f1f5f9', icon: '👤' },
};

export default function Usuarios({ auth, usuarios }) {
    const { flash } = usePage().props;
    const currentUserId = auth.user.id;

    const [isEditing, setIsEditing]       = useState(false);
    const [showPwdModal, setShowPwdModal] = useState(null);
    const [search, setSearch]             = useState('');

    const form = useForm({ name: '', email: '', password: '', password_confirmation: '', role: 'user' });
    const pwdForm = useForm({ password: '', password_confirmation: '' });

    const filtered = usuarios.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            form.put(route('admin.usuarios.update', form.data.id), {
                onSuccess: () => { setIsEditing(false); form.reset(); },
            });
        } else {
            form.post(route('admin.usuarios.store'), {
                onSuccess: () => form.reset(),
            });
        }
    };

    const edit = (u) => {
        form.setData({ id: u.id, name: u.name, email: u.email, password: '', password_confirmation: '', role: u.role });
        setIsEditing(true);
    };

    const cancelEdit = () => { setIsEditing(false); form.reset(); };

    const destroy = (u) => {
        if (confirm(`¿Eliminar al usuario "${u.name}"? Esta acción no se puede deshacer.`)) {
            form.delete(route('admin.usuarios.destroy', u.id));
        }
    };

    const savePassword = (e) => {
        e.preventDefault();
        pwdForm.patch(route('admin.usuarios.password', showPwdModal.id), {
            onSuccess: () => { setShowPwdModal(null); pwdForm.reset(); },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Usuarios" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">

                {/* ── Formulario lateral ── */}
                <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start space-y-6">
                    <div className="premium-card p-6 border-l-4 border-[#00a2e1]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00a2e1] flex items-center justify-center text-xl shadow-inner">
                                {isEditing ? '📝' : '➕'}
                            </div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 tracking-tight">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest mt-0.5">
                                    {isEditing ? 'Modifica los datos del usuario' : 'Completa todos los campos'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Nombre completo</label>
                                <input
                                    type="text"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="Ej: Carlos Arevalo"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    required
                                />
                                {form.errors.name && <p className="text-red-500 text-xs">{form.errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="premium-input !bg-gray-50/50"
                                    placeholder="correo@empresa.com"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    required
                                />
                                {form.errors.email && <p className="text-red-500 text-xs">{form.errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Rol</label>
                                <select
                                    className="premium-input !bg-gray-50/50"
                                    value={form.data.role}
                                    onChange={e => form.setData('role', e.target.value)}
                                >
                                    <option value="user">👤 Usuario</option>
                                    <option value="admin">🛡️ Administrador</option>
                                </select>
                                {form.errors.role && <p className="text-red-500 text-xs">{form.errors.role}</p>}
                            </div>

                            {!isEditing && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Contraseña</label>
                                        <input
                                            type="password"
                                            className="premium-input !bg-gray-50/50"
                                            placeholder="Mínimo 8 caracteres"
                                            value={form.data.password}
                                            onChange={e => form.setData('password', e.target.value)}
                                            required
                                        />
                                        {form.errors.password && <p className="text-red-500 text-xs">{form.errors.password}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#64748b] ml-1 uppercase tracking-widest">Confirmar contraseña</label>
                                        <input
                                            type="password"
                                            className="premium-input !bg-gray-50/50"
                                            placeholder="Repite la contraseña"
                                            value={form.data.password_confirmation}
                                            onChange={e => form.setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="pt-2 flex flex-col gap-2">
                                <button type="submit" className="premium-button-primary w-full !py-3 !text-sm" disabled={form.processing}>
                                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={cancelEdit} className="premium-button-secondary w-full !py-3 !text-sm">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* ── Tabla ── */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="premium-card overflow-hidden">
                        <div className="p-6 border-b border-[#f1f5f9] bg-[#fbfdfe]">
                            <div className="relative w-full md:w-80 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o correo..."
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
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Usuario</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">Rol</th>
                                        <th className="py-3 px-6 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest text-right">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {filtered.length > 0 ? filtered.map(u => {
                                        const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                                        const isSelf = u.id === currentUserId;
                                        return (
                                            <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors group">
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-900 text-[13px] group-hover:text-[#00a2e1] transition-colors flex items-center gap-1.5">
                                                                {u.name}
                                                                {isSelf && <span className="text-[8px] font-black bg-[#e6f6fd] text-[#00a2e1] px-1.5 py-0.5 rounded-md uppercase tracking-widest">Tú</span>}
                                                            </div>
                                                            <div className="text-[10px] text-[#94a3b8] font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest" style={{ background: cfg.bg, color: cfg.color }}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-right space-x-1.5 whitespace-nowrap">
                                                    <button
                                                        onClick={() => edit(u)}
                                                        className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-[#00a3e0] shadow-sm hover:bg-[#00a3e0] hover:text-white transition-all hover:scale-105"
                                                        title="Editar"
                                                    >📝</button>
                                                    <button
                                                        onClick={() => { setShowPwdModal(u); pwdForm.reset(); }}
                                                        className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-amber-500 shadow-sm hover:bg-amber-500 hover:text-white transition-all hover:scale-105"
                                                        title="Cambiar contraseña"
                                                    >🔑</button>
                                                    {!isSelf && (
                                                        <button
                                                            onClick={() => destroy(u)}
                                                            className="w-8 h-8 rounded-lg bg-white border border-[#f1f5f9] text-red-400 shadow-sm hover:bg-red-500 hover:text-white transition-all hover:scale-105"
                                                            title="Eliminar"
                                                        >🗑️</button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="3" className="py-32 text-center text-gray-400 italic">
                                                <div className="text-5xl mb-4">🔐</div>
                                                <div className="font-bold">No se encontraron usuarios.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal cambiar contraseña ── */}
            {showPwdModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[300] p-4 animate-in fade-in duration-300">
                    <div className="premium-card max-w-md w-full shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-[#f1f5f9] bg-gradient-to-r from-[#fffbeb] to-white flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-amber-600 tracking-tight">Cambiar Contraseña</h3>
                                <p className="text-[11px] font-bold text-[#64748b] mt-0.5">{showPwdModal.name} · {showPwdModal.email}</p>
                            </div>
                            <button onClick={() => setShowPwdModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">✕</button>
                        </div>
                        <form onSubmit={savePassword} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest">Nueva contraseña</label>
                                <input
                                    type="password"
                                    className="premium-input"
                                    placeholder="Mínimo 8 caracteres"
                                    value={pwdForm.data.password}
                                    onChange={e => pwdForm.setData('password', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {pwdForm.errors.password && <p className="text-red-500 text-xs">{pwdForm.errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    className="premium-input"
                                    placeholder="Repite la contraseña"
                                    value={pwdForm.data.password_confirmation}
                                    onChange={e => pwdForm.setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowPwdModal(null)} className="flex-1 premium-button-secondary !py-2.5">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 premium-button-primary !py-2.5 !bg-amber-500 hover:!bg-amber-600" disabled={pwdForm.processing}>
                                    {pwdForm.processing ? 'Guardando...' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
