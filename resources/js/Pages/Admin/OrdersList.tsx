import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Market {
    id: number;
    name: string;
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

export default function OrdersList({ orders }: { orders: Order[] }) {
    const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
    const waitingJoki = orders.filter(o => o.status === 'WAITING_FOR_JOKI').length;
    const totalEstVolume = orders.reduce((sum, o) => sum + o.estimated_amount, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Monitoring Pesanan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Monitoring Operasional</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>Pantau seluruh transaksi dan kinerja Pasar Antar</p>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="pa-bento-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid var(--pa-primary)' }}>
                    <span className="pa-label-caps block mb-2" style={{ color: 'var(--pa-text-muted)' }}>Total Transaksi</span>
                    <div>
                        <span className="pa-headline-lg block" style={{ fontSize: 32, color: 'var(--pa-text-main)' }}>{totalOrders}</span>
                        <span className="pa-body-sm mt-1 block" style={{ color: 'var(--pa-text-muted)' }}>Order terdaftar di sistem</span>
                    </div>
                </div>

                <div className="pa-bento-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid var(--pa-status-shopping)' }}>
                    <span className="pa-label-caps block mb-2" style={{ color: 'var(--pa-status-shopping)' }}>Proses Belanja/Antar</span>
                    <div>
                        <span className="pa-headline-lg block" style={{ fontSize: 32, color: 'var(--pa-text-main)' }}>{activeOrders}</span>
                        <span className="pa-body-sm mt-1 block" style={{ color: 'var(--pa-text-muted)' }}>Pesanan sedang aktif</span>
                    </div>
                </div>

                <div className="pa-bento-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid var(--pa-alert-amber)' }}>
                    <span className="pa-label-caps block mb-2" style={{ color: 'var(--pa-alert-amber)' }}>Menunggu Joki</span>
                    <div>
                        <span className="pa-headline-lg block" style={{ fontSize: 32, color: 'var(--pa-text-main)' }}>{waitingJoki}</span>
                        <span className="pa-body-sm mt-1 block" style={{ color: 'var(--pa-text-muted)' }}>Belum dialokasikan</span>
                    </div>
                </div>

                <div className="pa-bento-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid var(--pa-status-completed)' }}>
                    <span className="pa-label-caps block mb-2" style={{ color: 'var(--pa-status-completed)' }}>Nilai Transaksi (Estimasi)</span>
                    <div>
                        <span className="pa-headline-lg pa-mono block" style={{ fontSize: 24, color: 'var(--pa-text-main)' }}>{formatRupiah(totalEstVolume)}</span>
                        <span className="pa-body-sm mt-1 block" style={{ color: 'var(--pa-text-muted)' }}>Total deposit aktif</span>
                    </div>
                </div>
            </div>

            <div className="pa-bento-card p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="pa-headline-md flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>monitoring</span>
                            Daftar Transaksi
                        </h2>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="pa-state-card border-0 rounded-none">
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>analytics</span>
                        <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Transaksi</h3>
                        <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Saat ini belum ada pesanan belanja yang masuk ke sistem.</p>
                    </div>
                ) : (
                    <div>
                        {/* Mobile Card View */}
                        <div className="block md:hidden border-t border-gray-100">
                            {orders.map((order) => (
                                <div key={order.id} className="p-5 border-b border-gray-100 bg-white hover:bg-slate-50 transition-colors">
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
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pembeli</div>
                                            <div className="font-bold text-slate-800">{order.buyer.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estimasi Deposit</div>
                                            <div className="pa-mono font-bold text-emerald-600">{formatRupiah(order.estimated_amount)}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pasar Tujuan</div>
                                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                                <span className="material-symbols-outlined text-[16px] text-emerald-500">storefront</span>
                                                {order.market.name}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Link href={route('admin.orders.show', order.id)} className="pa-btn pa-btn-secondary pa-btn-full flex justify-center items-center gap-2">
                                        Lihat Detail Transaksi
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block pa-table-container border-0 shadow-none rounded-none">
                            <table className="pa-table">
                                <thead>
                                    <tr>
                                        <th>No. Pesanan</th>
                                        <th>Pembeli (Buyer)</th>
                                        <th>Pasar Tradisional</th>
                                        <th>Estimasi Deposit</th>
                                        <th>Status</th>
                                        <th>Tanggal Buat</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="pa-mono" style={{ fontWeight: 700 }}>{order.order_number}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{order.buyer.name}</div>
                                                <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{order.buyer.email}</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-status-completed)' }}>storefront</span>
                                                    <span style={{ fontWeight: 600 }}>{order.market.name}</span>
                                                </div>
                                            </td>
                                            <td className="pa-mono" style={{ fontWeight: 600, color: 'var(--pa-primary)' }}>{formatRupiah(order.estimated_amount)}</td>
                                            <td><StatusBadge status={order.status} /></td>
                                            <td className="pa-mono pa-body-sm text-gray-500">{formatDate(order.created_at)}</td>
                                            <td className="text-right">
                                                <Link href={route('admin.orders.show', order.id)} className="pa-btn pa-btn-secondary pa-btn-sm inline-flex">
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
        </AuthenticatedLayout>
    );
}
