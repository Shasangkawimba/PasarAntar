import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Market {
    id: number;
    name: string;
    address: string;
}

interface ChecklistItem {
    id: number;
    item_name: string;
    total_quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    estimated_amount: number;
    buyer: User;
}

interface Checklist {
    id: number;
    status: string;
    market: Market;
    joki: User | null;
    items: ChecklistItem[];
    orders: Order[];
}

interface MasterChecklistDetailProps {
    checklist: Checklist;
}

export default function MasterChecklistDetail({ checklist }: MasterChecklistDetailProps) {
    const formatRupiah = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY_TO_SHOP':
                return { bg: '#e0f2fe', text: '#0369a1', label: 'SIAP BELANJA' };
            case 'SHOPPING':
                return { bg: '#f3e8ff', text: '#6b21a8', label: 'SEDANG BELANJA' };
            case 'COMPLETED':
                return { bg: '#d1fae5', text: '#059669', label: 'SELESAI' };
            default:
                return { bg: '#f3f4f6', text: '#4b5563', label: status };
        }
    };

    const statusInfo = getStatusStyle(checklist.status);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Master Checklist #MC-{checklist.id}
                    </h2>
                    <Link href={route('admin.checklists.index')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ minHeight: '36px' }}>
                        Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title={`Admin - Detail Master Checklist #MC-${checklist.id}`} />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-detail-grid">
                        {/* Left Column: Aggregated Items */}
                        <div>
                            <div className="pa-form-section">
                                <div className="pa-flex-between pa-mb-4">
                                    <div>
                                        <div className="pa-subtitle">PASAR ASAL</div>
                                        <h2 className="pa-font-bold" style={{ fontSize: '1.25rem' }}>{checklist.market.name}</h2>
                                        <p className="pa-subtitle">{checklist.market.address}</p>
                                    </div>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 'bold',
                                            backgroundColor: statusInfo.bg,
                                            color: statusInfo.text,
                                        }}
                                    >
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div className="pa-mt-6">
                                    <h3 className="pa-font-bold" style={{ fontSize: '1rem', borderBottom: '2px solid var(--pa-border)', paddingBottom: '0.5rem' }}>
                                        Daftar Belanja Teragregasi (Total Kebutuhan)
                                    </h3>

                                    {checklist.items.length === 0 ? (
                                        <p className="pa-subtitle pa-mt-4" style={{ fontStyle: 'italic' }}>Tidak ada item belanja teragregasi.</p>
                                    ) : (
                                        <div className="pa-table-container">
                                            <table className="pa-table">
                                                <thead>
                                                    <tr>
                                                        <th>Nama Barang</th>
                                                        <th>Total Kuantitas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {checklist.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="pa-font-bold" style={{ fontSize: '1rem', color: 'var(--pa-text)' }}>
                                                                {item.item_name}
                                                            </td>
                                                            <td style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--pa-primary-dark)' }}>
                                                                {item.total_quantity}x
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Grouped Orders & Joki Details */}
                        <div>
                            {/* Joki Assignment Card */}
                            <div className="pa-form-section">
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Joki Yang Bertugas</h3>
                                {checklist.joki ? (
                                    <div style={{ padding: '0.75rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                        <div className="pa-font-bold">{checklist.joki.name}</div>
                                        <div className="pa-subtitle">{checklist.joki.email}</div>
                                    </div>
                                ) : (
                                    <p className="pa-subtitle" style={{ fontStyle: 'italic' }}>Belum ditugaskan ke joki</p>
                                )}
                            </div>

                            {/* Linked Orders List */}
                            <div className="pa-form-section pa-mt-4">
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Pesanan Terkait ({checklist.orders.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {checklist.orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={route('admin.orders.show', order.id)}
                                            style={{
                                                display: 'block',
                                                padding: '0.75rem',
                                                border: '1px solid var(--pa-border)',
                                                borderRadius: '0.5rem',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                backgroundColor: 'var(--pa-bg)'
                                            }}
                                            className="hover:border-emerald-500 transition-colors"
                                        >
                                            <div className="pa-flex-between">
                                                <span className="pa-font-bold" style={{ color: 'var(--pa-primary-dark)' }}>{order.order_number}</span>
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--pa-text-muted)' }}>
                                                    {formatRupiah(order.estimated_amount)}
                                                </span>
                                            </div>
                                            <div className="pa-subtitle pa-mt-1" style={{ fontSize: '0.75rem' }}>
                                                Buyer: {order.buyer.name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
