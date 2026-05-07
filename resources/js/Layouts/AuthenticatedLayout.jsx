import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const icons = {
    dashboard: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
    ),
    colaboradores: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    rutinas: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
    ),
    areas: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    ),
    indicadores: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
    ),
    horasExtras: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
        </svg>
    ),
    documentos: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
    ),
    turnos: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    anuncios: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    usuarios: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    ),
    perfil: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    salir: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    ),
    menu: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    ),
    close: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    chevronLeft: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
        </svg>
    ),
};

function NavItem({ href, active, icon, collapsed, children }) {
    return (
        <Link
            href={href}
            title={collapsed ? children : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                collapsed ? 'justify-center' : ''
            } ${
                active
                    ? 'bg-[#e8f4fd] text-[#0284c7] font-semibold'
                    : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium'
            }`}
        >
            <span className={`shrink-0 ${active ? 'text-[#0284c7]' : 'text-[#94a3b8]'}`}>{icon}</span>
            {!collapsed && <span className="flex-1 truncate">{children}</span>}
            {!collapsed && active && <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0" />}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(t);
        }
    }, [flash.success]);

    const toggleCollapsed = () => {
        setCollapsed(prev => {
            localStorage.setItem('sidebar-collapsed', String(!prev));
            return !prev;
        });
    };

    const navItems = [
        { href: route('dashboard'), active: route().current('dashboard'), label: 'Pausas activas', icon: icons.dashboard },
        { href: route('admin.colaboradores'), active: route().current('admin.colaboradores') || route().current('admin.departamentos'), label: 'Colaboradores', icon: icons.colaboradores },
        { href: route('admin.ejercicios'), active: route().current('admin.ejercicios'), label: 'Rutinas', icon: icons.rutinas },
        { href: route('admin.indicadores'), active: route().current('admin.indicadores'), label: 'Indicadores', icon: icons.indicadores },
        { href: route('admin.horas-extras'), active: route().current('admin.horas-extras'), label: 'Horas Extras', icon: icons.horasExtras },
        { href: route('admin.documentos'), active: route().current('admin.documentos'), label: 'Documentos', icon: icons.documentos },
        { href: route('admin.turnos'), active: route().current('admin.turnos'), label: 'Turnos', icon: icons.turnos },
        { href: route('admin.anuncios'), active: route().current('admin.anuncios'), label: 'Anuncios', icon: icons.anuncios },
        ...(user.role === 'admin' ? [{ href: route('admin.usuarios'), active: route().current('admin.usuarios'), label: 'Usuarios', icon: icons.usuarios }] : []),
    ];

    const Sidebar = ({ mobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo + toggle */}
            <div className={`flex items-center border-b border-[#f1f5f9] h-14 shrink-0 ${collapsed && !mobile ? 'justify-center px-3' : 'px-4 gap-3'}`}>
                <Link href={route('dashboard')} className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                        P
                    </div>
                    {(!collapsed || mobile) && (
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-[#0f172a] leading-tight">Gestión LFH</div>
                            <div className="text-[10px] text-[#94a3b8] font-medium tracking-wide uppercase">Gestión LFH</div>
                        </div>
                    )}
                </Link>
                {!mobile && (
                    <button
                        onClick={toggleCollapsed}
                        className={`ml-auto p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors shrink-0 ${collapsed ? 'rotate-180' : ''}`}
                        title={collapsed ? 'Expandir' : 'Colapsar'}
                    >
                        {icons.chevronLeft}
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
                {(!collapsed || mobile) && (
                    <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest px-3 mb-2">
                        Administración
                    </p>
                )}
                {navItems.map((item) => (
                    <NavItem key={item.label} href={item.href} active={item.active} icon={item.icon} collapsed={collapsed && !mobile}>
                        {item.label}
                    </NavItem>
                ))}
            </nav>

            {/* User */}
            <div className={`py-3 border-t border-[#f1f5f9] ${collapsed && !mobile ? 'px-2' : 'px-2'}`}>
                {(!collapsed || mobile) && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-[#e8f4fd] flex items-center justify-center text-[#0284c7] shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#0f172a] truncate">{user.name}</div>
                            <div className="text-[10px] text-[#94a3b8] truncate">{user.email}</div>
                        </div>
                    </div>
                )}
                <NavItem href={route('profile.edit')} active={route().current('profile.edit')} icon={icons.perfil} collapsed={collapsed && !mobile}>
                    Mi perfil
                </NavItem>
                <button
                    onClick={() => router.post(route('logout'))}
                    title={collapsed && !mobile ? 'Salir' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:bg-red-50 hover:text-red-500 transition-colors duration-150 ${collapsed && !mobile ? 'justify-center' : ''}`}
                >
                    <span className="shrink-0 text-[#94a3b8]">{icons.salir}</span>
                    {(!collapsed || mobile) && 'Salir'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">

            {/* Flash */}
            {showFlash && flash.success && (
                <div className="fixed top-5 right-5 z-[200] bg-white border border-green-200 text-gray-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm">
                    <span className="text-green-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </span>
                    <span className="font-medium">{flash.success}</span>
                </div>
            )}

            {/* Sidebar Desktop */}
            <aside
                className={`hidden lg:flex flex-col bg-white border-r border-[#f1f5f9] h-screen sticky top-0 shrink-0 transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
            >
                <Sidebar />
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#f1f5f9] z-[150] px-4 h-14 flex items-center justify-between">
                <Link href={route('dashboard')} className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#0284c7] rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
                    <span className="text-sm font-bold text-[#0f172a]">Gestión LFH</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg">
                    {isMobileMenuOpen ? icons.close : icons.menu}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[140] bg-white pt-14 overflow-y-auto">
                    <Sidebar mobile />
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
                {header && (
                    <header className="bg-white border-b border-[#f1f5f9] pt-14 lg:pt-0 px-6 py-5">
                        {header}
                    </header>
                )}
                <main className={`flex-1 p-4 ${!header ? 'pt-20 lg:pt-4' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
