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

interface OrdersListProps {
    orders: Order[];
}

export default function OrdersList({ orders }: OrdersListProps) {
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Semua Pesanan (Admin)
                </h2>
            }
        >
            <Head title="Semua Pesanan" />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-header">
                        <div>
                            <h1 className="pa-title">Monitoring Pesanan</h1>
                            <p className="pa-subtitle">Pantau seluruh aktivitas transaksi belanja pasar tradisional dalam sistem</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="pa-state-card">
                            <div className="pa-state-icon">📋</div>
                            <h3 className="pa-state-title">Belum Ada Transaksi</h3>
                            <p>Saat ini belum ada pesanan belanja yang masuk ke sistem.</p>
                        </div>
                    ) : (
                        <div className="pa-form-section" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Mobile View: Cards */}
                            <div className="pa-order-card-list md:hidden pa-p-4">
                                {orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('admin.orders.show', order.id)}
                                        className="pa-order-card"
                                        style={{ margin: 0 }}
                                    >
                                        <div className="pa-order-card-header">
                                            <div>
                                                <div className="pa-order-num">{order.order_number}</div>
                                                <div className="pa-order-market pa-mt-1">{order.market.name}</div>
                                                <div className="pa-subtitle pa-mt-1" style={{ fontSize: '0.75rem' }}>
                                                    Pembeli: {order.buyer.name}
                                                </div>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="pa-order-card-footer" style={{ marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--pa-text-muted)' }}>
                                                {formatDate(order.created_at)}
                                            </span>
                                            <span className="pa-font-bold" style={{ color: 'var(--pa-primary-dark)' }}>
                                                {formatRupiah(order.estimated_amount)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop View: Table */}
                            <div className="hidden md:block" style={{ width: '100%', overflowX: 'auto' }}>
                                <table className="pa-table" style={{ border: 'none' }}>
                                    <thead>
                                        <tr>
                                            <th>No. Pesanan</th>
                                            <th>Pembeli</th>
                                            <th>Pasar</th>
                                            <th>Status</th>
                                            <th>Estimasi</th>
                                            <th>Tanggal</th>
                                            <th className="pa-text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="pa-font-bold">{order.order_number}</td>
                                                <td>
                                                    <div className="pa-font-bold" style={{ fontSize: '0.875rem' }}>{order.buyer.name}</div>
                                                    <div className="pa-subtitle" style={{ fontSize: '0.75rem' }}>{order.buyer.email}</div>
                                                </td>
                                                <td>{order.market.name}</td>
                                                <td>
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="pa-font-bold">{formatRupiah(order.estimated_amount)}</td>
                                                <td className="pa-subtitle">{formatDate(order.created_at)}</td>
                                                <td className="pa-text-right">
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="pa-btn pa-btn-secondary pa-btn-sm"
                                                        style={{ minHeight: '32px' }}
                                                    >
                                                        Lihat Detail
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
            </div>
        </AuthenticatedLayout>
    );
}
