import React from 'react';
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

export default function MyOrders({ orders }: MyOrdersProps) {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Pesanan Saya
                    </h2>
                    <Link href={route('markets.index')} className="pa-btn pa-btn-primary pa-btn-sm" style={{ minHeight: '36px' }}>
                        + Belanja Baru
                    </Link>
                </div>
            }
        >
            <Head title="Pesanan Saya" />

            <div className="pa-body">
                <div className="pa-container" style={{ maxWidth: '800px' }}>
                    <div className="pa-header">
                        <div>
                            <h1 className="pa-title">Riwayat Pesanan</h1>
                            <p className="pa-subtitle">Pantau status belanjaan Anda ke pasar tradisional secara realtime</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="pa-state-card">
                            <div className="pa-state-icon">🛍️</div>
                            <h3 className="pa-state-title">Belum Ada Pesanan</h3>
                            <p className="pa-mb-4">Anda belum pernah membuat pesanan belanja.</p>
                            <Link href={route('markets.index')} className="pa-btn pa-btn-primary">
                                Mulai Belanja Sekarang
                            </Link>
                        </div>
                    ) : (
                        <div className="pa-order-card-list">
                            {orders.map((order) => (
                                <Link 
                                    key={order.id} 
                                    href={route('orders.show', order.id)}
                                    className="pa-order-card"
                                >
                                    <div className="pa-order-card-header">
                                        <div>
                                            <div className="pa-order-num">{order.order_number}</div>
                                            <div className="pa-order-market pa-mt-1">{order.market.name}</div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    <div className="pa-order-card-footer">
                                        <span className="pa-subtitle">{formatDate(order.created_at)}</span>
                                        <div className="pa-text-right">
                                            <div className="pa-order-price-label">ESTIMASI TOTAL</div>
                                            <div className="pa-order-price">{formatRupiah(order.estimated_amount)}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
