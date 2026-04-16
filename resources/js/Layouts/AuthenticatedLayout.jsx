import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit']">
            {/* Flash Messages */}
            <div className="fixed top-24 right-4 z-[110] flex flex-col gap-2 max-w-md">
                {flash.success && (
                    <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-200 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <div className="font-bold text-sm">{flash.success}</div>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-200 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3">
                        <span className="text-xl">❌</span>
                        <div className="font-bold text-sm">{flash.error}</div>
                    </div>
                )}
            </div>
            <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 bg-[#00a2e1] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#00a2e1]/20 group-hover:rotate-6 transition-transform">
                                    P
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 tracking-tighter leading-none">PAUSAS</div>
                                    <div className="text-[10px] font-bold text-[#00a2e1] uppercase tracking-[0.2em] leading-none mt-1">Activas</div>
                                </div>
                            </Link>

                            <div className="hidden space-x-1 sm:flex items-center">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('admin.colaboradores')} active={route().current('admin.colaboradores')}>
                                    Colaboradores
                                </NavLink>
                                <NavLink href={route('admin.ejercicios')} active={route().current('admin.ejercicios')}>
                                    Rutinas
                                </NavLink>
                                <NavLink href={route('admin.departamentos')} active={route().current('admin.departamentos')}>
                                    Departamentos
                                </NavLink>
                                <NavLink href={route('admin.indicadores')} active={route().current('admin.indicadores')}>
                                    Indicadores
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-gray-50 px-4 py-2 text-sm font-bold leading-4 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg className="-me-0.5 h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-b border-gray-100'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.colaboradores')} active={route().current('admin.colaboradores')}>Colaboradores</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.ejercicios')} active={route().current('admin.ejercicios')}>Rutinas</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.departamentos')} active={route().current('admin.departamentos')}>Departamentos</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.indicadores')} active={route().current('admin.indicadores')}>Indicadores</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-100 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-bold text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Cerrar Sesión</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <div className="bg-white/50 backdrop-blur-sm border-b border-gray-50">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            <main className="relative z-10">{children}</main>

            {/* Aesthetic Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00a2e1]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100/30 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
