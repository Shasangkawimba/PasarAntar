import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const isBuyerMarket = route().current('markets.index') || route().current('orders.create');
    const isBuyerOrder = route().current('orders.index') || route().current('orders.show');
    const isJokiAvailable = route().current('joki.orders.index');
    const isJokiAssigned = route().current('joki.orders.assigned') || route().current('joki.orders.show');
    const isJokiChecklist = route().current('joki.checklists.index') || route().current('joki.checklists.show');
    const isAdminOrder = route().current('admin.orders.index') || route().current('admin.orders.show');
    const isAdminChecklist = route().current('admin.checklists.index') || route().current('admin.checklists.show');
    const isAdminComplaint = route().current('admin.complaints.index') || route().current('admin.complaints.status');
    const isProfile = route().current('profile.edit');

    const navItems = (() => {
        if (user.role === 'buyer') return [
            { href: route('markets.index'), icon: 'storefront', label: 'Pilih Pasar', active: !!isBuyerMarket, showOnMobile: true },
            { href: route('orders.index'), icon: 'receipt_long', label: 'Pesanan Saya', active: !!isBuyerOrder, showOnMobile: true },
        ];
        if (user.role === 'joki') return [
            { href: route('joki.orders.index'), icon: 'shopping_basket', label: 'Tersedia', active: !!isJokiAvailable, showOnMobile: true },
            { href: route('joki.orders.assigned'), icon: 'local_shipping', label: 'Tugas Saya', active: !!isJokiAssigned, showOnMobile: true },
            { href: route('joki.checklists.index'), icon: 'checklist', label: 'Checklist', active: !!isJokiChecklist, showOnMobile: true },
        ];
        if (user.role === 'admin') return [
            { href: route('admin.markets.index'), icon: 'storefront', label: 'Kelola Pasar', active: !!route().current('admin.markets.*'), showOnMobile: false },
            { href: route('admin.users.index'), icon: 'group', label: 'Kelola Pengguna', active: !!route().current('admin.users.*'), showOnMobile: false },
            { href: route('admin.orders.index'), icon: 'list_alt', label: 'Semua Pesanan', active: !!isAdminOrder, showOnMobile: true },
            { href: route('admin.checklists.index'), icon: 'checklist', label: 'Checklist', active: !!isAdminChecklist, showOnMobile: true },
            { href: route('admin.complaints.index'), icon: 'warning', label: 'Pengaduan', active: !!isAdminComplaint, showOnMobile: true },
        ];
        return [];
    })();

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--pa-background)', color: 'var(--pa-on-surface)' }}>
            {/* Top Header Bar (Two-Tier Design) */}
            <header className="fixed top-0 left-0 w-full z-50 flex flex-col bg-white" style={{ boxShadow: 'var(--pa-shadow-nav)' }}>
                {/* Top Tier: Logo & Profile */}
                <div className="flex items-center justify-between h-16 px-4 md:px-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                            className="md:hidden inline-flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--pa-text-main)' }}>
                                {showingMobileMenu ? 'close' : 'menu'}
                            </span>
                        </button>

                        {/* Logo (Desktop & Mobile) */}
                        <Link href="/" className="flex items-center gap-3 ml-1 sm:ml-0">
                            <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                            <span className="whitespace-nowrap" style={{ color: 'var(--pa-primary)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em' }}>
                                Pasar Antar
                            </span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 relative z-50">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-2 sm:px-3 py-2 transition-all hover:bg-gray-50 focus:outline-none"
                                        style={{
                                            borderRadius: 'var(--pa-radius-input)',
                                            border: '1px solid var(--pa-outline-variant)',
                                            background: 'var(--pa-surface-container-lowest)',
                                            color: 'var(--pa-text-main)',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--pa-primary)' }}>account_circle</span>
                                        <span style={{ fontWeight: 600 }} className="hidden sm:inline">{user.name}</span>
                                        <span
                                            className="hidden sm:inline"
                                            style={{
                                                fontSize: 10,
                                                padding: '2px 6px',
                                                backgroundColor: 'var(--pa-surface-container)',
                                                borderRadius: 4,
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: 'var(--pa-text-muted)',
                                            }}
                                        >
                                            {user.role}
                                        </span>
                                        <svg className="h-4 w-4 hidden sm:block" style={{ color: 'var(--pa-text-muted)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="sm:hidden px-4 py-3 border-b mb-1 text-xs text-gray-500" style={{ borderColor: 'var(--pa-surface-variant)' }}>
                                        Masuk sebagai <br/><strong style={{ color: 'var(--pa-text-main)' }}>{user.name}</strong>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Bottom Tier: Desktop Navigation */}
                <div className="hidden md:flex w-full px-4 md:px-10 border-t items-center" style={{ borderColor: 'var(--pa-surface-variant)', backgroundColor: 'var(--pa-surface-container-low)', height: '64px' }}>
                    <nav className="flex items-center gap-3 overflow-x-auto pa-scroll-hidden whitespace-nowrap w-full">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                    item.active 
                                    ? 'z-10' 
                                    : 'hover:bg-slate-200/60'
                                }`}
                                style={
                                    item.active 
                                    ? { 
                                        backgroundColor: 'var(--pa-surface-bright)', 
                                        color: 'var(--pa-text-main)',
                                        border: '2px solid var(--pa-outline)',
                                        boxShadow: '3px 3px 0px 0px var(--pa-outline)',
                                        transform: 'translateY(-2px)'
                                      }
                                    : { color: 'var(--pa-text-muted)', border: '2px solid transparent' }
                                }
                            >
                                <span 
                                    className={`material-symbols-outlined ${item.active ? 'icon-fill' : ''}`} 
                                    style={{ 
                                        fontSize: 22, 
                                        color: item.active ? 'var(--pa-primary)' : 'inherit',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {item.icon}
                                </span>
                                <span style={{ letterSpacing: '0.02em' }}>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {showingMobileMenu && (
                <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
                    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setShowingMobileMenu(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[16px] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                                    item.active 
                                    ? 'z-10' 
                                    : 'hover:bg-slate-50'
                                }`}
                                style={
                                    item.active 
                                    ? { 
                                        backgroundColor: 'var(--pa-surface-bright)',
                                        color: 'var(--pa-text-main)',
                                        border: '2px solid var(--pa-outline)',
                                        boxShadow: '4px 4px 0px 0px var(--pa-outline)',
                                        transform: 'translateY(-2px)'
                                      }
                                    : { color: 'var(--pa-text-muted)', border: '2px solid transparent' }
                                }
                            >
                                <span className={`material-symbols-outlined ${item.active ? 'icon-fill' : ''}`} style={{ fontSize: 24, color: item.active ? 'var(--pa-primary)' : 'inherit' }}>{item.icon}</span>
                                <span style={{ letterSpacing: '0.02em' }}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Page Header (if provided) */}
            {header && (
                <div className="pa-main" style={{ paddingBottom: 0, minHeight: 'auto' }}>
                    <div className="pa-main-inner">{header}</div>
                </div>
            )}

            {/* Main Content */}
            <main className="pa-main" style={header ? { paddingTop: 0 } : undefined}>
                <div className="pa-main-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}
