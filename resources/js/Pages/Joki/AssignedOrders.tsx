import React from 'react';
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

interface AssignedOrdersProps {
    orders: Order[];
}

export default function AssignedOrders({ orders }: AssignedOrdersProps) {
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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pesanan Saya (Joki)
                </h2>
            }
        >
            <Head title="Pesanan Saya" />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-header">
                        <div>
                            <h1 className="pa-title">Pesanan Yang Saya Tangani</h1>
                            <p className="pa-subtitle">Kelola pesanan belanja yang telah Anda ambil</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="pa-state-card">
                            <div className="pa-state-icon">📋</div>
                            <h3 className="pa-state-title">Belum Ada Pesanan</h3>
                            <p>Anda belum mengambil pesanan. Kunjungi halaman Pesanan Tersedia untuk mengambil pesanan.</p>
                        </div>
                    ) : (
                        <>
                            {/* Active Orders */}
                            {activeOrders.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h2 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem' }}>Sedang Dikerjakan</h2>
                                    <div className="pa-order-card-list">
                                        {activeOrders.map((order) => (
                                            <Link
                                                key={order.id}
                                                href={route('joki.orders.show', order.id)}
                                                className="pa-order-card"
                                            >
                                                <div className="pa-order-card-header">
                                                    <div>
                                                        <div className="pa-order-num">{order.order_number}</div>
                                                        <div className="pa-order-market">{order.market.name}</div>
                                                    </div>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--pa-text-muted)' }}>
                                                    Pembeli: {order.buyer.name} • Telp: {order.buyer.phone_number || '-'}
                                                </div>
                                                <div className="pa-order-card-footer">
                                                    <span className="pa-subtitle" style={{ fontSize: '0.75rem' }}>{formatDate(order.created_at)}</span>
                                                    <div>
                                                        <span className="pa-order-price-label">ESTIMASI</span>
                                                        <span className="pa-order-price">{formatRupiah(order.estimated_amount)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Orders */}
                            {completedOrders.length > 0 && (
                                <div>
                                    <h2 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem', color: 'var(--pa-text-muted)' }}>Selesai</h2>
                                    <div className="pa-order-card-list">
                                        {completedOrders.map((order) => (
                                            <Link
                                                key={order.id}
                                                href={route('joki.orders.show', order.id)}
                                                className="pa-order-card"
                                                style={{ opacity: 0.7 }}
                                            >
                                                <div className="pa-order-card-header">
                                                    <div>
                                                        <div className="pa-order-num">{order.order_number}</div>
                                                        <div className="pa-order-market">{order.market.name}</div>
                                                    </div>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <div className="pa-order-card-footer">
                                                    <span className="pa-subtitle" style={{ fontSize: '0.75rem' }}>{formatDate(order.created_at)}</span>
                                                    <div>
                                                        <span className="pa-order-price-label">ESTIMASI</span>
                                                        <span className="pa-order-price">{formatRupiah(order.estimated_amount)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
