import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import ProgressTimeline from '@/Components/ProgressTimeline';

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

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    notes: string | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    estimated_amount: number;
    actual_amount: number | null;
    created_at: string;
    buyer: User;
    market: Market;
    items: OrderItem[];
}

interface OrderWorkflowProps {
    order: Order;
}

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string; confirmMessage: string }> = {
    ASSIGNED: {
        label: 'Mulai Belanja',
        nextStatus: 'SHOPPING',
        confirmMessage: 'Mulai belanja untuk pesanan ini?',
    },
    SHOPPING: {
        label: 'Antar Pesanan',
        nextStatus: 'DELIVERING',
        confirmMessage: 'Belanja selesai dan siap antar pesanan ini?',
    },
    DELIVERING: {
        label: 'Selesaikan Pesanan',
        nextStatus: 'COMPLETED',
        confirmMessage: 'Pesanan sudah diterima oleh pembeli?',
    },
};

export default function OrderWorkflow({ order }: OrderWorkflowProps) {
    const formatRupiah = (value: number | null) => {
        if (value === null) return '-';
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

    const action = STATUS_ACTIONS[order.status];

    const handleStatusUpdate = () => {
        if (!action) return;
        if (confirm(action.confirmMessage)) {
            router.post(route('joki.orders.status', order.id), {
                status: action.nextStatus,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Workflow {order.order_number}
                    </h2>
                    <Link href={route('joki.orders.assigned')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ minHeight: '36px' }}>
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Workflow ${order.order_number}`} />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-detail-grid">
                        {/* Left Column: Status, Buyer Info, Timeline, Items */}
                        <div>
                            {/* Status & Market Card */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <div className="pa-flex-between">
                                    <div>
                                        <div className="pa-subtitle">PASAR TUJUAN</div>
                                        <h2 className="pa-font-bold" style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>{order.market.name}</h2>
                                        <p className="pa-subtitle">{order.market.address}</p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p className="pa-subtitle pa-mt-4">Dibuat pada: {formatDate(order.created_at)}</p>
                            </div>

                            {/* Buyer Information */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Informasi Pembeli</h3>
                                <div style={{ padding: '1rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                    <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PEMBELI (BUYER)</div>
                                    <div className="pa-font-bold pa-mt-2">{order.buyer.name}</div>
                                    <div className="pa-subtitle">{order.buyer.email}</div>
                                    <div className="pa-subtitle pa-mt-1">Telp: {order.buyer.phone_number || '-'}</div>
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Status Perjalanan</h3>
                                <ProgressTimeline currentStatus={order.status} />
                            </div>

                            {/* Order Items */}
                            <div className="pa-form-section">
                                <h3 className="pa-font-bold" style={{ fontSize: '1rem' }}>Daftar Belanjaan</h3>
                                <div className="pa-table-container">
                                    <table className="pa-table">
                                        <thead>
                                            <tr>
                                                <th>Nama Barang</th>
                                                <th>Jumlah</th>
                                                <th>Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="pa-font-bold">{item.product_name}</td>
                                                    <td>{item.quantity}x</td>
                                                    <td className="pa-subtitle">{item.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Cost Summary & Action */}
                        <div>
                            {/* Cost Panel */}
                            <div className="pa-form-section">
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Rincian Biaya</h3>

                                <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)' }}>
                                    <span className="pa-subtitle">Estimasi Deposito</span>
                                    <span className="pa-font-bold">{formatRupiah(order.estimated_amount)}</span>
                                </div>

                                <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)' }}>
                                    <span className="pa-subtitle">Biaya Riil Belanja</span>
                                    <span>{formatRupiah(order.actual_amount)}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {action && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Aksi Selanjutnya</h3>
                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        className="pa-btn pa-btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        {action.label}
                                    </button>
                                </div>
                            )}

                            {order.status === 'COMPLETED' && (
                                <div className="pa-form-section pa-mt-4" style={{ backgroundColor: 'var(--pa-primary-light)', border: '1px solid var(--pa-primary)' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                        <h3 className="pa-font-bold" style={{ color: 'var(--pa-primary-dark)' }}>Pesanan Selesai</h3>
                                        <p className="pa-subtitle pa-mt-2">Pesanan ini telah selesai dan diterima oleh pembeli.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
