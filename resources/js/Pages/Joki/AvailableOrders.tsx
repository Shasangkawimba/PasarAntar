import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

interface User {
    id: number;
    name: string;
    email: string;
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

interface AvailableOrdersProps {
    orders: Order[];
}

export default function AvailableOrders({ orders }: AvailableOrdersProps) {
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

    const handleAssign = (orderId: number) => {
        if (confirm('Apakah Anda yakin ingin mengambil pesanan ini?')) {
            router.post(route('joki.orders.assign', orderId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pesanan Tersedia (Joki)
                </h2>
            }
        >
            <Head title="Pesanan Tersedia" />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-header">
                        <div>
                            <h1 className="pa-title">Daftar Kerja Belanja</h1>
                            <p className="pa-subtitle">Pilih pesanan belanja pasar tradisional yang siap Anda layani</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="pa-state-card">
                            <div className="pa-state-icon">🏪</div>
                            <h3 className="pa-state-title">Tidak Ada Pesanan Tersedia</h3>
                            <p>Saat ini belum ada pesanan baru dari Pembeli yang sedang menunggu Joki.</p>
                        </div>
                    ) : (
                        <div className="pa-market-grid">
                            {orders.map((order) => (
                                <div key={order.id} className="pa-market-card" style={{ cursor: 'default' }}>
                                    <div>
                                        <div className="pa-flex-between">
                                            <span className="pa-font-bold" style={{ color: 'var(--pa-primary-dark)', fontSize: '0.875rem' }}>
                                                {order.order_number}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>

                                        <h3 className="pa-market-name pa-mt-2" style={{ marginBottom: '0.25rem' }}>
                                            {order.market.name}
                                        </h3>
                                        <p className="pa-subtitle" style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>
                                            {order.market.address}
                                        </p>

                                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--pa-secondary-light)', borderRadius: '0.375rem', marginBottom: '1.25rem' }}>
                                            <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CUSTOMER (BUYER)</div>
                                            <div className="pa-font-bold pa-mt-1">{order.buyer.name}</div>
                                            <div className="pa-subtitle" style={{ fontSize: '0.75rem' }}>Telp: {order.buyer.phone_number || '-'}</div>
                                        </div>

                                        <div className="pa-flex-between" style={{ borderTop: '1px dashed var(--pa-border)', paddingTop: '0.75rem' }}>
                                            <span className="pa-subtitle" style={{ fontSize: '0.75rem' }}>{formatDate(order.created_at)}</span>
                                            <div>
                                                <span className="pa-order-price-label" style={{ display: 'block', textAlign: 'right' }}>ESTIMASI BELANJA</span>
                                                <span className="pa-order-price">{formatRupiah(order.estimated_amount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pa-mt-4">
                                        <button
                                            type="button"
                                            onClick={() => handleAssign(order.id)}
                                            className="pa-btn pa-btn-primary"
                                            style={{ width: '100%' }}
                                        >
                                            Ambil Pesanan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
