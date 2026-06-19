import React, { useState, useEffect } from 'react';
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

interface ActivityLogEntry {
    id: number;
    action: string;
    metadata: Record<string, any>;
    created_at: string;
    user: User;
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
    activityLogs: ActivityLogEntry[];
}

export default function OrderDetail({ order, activityLogs }: OrderDetailProps) {
    const [orderState, setOrderState] = useState<Order>(order);
    const [logsState, setLogsState] = useState<ActivityLogEntry[]>(activityLogs);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => {
        setOrderState(order);
    }, [order]);

    useEffect(() => {
        setLogsState(activityLogs);
    }, [activityLogs]);

    useEffect(() => {
        if (window.Echo && window.Echo.connector.pusher) {
            const connection = window.Echo.connector.pusher.connection;
            setIsConnected(connection.state === 'connected');

            const handleStateChange = (states: { current: string }) => {
                setIsConnected(states.current === 'connected');
            };

            connection.bind('state_change', handleStateChange);

            return () => {
                connection.unbind('state_change', handleStateChange);
            };
        }
    }, []);

    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`orders.${orderState.id}`);

        const handleUpdate = (e: any) => {
            setOrderState((prev) => {
                const updated = {
                    ...prev,
                    status: e.status,
                    actual_amount: e.actual_amount,
                    refund_amount: e.refund_amount,
                    additional_payment: e.additional_payment,
                };
                if (e.assigned_joki_name) {
                    updated.joki = {
                        id: prev.joki?.id ?? 0,
                        name: e.assigned_joki_name,
                        email: prev.joki?.email ?? '',
                        phone_number: e.assigned_joki_phone ?? null,
                    };
                }
                if (e.receipts) {
                    updated.receipts = e.receipts;
                }
                return updated;
            });

            if (e.activity_log) {
                setLogsState((prev) => {
                    if (prev.some((log) => log.id === e.activity_log.id)) {
                        return prev;
                    }
                    return [e.activity_log, ...prev];
                });
            }
        };

        channel.listen('OrderAssigned', handleUpdate);
        channel.listen('OrderStatusChanged', handleUpdate);
        channel.listen('SettlementUpdated', handleUpdate);

        return () => {
            channel.stopListening('OrderAssigned');
            channel.stopListening('OrderStatusChanged');
            channel.stopListening('SettlementUpdated');
        };
    }, [orderState.id]);

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

    const formatAction = (action: string) => {
        const labels: Record<string, string> = {
            'ORDER_CREATED': 'Order Dibuat',
            'ORDER_ASSIGNED': 'Order Diambil Joki',
            'STATUS_CHANGED': 'Status Berubah',
            'RECEIPT_UPLOADED': 'Nota Belanja Diunggah',
            'SETTLEMENT_CALCULATED': 'Perhitungan Settlement',
        };
        return labels[action] || action;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-3">
                        Detail Pesanan {orderState.order_number} (Admin)
                        {isConnected ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800" id="realtime-status-connected">
                                ● Realtime Connected
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500" id="realtime-status-disconnected">
                                ○ Realtime Disconnected
                            </span>
                        )}
                    </h2>
                    <Link href={route('admin.orders.index')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ minHeight: '36px' }}>
                        Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title={`Admin - Detail Pesanan ${orderState.order_number}`} />

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
                                        <h2 className="pa-font-bold" style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>{orderState.market.name}</h2>
                                        <p className="pa-subtitle">{orderState.market.address}</p>
                                    </div>
                                    <StatusBadge status={orderState.status} />
                                </div>
                                <p className="pa-subtitle pa-mt-4">Dibuat pada: {formatDate(orderState.created_at)}</p>
                            </div>

                            {/* User & Joki Information */}
                            <div className="pa-form-section" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Informasi Pengguna</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Buyer Details */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                        <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>PEMBELI (BUYER)</div>
                                        <div className="pa-font-bold pa-mt-2">{orderState.buyer.name}</div>
                                        <div className="pa-subtitle">{orderState.buyer.email}</div>
                                        <div className="pa-subtitle pa-mt-1">Telp: {orderState.buyer.phone_number || '-'}</div>
                                    </div>

                                    {/* Joki Details */}
                                    <div style={{ padding: '1rem', border: '1px solid var(--pa-border)', borderRadius: '0.5rem' }}>
                                        <div className="pa-subtitle" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>JOKI YANG BERTUGAS</div>
                                        {orderState.joki ? (
                                            <>
                                                <div className="pa-font-bold pa-mt-2">{orderState.joki.name}</div>
                                                <div className="pa-subtitle">{orderState.joki.email}</div>
                                                <div className="pa-subtitle pa-mt-1">Telp: {orderState.joki.phone_number || '-'}</div>
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
                                <ProgressTimeline currentStatus={orderState.status} />
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
                                            {orderState.items.map((item) => (
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

                        {/* Kolom Kanan: Rincian Biaya, Nota, Activity Log */}
                        <div>
                            {/* Panel Ringkasan Biaya */}
                            <div className="pa-form-section">
                                <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Rincian Biaya</h3>
                                
                                <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)' }}>
                                    <span className="pa-subtitle">Estimasi Deposito</span>
                                    <span className="pa-font-bold">{formatRupiah(orderState.estimated_amount)}</span>
                                </div>

                                <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)' }}>
                                    <span className="pa-subtitle">Biaya Riil Belanja</span>
                                    <span className={orderState.actual_amount !== null ? 'pa-font-bold' : ''}>
                                        {formatRupiah(orderState.actual_amount)}
                                    </span>
                                </div>

                                {orderState.actual_amount !== null && (
                                    <>
                                        {orderState.refund_amount !== null && orderState.refund_amount > 0 ? (
                                            <div className="pa-flex-between pa-mt-4" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: 'var(--pa-primary-light)', color: 'var(--pa-primary-dark)' }}>
                                                <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Uang Kembali (Refund)</span>
                                                <span className="pa-font-bold" style={{ fontSize: '1rem' }}>{formatRupiah(orderState.refund_amount)}</span>
                                            </div>
                                        ) : null}

                                        {orderState.additional_payment !== null && orderState.additional_payment > 0 ? (
                                            <div className="pa-flex-between pa-mt-4" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: '#fef3c7', color: '#92400e' }}>
                                                <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Kekurangan Bayar</span>
                                                <span className="pa-font-bold" style={{ fontSize: '1rem' }}>{formatRupiah(orderState.additional_payment)}</span>
                                            </div>
                                        ) : null}

                                        {orderState.refund_amount === 0 && orderState.additional_payment === 0 ? (
                                            <div className="pa-flex-between pa-mt-4" style={{ padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: 'var(--pa-secondary-light)', color: 'var(--pa-secondary-dark)' }}>
                                                <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Jumlah Belanja Sesuai</span>
                                                <span className="pa-font-bold" style={{ fontSize: '1rem' }}>{formatRupiah(0)}</span>
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </div>

                            {/* Bukti Nota Belanja */}
                            {orderState.receipts && orderState.receipts.length > 0 && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Nota Belanja Fisik</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {orderState.receipts.map((receipt) => (
                                            <div key={receipt.id} style={{ borderBottom: '1px solid var(--pa-border)', paddingBottom: '1rem' }}>
                                                <img 
                                                    src={receipt.image_url} 
                                                    alt="Nota Belanja" 
                                                    style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid var(--pa-border)', maxHeight: '300px', objectFit: 'contain', cursor: 'pointer' }} 
                                                    onClick={() => setZoomedImage(receipt.image_url)}
                                                />
                                                {receipt.uploader && (
                                                    <p className="pa-subtitle pa-mt-2" style={{ fontSize: '0.75rem' }}>Diunggah oleh: {receipt.uploader.name}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Log */}
                            {logsState.length > 0 && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Riwayat Aktivitas</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {logsState.map((log) => (
                                            <div key={log.id} style={{ padding: '0.75rem', backgroundColor: 'var(--pa-secondary-light)', borderRadius: '0.375rem', fontSize: '0.8125rem' }}>
                                                <div className="pa-flex-between">
                                                    <span className="pa-font-bold">{formatAction(log.action)}</span>
                                                    <span className="pa-subtitle" style={{ fontSize: '0.6875rem' }}>{formatDate(log.created_at)}</span>
                                                </div>
                                                <div className="pa-subtitle pa-mt-1">oleh: {log.user.name}</div>
                                                {log.action === 'STATUS_CHANGED' && log.metadata && (
                                                    <div className="pa-mt-1" style={{ fontSize: '0.75rem' }}>
                                                        {String(log.metadata.old_status || '')} → {String(log.metadata.new_status || '')}
                                                    </div>
                                                )}
                                                {log.action === 'SETTLEMENT_CALCULATED' && log.metadata && (
                                                    <div className="pa-mt-1" style={{ fontSize: '0.75rem', padding: '0.25rem', backgroundColor: '#ffffff', borderRadius: '0.25rem', border: '1px solid var(--pa-border)' }}>
                                                        <div>Estimasi: {formatRupiah(Number(log.metadata.estimated_amount || 0))}</div>
                                                        <div>Riil: {formatRupiah(Number(log.metadata.actual_amount || 0))}</div>
                                                        {Number(log.metadata.refund_amount || 0) > 0 && (
                                                            <div style={{ color: 'var(--pa-primary-dark)', fontWeight: 'bold' }}>Kembalian: {formatRupiah(Number(log.metadata.refund_amount))}</div>
                                                        )}
                                                        {Number(log.metadata.additional_payment || 0) > 0 && (
                                                            <div style={{ color: 'var(--pa-danger)', fontWeight: 'bold' }}>Kurang Bayar: {formatRupiah(Number(log.metadata.additional_payment))}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Zoom Modal */}
            {zoomedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem',
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setZoomedImage(null)}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={zoomedImage}
                            alt="Nota Besar"
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', objectFit: 'contain' }}
                        />
                        <button
                            onClick={() => setZoomedImage(null)}
                            style={{
                                position: 'absolute',
                                top: '-2.5rem',
                                right: 0,
                                color: 'white',
                                fontFamily: 'sans-serif',
                                fontSize: '1.5rem',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            ✕ Tutup
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
