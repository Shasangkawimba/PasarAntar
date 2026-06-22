import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

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
            { href: route('markets.index'), icon: 'storefront', label: 'Pilih Pasar', active: !!isBuyerMarket },
            { href: route('orders.index'), icon: 'receipt_long', label: 'Pesanan Saya', active: !!isBuyerOrder },
        ];
        if (user.role === 'joki') return [
            { href: route('joki.orders.index'), icon: 'shopping_basket', label: 'Tersedia', active: !!isJokiAvailable },
            { href: route('joki.orders.assigned'), icon: 'local_shipping', label: 'Tugas Saya', active: !!isJokiAssigned },
            { href: route('joki.checklists.index'), icon: 'checklist', label: 'Checklist', active: !!isJokiChecklist },
        ];
        if (user.role === 'admin') return [
            { href: route('admin.orders.index'), icon: 'list_alt', label: 'Semua Pesanan', active: !!isAdminOrder },
            { href: route('admin.checklists.index'), icon: 'checklist', label: 'Checklist', active: !!isAdminChecklist },
            { href: route('admin.complaints.index'), icon: 'warning', label: 'Pengaduan', active: !!isAdminComplaint },
        ];
        return [];
    })();

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--pa-background)', color: 'var(--pa-on-surface)' }}>
            {/* Top Header Bar */}
            <header className="pa-topbar">
                <div className="flex items-center gap-6 lg:gap-8 flex-1">
                    {/* Logo (Desktop & Mobile) */}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                        <span className="hidden sm:block" style={{ color: 'var(--pa-primary)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>
                            Pasar Antar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`pa-topbar-nav-item ${item.active ? 'active' : ''}`}
                            >
                                <span className={`material-symbols-outlined ${item.active ? 'icon-fill' : ''}`} style={{ fontSize: 20 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors relative"
                        style={{ color: 'var(--pa-text-muted)' }}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
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
                                            fontWeight: 700,
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
            </header>

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

            {/* Mobile Bottom Navigation */}
            <nav className="pa-bottom-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`pa-bottom-nav-item ${item.active ? 'active' : ''}`}
                    >
                        <div className="icon-wrapper">
                            <span className={`material-symbols-outlined ${item.active ? 'icon-fill' : ''}`}>{item.icon}</span>
                        </div>
                        <span className="pa-nav-label">{item.label}</span>
                    </Link>
                ))}
                <Link
                    href={route('profile.edit')}
                    className={`pa-bottom-nav-item ${isProfile ? 'active' : ''}`}
                >
                    <div className="icon-wrapper">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <span className="pa-nav-label">Profil</span>
                </Link>
            </nav>
        </div>
    );
}
