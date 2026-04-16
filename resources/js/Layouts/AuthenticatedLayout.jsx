import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

function SidebarLink({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${
                active 
                    ? 'bg-[#00a2e1] text-white shadow-md shadow-[#00a2e1]/10' 
                    : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1a202c]'
            }`}
        >
            <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-[#00a2e1]/70'}`}>
                {icon}
            </span>
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { flash } = usePage().props;

    const navItems = [
        { href: route('dashboard'), active: route().current('dashboard'), label: 'Pausas', icon: '📊' },
        { href: route('admin.colaboradores'), active: route().current('admin.colaboradores'), label: 'Colaboradores', icon: '👥' },
        { href: route('admin.ejercicios'), active: route().current('admin.ejercicios'), label: 'Rutinas', icon: '⚡' },
        { href: route('admin.departamentos'), active: route().current('admin.departamentos'), label: 'Áreas', icon: '🏢' },
        { href: route('admin.indicadores'), active: route().current('admin.indicadores'), label: 'Indicadores', icon: '📈' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit'] flex overflow-hidden">
            {/* Flash Messages */}
            <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 max-w-sm">
                {flash.success && (
                    <div className="bg-white border-l-4 border-green-500 text-gray-800 px-5 py-3 rounded-xl shadow-xl animate-fade-in-up flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-lg shrink-0">✅</div>
                        <div className="font-bold text-xs">{flash.success}</div>
                    </div>
                )}
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#f1f5f9] h-screen sticky top-0 shrink-0 z-[100]">
                <div className="p-6">
                    {/* Espaciador superior */}
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-6">
                    {navItems.map((item) => (
                        <SidebarLink key={item.label} {...item}>
                            {item.label}
                        </SidebarLink>
                    ))}
                </nav>

                <div className="p-3 mt-auto">
                    <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="w-full flex items-center gap-2.5 text-left group">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-base shadow-sm group-hover:scale-105 transition-transform">
                                        👤
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-black text-gray-900 truncate">{user.name}</div>
                                        <div className="text-[9px] font-bold text-[#94a3b8] truncate">{user.email}</div>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="top" contentClasses="py-1 bg-white rounded-xl shadow-xl border border-gray-100 mb-2">
                                <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                    <span>👤</span> Mi Perfil
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 !text-red-500 hover:!bg-red-50 transition-colors">
                                    <span>🚪</span> Salir del Sistema
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-[#f1f5f9] z-[150] px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#00a2e1] rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
                    <span className="text-[11px] font-black text-gray-900 tracking-tighter">PACTIVAS ADMIN</span>
                </Link>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1.5 text-[#00a2e1] bg-[#e6f6fd] rounded-lg"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[140] bg-white pt-16 px-4 animate-in slide-in-from-top duration-300">
                    <nav className="space-y-1 mt-4">
                        {navItems.map((item) => (
                            <SidebarLink key={item.label} {...item}>
                                {item.label}
                            </SidebarLink>
                        ))}
                        <div className="pt-6 border-t border-[#f1f5f9] mt-6">
                             <SidebarLink href={route('profile.edit')} label="Perfil" icon="👤">Mi Perfil</SidebarLink>
                             <button 
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 transition-all active:scale-95"
                                onClick={() => router.post(route('logout'))}
                             >
                                <span className="text-lg">🚪</span> Salir del Sistema
                             </button>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
                {header && (
                    <header className="bg-white/40 backdrop-blur-md pt-16 lg:pt-6 pb-6 px-4 sm:px-6">
                        <div className="max-w-7xl mx-auto">
                            {header}
                        </div>
                    </header>
                )}

                <main className={`flex-1 p-4 sm:p-6 animate-fade-in-up ${!header ? 'pt-20 lg:pt-6' : ''}`}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Aesthetic Background Accents */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00a2e1]/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] bg-[#00a2e1]/3 rounded-full blur-[100px]" />
                </div>
            </div>
        </div>
    );
}
