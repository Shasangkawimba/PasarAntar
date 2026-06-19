import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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

interface User {
    id: number;
    name: string;
}

interface Order {
    id: number;
    order_number: string;
    buyer: User;
}

interface Checklist {
    id: number;
    status: string;
    market: Market;
    items: ChecklistItem[];
    orders: Order[];
}

interface MasterChecklistDetailProps {
    checklist: Checklist;
}

export default function MasterChecklistDetail({ checklist }: MasterChecklistDetailProps) {
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const handleCheckboxChange = (itemId: number) => {
        setCheckedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
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
                        Checklist Belanja #MC-{checklist.id}
                    </h2>
                    <Link href={route('joki.checklists.index')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ minHeight: '36px' }}>
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Checklist Belanja #MC-${checklist.id}`} />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-detail-grid">
                        {/* Kolom Kiri: Aggregated items with checkboxes */}
                        <div>
                            <div className="pa-form-section">
                                <div className="pa-flex-between pa-mb-4">
                                    <div>
                                        <div className="pa-subtitle">PASAR TUJUAN</div>
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
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem', borderBottom: '2px solid var(--pa-border)', paddingBottom: '0.5rem' }}>
                                        Daftar Barang Gabungan (Checklist Belanja Joki)
                                    </h3>

                                    {checklist.items.length === 0 ? (
                                        <p className="pa-subtitle" style={{ fontStyle: 'italic' }}>Tidak ada item belanja teragregasi.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {checklist.items.map((item) => {
                                                const isChecked = !!checkedItems[item.id];
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleCheckboxChange(item.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '1rem',
                                                            border: '1px solid',
                                                            borderColor: isChecked ? 'var(--pa-primary)' : 'var(--pa-border)',
                                                            borderRadius: '0.5rem',
                                                            backgroundColor: isChecked ? 'var(--pa-primary-light)' : 'white',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        {/* Checkbox Icon */}
                                                        <div
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '0.375rem',
                                                                border: '2px solid',
                                                                borderColor: isChecked ? 'var(--pa-primary-dark)' : 'var(--pa-secondary)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginRight: '1rem',
                                                                backgroundColor: isChecked ? 'var(--pa-primary)' : 'transparent',
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {isChecked && '✓'}
                                                        </div>

                                                        {/* Item Details */}
                                                        <div style={{ flexGrow: 1 }}>
                                                            <span
                                                                style={{
                                                                    fontSize: '1.0625rem',
                                                                    fontWeight: isChecked ? 'bold' : '600',
                                                                    textDecoration: isChecked ? 'line-through' : 'none',
                                                                    color: isChecked ? 'var(--pa-secondary-dark)' : 'var(--pa-text)',
                                                                }}
                                                            >
                                                                {item.item_name}
                                                            </span>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div
                                                            style={{
                                                                fontSize: '1.25rem',
                                                                fontWeight: '800',
                                                                color: isChecked ? 'var(--pa-secondary-dark)' : 'var(--pa-primary-dark)',
                                                                backgroundColor: isChecked ? '#e5e7eb' : 'var(--pa-primary-light)',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '0.375rem',
                                                            }}
                                                        >
                                                            {item.total_quantity}x
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Linked Orders */}
                        <div>
                            <div className="pa-form-section">
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Rincian Pesanan Terkait ({checklist.orders.length})</h3>
                                <p className="pa-subtitle pa-mb-4" style={{ fontSize: '0.75rem' }}>Master checklist ini menggabungkan belanjaan dari pesanan berikut:</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {checklist.orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={route('joki.orders.show', order.id)}
                                            style={{
                                                display: 'block',
                                                padding: '0.75rem',
                                                border: '1px solid var(--pa-border)',
                                                borderRadius: '0.5rem',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                backgroundColor: 'var(--pa-bg)',
                                            }}
                                            className="hover:border-emerald-500 transition-colors"
                                        >
                                            <div className="pa-font-bold" style={{ color: 'var(--pa-primary-dark)' }}>{order.order_number}</div>
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
