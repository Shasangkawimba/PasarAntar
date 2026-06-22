import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

interface Market {
    id: number;
    name: string;
}

interface Order {
    id: number;
    order_number: string;
    market_id: number;
    status: string;
    estimated_amount: number;
    created_at: string;
    market: Market;
}

interface MyOrdersProps {
    orders: Order[];
}

const statusStageText: Record<string, string> = {
    WAITING_FOR_JOKI: 'Menunggu Joki menerima pesanan Anda.',
    ASSIGNED: 'Joki ditugaskan & bersiap menuju pasar.',
    SHOPPING: 'Joki sedang memilih bahan segar terbaik.',
    DELIVERING: 'Joki sedang mengantarkan belanjaan Anda.',
};

export default function MyOrders({ orders }: MyOrdersProps) {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const activeOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
    const historyOrders = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CANCELLED');

    React.useEffect(() => {
        if (activeOrders.length === 0 && historyOrders.length > 0) setActiveTab('history');
    }, [orders]);

    return (
        <AuthenticatedLayout>
            <Head title="Pesanan Saya" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Pesanan Saya</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        {activeOrders.length > 0
                            ? `${activeOrders.length} pesanan sedang diproses`
                            : 'Semua pesanan telah selesai'}
                    </p>
                </div>
                <Link href={route('markets.index')} className="pa-btn pa-btn-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_shopping_cart</span>
                    Belanja Baru
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                <div className="pa-bento-card md:col-span-8 p-6 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>receipt_long</span>
                            <span className="pa-label-caps">Daftar Transaksi</span>
                        </div>
                        <h2 className="pa-headline-md" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>
                            Pengiriman &amp; Status Belanja Anda
                        </h2>
                    </div>
                    {activeOrders.length > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2 h-2 rounded-full pa-pulse-dot" style={{ backgroundColor: 'var(--pa-status-completed)' }} />
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>
                                {activeOrders.length} Pesanan Aktif
                            </span>
                        </div>
                    )}
                </div>

                <div className="pa-bento-card md:col-span-4 p-6 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, rgba(14,165,233,0.08) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <span className="pa-label-caps" style={{ color: 'var(--pa-info-sky)' }}>Ringkasan</span>
                    <h3 className="pa-headline-md mt-2">Total Belanjaan</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Aktif Diproses</span>
                            <span className="pa-button-text" style={{ color: 'var(--pa-primary)' }}>{activeOrders.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Riwayat Selesai</span>
                            <span className="pa-button-text">{historyOrders.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="pa-state-card">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>shopping_cart</span>
                    <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Pesanan</h3>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', marginBottom: 16 }}>Anda belum memiliki transaksi belanja.</p>
                    <Link href={route('markets.index')} className="pa-btn pa-btn-primary">Mulai Belanja Sekarang</Link>
                </div>
            ) : (
                <div>
                    {/* Tabs */}
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
                                {tab === 'active' ? `Pesanan Aktif (${activeOrders.length})` : `Riwayat (${historyOrders.length})`}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'active' && (
                        <div>
                            {activeOrders.length === 0 ? (
                                <div className="pa-state-card">
                                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--pa-outline)', marginBottom: 12 }}>check_circle</span>
                                    <h4 className="pa-headline-md" style={{ fontSize: 18, marginBottom: 4 }}>Tidak ada pesanan aktif</h4>
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Semua belanjaan telah selesai.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {activeOrders.map((order) => (
                                        <Link key={order.id} href={route('orders.show', order.id)} className="pa-bento-card p-6 block">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: order.status === 'SHOPPING' ? 'rgba(249,115,22,0.1)' : 'rgba(70,72,212,0.1)',
                                                            color: order.status === 'SHOPPING' ? 'var(--pa-status-shopping)' : 'var(--pa-primary)',
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined icon-fill">
                                                            {order.status === 'SHOPPING' ? 'shopping_cart' : order.status === 'DELIVERING' ? 'local_shipping' : 'receipt_long'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>{order.order_number}</span>
                                                        <h3 className="pa-headline-md" style={{ fontSize: 18 }}>{order.market.name}</h3>
                                                    </div>
                                                </div>
                                                <StatusBadge status={order.status} />
                                            </div>

                                            {/* Stage indicator */}
                                            <div className="rounded-xl p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--pa-primary)', marginTop: 2 }}>info</span>
                                                <div>
                                                    <div className="pa-label-caps" style={{ color: 'var(--pa-text-muted)', fontSize: 10 }}>Tahapan Berjalan</div>
                                                    <div className="pa-body-sm mt-0.5" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>
                                                        {statusStageText[order.status] || 'Memproses pesanan Anda.'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                                <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', fontSize: 12 }}>{formatDate(order.created_at)}</span>
                                                <div className="text-right">
                                                    <span className="pa-label-caps block" style={{ color: 'var(--pa-text-muted)', fontSize: 10 }}>Estimasi</span>
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
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Riwayat transaksi Anda akan muncul di sini.</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Mobile Card View */}
                                    <div className="block md:hidden border-t border-gray-100 mt-2">
                                        {historyOrders.map((order) => (
                                            <div key={order.id} className="p-5 border-b border-gray-100 bg-white">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="pa-mono font-bold text-slate-900 text-lg mb-1">{order.order_number}</div>
                                                        <div className="text-xs font-semibold text-slate-500">{formatDate(order.created_at)}</div>
                                                    </div>
                                                    <div className="mt-1">
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-5 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                                    <div>
                                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pasar</div>
                                                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                                            <span className="material-symbols-outlined text-[14px] text-emerald-500">storefront</span>
                                                            {order.market.name}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estimasi Deposit</div>
                                                        <div className="pa-mono font-bold text-slate-700">{formatRupiah(order.estimated_amount)}</div>
                                                    </div>
                                                </div>
                                                
                                                <Link href={route('orders.show', order.id)} className="pa-btn pa-btn-secondary pa-btn-full flex justify-center items-center gap-2">
                                                    Lihat Detail
                                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden md:block pa-table-container">
                                        <table className="pa-table">
                                            <thead>
                                                <tr>
                                                    <th>No. Pesanan</th>
                                                    <th>Pasar</th>
                                                    <th>Tanggal</th>
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
                                                        <td className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{formatDate(order.created_at)}</td>
                                                        <td className="pa-mono" style={{ fontWeight: 600 }}>{formatRupiah(order.estimated_amount)}</td>
                                                        <td><StatusBadge status={order.status} /></td>
                                                        <td className="text-right">
                                                            <Link href={route('orders.show', order.id)} className="pa-btn pa-btn-secondary pa-btn-sm inline-flex">
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
