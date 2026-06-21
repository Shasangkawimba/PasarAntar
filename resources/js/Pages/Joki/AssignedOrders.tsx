import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

interface User {
    id: number;
    name: string;
    phone_number: string | null;
}

interface Market {
    id: number;
    name: string;
    address: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    estimated_amount: number;
    created_at: string;
    buyer: User;
    market: Market;
}

export default function AssignedOrders({ orders }: { orders: Order[] }) {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
    const historyOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

    React.useEffect(() => {
        if (activeOrders.length === 0 && historyOrders.length > 0) setActiveTab('history');
    }, [orders]);

    return (
        <AuthenticatedLayout>
            <Head title="Tugas Saya" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Tugas Saya</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        {activeOrders.length > 0 ? `Ada ${activeOrders.length} tugas yang sedang Anda kerjakan` : 'Tidak ada tugas aktif'}
                    </p>
                </div>
                <Link href={route('joki.orders.index')} className="pa-btn pa-btn-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>radar</span>
                    Cari Tugas Baru
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                <div className="pa-bento-card md:col-span-8 p-6 md:p-8 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>work</span>
                            <span className="pa-label-caps">Dashboard Kerja</span>
                        </div>
                        <h2 className="pa-headline-md" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
                            Kelola dan selesaikan tugas<br />
                            belanja Anda hari ini.
                        </h2>
                    </div>
                    {activeOrders.length > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2 h-2 rounded-full pa-pulse-dot" style={{ backgroundColor: 'var(--pa-status-assigned)' }} />
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>
                                {activeOrders.length} Tugas Sedang Berjalan
                            </span>
                        </div>
                    )}
                </div>

                <div className="pa-bento-card md:col-span-4 p-6 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.08) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <span className="pa-label-caps" style={{ color: 'var(--pa-status-completed)' }}>Performa</span>
                    <h3 className="pa-headline-md mt-2">Ringkasan Tugas</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Tugas Aktif</span>
                            <span className="pa-button-text" style={{ color: 'var(--pa-primary)' }}>{activeOrders.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Selesai Dikerjakan</span>
                            <span className="pa-button-text">{historyOrders.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="pa-state-card">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>work_off</span>
                    <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Tugas</h3>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', marginBottom: 16 }}>Anda belum mengambil tugas belanja apapun.</p>
                    <Link href={route('joki.orders.index')} className="pa-btn pa-btn-primary">Cari Tugas Sekarang</Link>
                </div>
            ) : (
                <div>
                    <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--pa-surface-variant)', paddingBottom: 4 }}>
                        {(['active', 'history'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="pa-button-text px-4 py-3 transition-all"
                                style={{
                                    borderBottom: activeTab === tab ? '2px solid var(--pa-primary)' : '2px solid transparent',
                                    color: activeTab === tab ? 'var(--pa-primary)' : 'var(--pa-text-muted)',
                                    borderRadius: 0,
                                }}
                            >
                                {tab === 'active' ? `Aktif Dikerjakan (${activeOrders.length})` : `Riwayat (${historyOrders.length})`}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'active' && (
                        <div>
                            {activeOrders.length === 0 ? (
                                <div className="pa-state-card">
                                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--pa-outline)', marginBottom: 12 }}>check_circle</span>
                                    <h4 className="pa-headline-md" style={{ fontSize: 18, marginBottom: 4 }}>Semua tugas selesai</h4>
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Anda tidak memiliki tugas aktif saat ini.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {activeOrders.map((order) => (
                                        <Link key={order.id} href={route('joki.orders.show', order.id)} className="pa-bento-card p-6 block hover:border-[var(--pa-primary)] transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                                                        <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16 }}>receipt_long</span>
                                                    </div>
                                                    <span className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>{order.order_number}</span>
                                                </div>
                                                <StatusBadge status={order.status} />
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-status-completed)' }}>storefront</span>
                                                    <h3 className="pa-headline-md" style={{ fontSize: 16 }}>{order.market.name}</h3>
                                                </div>
                                            </div>

                                            <div className="rounded-xl p-3 flex items-start gap-3 mb-4" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                                <span className="material-symbols-outlined mt-0.5" style={{ color: 'var(--pa-text-muted)' }}>person</span>
                                                <div>
                                                    <div className="pa-body-sm" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>{order.buyer.name}</div>
                                                    <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{order.buyer.phone_number || '-'}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                                <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', fontSize: 12 }}>{formatDate(order.created_at)}</span>
                                                <div className="text-right">
                                                    <span className="pa-label-caps block" style={{ color: 'var(--pa-text-muted)', fontSize: 10 }}>Estimasi Total</span>
                                                    <span className="pa-button-text" style={{ color: 'var(--pa-primary)' }}>{formatRupiah(order.estimated_amount)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            {historyOrders.length === 0 ? (
                                <div className="pa-state-card">
                                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--pa-outline)', marginBottom: 12 }}>history</span>
                                    <h4 className="pa-headline-md" style={{ fontSize: 18, marginBottom: 4 }}>Belum ada riwayat</h4>
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Riwayat tugas Anda akan muncul di sini.</p>
                                </div>
                            ) : (
                                <div className="pa-table-container">
                                    <table className="pa-table">
                                        <thead>
                                            <tr>
                                                <th>No. Pesanan</th>
                                                <th>Pasar</th>
                                                <th>Pembeli</th>
                                                <th>Estimasi</th>
                                                <th>Status</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="pa-mono" style={{ fontWeight: 700 }}>{order.order_number}</td>
                                                    <td style={{ fontWeight: 600 }}>{order.market.name}</td>
                                                    <td className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{order.buyer.name}</td>
                                                    <td className="pa-mono" style={{ fontWeight: 600 }}>{formatRupiah(order.estimated_amount)}</td>
                                                    <td><StatusBadge status={order.status} /></td>
                                                    <td className="text-right">
                                                        <Link href={route('joki.orders.show', order.id)} className="pa-btn pa-btn-secondary pa-btn-sm inline-flex">
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
