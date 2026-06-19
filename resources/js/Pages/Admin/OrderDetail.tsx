import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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

interface Receipt {
    id: number;
    image_url: string;
    uploader?: {
        name: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    estimated_amount: number;
    actual_amount: number | null;
    refund_amount: number | null;
    additional_payment: number | null;
    created_at: string;
    buyer: User;
    market: Market;
    joki: User | null;
    items: OrderItem[];
    receipts: Receipt[];
}

interface OrderDetailProps {
    order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Pesanan {order.order_number} (Admin)
                    </h2>
                    <Link href={route('admin.orders.index')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ minHeight: '36px' }}>
                        Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title={`Admin - Detail Pesanan ${order.order_number}`} />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-detail-grid">
                        {/* Kolom Kiri: Status, Pihak Terkait, Barang */}
                        <div>
                            {/* Card Status & Pasar */}
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

                            {/* User & Joki Information */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Informasi Pengguna</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Buyer Details */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                        <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PEMBELI (BUYER)</div>
                                        <div className="pa-font-bold pa-mt-2">{order.buyer.name}</div>
                                        <div className="pa-subtitle">{order.buyer.email}</div>
                                        <div className="pa-subtitle pa-mt-1">Telp: {order.buyer.phone_number || '-'}</div>
                                    </div>

                                    {/* Joki Details */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                        <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>JOKI YANG BERTUGAS</div>
                                        {order.joki ? (
                                            <>
                                                <div className="pa-font-bold pa-mt-2">{order.joki.name}</div>
                                                <div className="pa-subtitle">{order.joki.email}</div>
                                                <div className="pa-subtitle pa-mt-1">Telp: {order.joki.phone_number || '-'}</div>
                                            </>
                                        ) : (
                                            <div className="pa-subtitle pa-mt-4" style={{ fontStyle: 'italic' }}>
                                                Belum ada joki yang bertugas
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Status Perjalanan Belanja</h3>
                                <ProgressTimeline currentStatus={order.status} />
                            </div>

                            {/* Daftar Barang Belanjaan */}
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

                        {/* Kolom Kanan: Rincian Biaya & Settlement */}
                        <div>
                            {/* Panel Ringkasan Biaya */}
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

                                {order.status === 'COMPLETED' && (
                                    <>
                                        {order.refund_amount && order.refund_amount > 0 ? (
                                            <div className="pa-flex-between pa-mt-4" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: 'var(--pa-primary-light)', color: 'var(--pa-primary-dark)' }}>
                                                <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Uang Kembali (Refund)</span>
                                                <span className="pa-font-bold" style={{ fontSize: '1rem' }}>{formatRupiah(order.refund_amount)}</span>
                                            </div>
                                        ) : null}

                                        {order.additional_payment && order.additional_payment > 0 ? (
                                            <div className="pa-flex-between pa-mt-4" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: '#fef3c7', color: '#92400e' }}>
                                                <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Kekurangan Bayar</span>
                                                <span className="pa-font-bold" style={{ fontSize: '1rem' }}>{formatRupiah(order.additional_payment)}</span>
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </div>

                            {/* Bukti Nota Belanja */}
                            {order.receipts.length > 0 && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Nota Belanja Fisik</h3>
                                    {order.receipts.map((receipt) => (
                                        <div key={receipt.id} className="pa-mt-2">
                                            <img 
                                                src={receipt.image_url} 
                                                alt="Nota Belanja" 
                                                style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid var(--pa-border)', maxHeight: '300px', objectFit: 'contain' }} 
                                            />
                                            {receipt.uploader && (
                                                <p className="pa-subtitle pa-mt-2" style={{ fontSize: '0.75rem' }}>Diunggah oleh: {receipt.uploader.name}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
