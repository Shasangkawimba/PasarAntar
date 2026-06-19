import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import ProgressTimeline from '@/Components/ProgressTimeline';

interface User { id: number; name: string; email: string; phone_number: string | null; }
interface Market { id: number; name: string; address: string; }
interface OrderItem { id: number; product_name: string; quantity: number; notes: string | null; }
interface Receipt { id: number; image_url: string; uploader?: { name: string; }; }
interface ActivityLogEntry { id: number; action: string; metadata: Record<string, any>; created_at: string; user: User; }

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

export default function OrderDetail({ order, activityLogs }: { order: Order; activityLogs: ActivityLogEntry[] }) {
    const [orderState, setOrderState] = useState<Order>(order);
    const [logsState, setLogsState] = useState<ActivityLogEntry[]>(activityLogs);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => setOrderState(order), [order]);
    useEffect(() => setLogsState(activityLogs), [activityLogs]);

    useEffect(() => {
        if (window.Echo && window.Echo.connector.pusher) {
            const connection = window.Echo.connector.pusher.connection;
            setIsConnected(connection.state === 'connected');
            const handleStateChange = (states: { current: string }) => setIsConnected(states.current === 'connected');
            connection.bind('state_change', handleStateChange);
            return () => connection.unbind('state_change', handleStateChange);
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
                        id: prev.joki?.id ?? 0, name: e.assigned_joki_name, email: prev.joki?.email ?? '', phone_number: e.assigned_joki_phone ?? null,
                    };
                }
                if (e.receipts) updated.receipts = e.receipts;
                return updated;
            });

            if (e.activity_log) {
                setLogsState((prev) => {
                    if (prev.some((log) => log.id === e.activity_log.id)) return prev;
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

    const formatRupiah = (value: number | null) => value === null ? '-' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const formatAction = (action: string) => {
        const labels: Record<string, string> = {
            'ORDER_CREATED': 'Pesanan Baru Dibuat',
            'ORDER_ASSIGNED': 'Ditugaskan ke Joki',
            'STATUS_CHANGED': 'Perubahan Status',
            'RECEIPT_UPLOADED': 'Nota Belanja Diunggah',
            'SETTLEMENT_CALCULATED': 'Settlement Dihitung',
        };
        return labels[action] || action;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Monitoring ${orderState.order_number}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('admin.orders.index')} className="text-[var(--pa-text-muted)] hover:text-[var(--pa-primary)] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                            <span className="pa-body-sm font-semibold">Kembali ke Daftar Pesanan</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>Monitoring Transaksi</h1>
                        <span className="pa-mono pa-label-caps px-2 py-1 rounded" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                            {orderState.order_number}
                        </span>
                        {isConnected ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full pa-label-caps" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--pa-status-completed)' }}>
                                <span className="w-1.5 h-1.5 rounded-full pa-pulse-dot" style={{ backgroundColor: 'var(--pa-status-completed)' }}></span>
                                Live Sync
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full pa-label-caps" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--pa-outline)' }}></span>
                                Menghubungkan...
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <StatusBadge status={orderState.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-5 md:gap-8">
                    
                    {/* Timeline */}
                    <section className="pa-bento-card-static p-6 md:p-8">
                        <h3 className="pa-headline-md mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>route</span>
                            Perjalanan Pesanan
                        </h3>
                        <ProgressTimeline currentStatus={orderState.status} />
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                        {/* Buyer Info */}
                        <section className="pa-bento-card-static p-6 flex flex-col justify-between" style={{ backgroundColor: 'var(--pa-surface-container-low)' }}>
                            <div>
                                <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-primary)', marginBottom: 12 }}>
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Pembeli (Buyer)
                                </span>
                                <h3 className="pa-headline-md">{orderState.buyer.name}</h3>
                                <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.buyer.email}</p>
                                <p className="pa-mono pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.buyer.phone_number || 'Tidak ada nomor'}</p>
                            </div>
                        </section>

                        {/* Joki Info */}
                        <section className="pa-bento-card-static p-6 flex flex-col justify-between" style={{ backgroundColor: 'var(--pa-surface-container-low)' }}>
                            <div>
                                <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-status-assigned)', marginBottom: 12 }}>
                                    <span className="material-symbols-outlined text-sm">two_wheeler</span>
                                    Joki Bertugas
                                </span>
                                {orderState.joki ? (
                                    <>
                                        <h3 className="pa-headline-md">{orderState.joki.name}</h3>
                                        <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.joki.email}</p>
                                        <p className="pa-mono pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.joki.phone_number || 'Tidak ada nomor'}</p>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                                            <span className="material-symbols-outlined">person_search</span>
                                        </div>
                                        <span className="pa-body-sm italic" style={{ color: 'var(--pa-text-muted)' }}>Belum ada joki yang mengambil</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Items List */}
                    <section className="pa-bento-card-static p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="pa-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>receipt_long</span>
                                Daftar Barang Belanjaan
                            </h3>
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>{orderState.items.length} Barang</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {orderState.items.map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--pa-surface)', border: '1px solid var(--pa-surface-variant)' }}>
                                    <div>
                                        <div className="pa-body-lg" style={{ fontWeight: 600 }}>{item.product_name}</div>
                                        {item.notes && <div className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>Catatan: {item.notes}</div>}
                                    </div>
                                    <div className="pa-mono pa-headline-md shrink-0 py-1 px-3 rounded-lg" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-main)' }}>
                                        {item.quantity}x
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5 md:gap-8">
                    
                    <section className="pa-bento-card-static p-6 flex flex-col justify-between">
                        <div>
                            <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-text-muted)', marginBottom: 12 }}>
                                <span className="material-symbols-outlined text-sm">storefront</span>
                                Pasar Tujuan
                            </span>
                            <h3 className="pa-headline-md">{orderState.market.name}</h3>
                            <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.market.address}</p>
                        </div>
                        <div className="mt-6 pt-4 flex flex-col gap-1" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)', fontSize: 10 }}>Dibuat Pada</span>
                            <span className="pa-body-sm pa-mono" style={{ fontWeight: 600 }}>{formatDate(orderState.created_at)}</span>
                        </div>
                    </section>

                    {/* Financial Summary */}
                    <section className="pa-bento-card-static p-6">
                        <h3 className="pa-headline-md mb-6 pb-4" style={{ borderBottom: '1px solid var(--pa-surface-variant)' }}>Rincian Keuangan</h3>
                        
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Estimasi Deposit</span>
                                <span className="pa-mono pa-button-text">{formatRupiah(orderState.estimated_amount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Total Belanja Aktual</span>
                                <span className="pa-mono pa-headline-md" style={{ color: orderState.actual_amount !== null ? 'var(--pa-text-main)' : 'var(--pa-text-muted)' }}>
                                    {formatRupiah(orderState.actual_amount)}
                                </span>
                            </div>
                        </div>

                        {orderState.actual_amount !== null && (
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                                {orderState.refund_amount !== null && orderState.refund_amount > 0 ? (
                                    <div className="p-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-status-completed)' }}>Kembalian ke Buyer (Refund)</span>
                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-status-completed)' }}>{formatRupiah(orderState.refund_amount)}</span>
                                    </div>
                                ) : orderState.additional_payment !== null && orderState.additional_payment > 0 ? (
                                    <div className="p-4" style={{ backgroundColor: 'rgba(225,29,72,0.1)' }}>
                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-alert-rose)' }}>Kekurangan Bayar Buyer</span>
                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-alert-rose)' }}>{formatRupiah(orderState.additional_payment)}</span>
                                    </div>
                                ) : (
                                    <div className="p-4" style={{ backgroundColor: 'var(--pa-surface-container)' }}>
                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-text-muted)' }}>Jumlah Pas</span>
                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>{formatRupiah(0)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Receipts */}
                    {orderState.receipts && orderState.receipts.length > 0 && (
                        <section className="pa-bento-card-static p-6">
                            <h3 className="pa-headline-md mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>image</span>
                                Bukti Nota Belanja
                            </h3>
                            <div className="flex flex-col gap-4">
                                {orderState.receipts.map(receipt => (
                                    <div key={receipt.id} className="rounded-xl overflow-hidden cursor-zoom-in relative group" style={{ border: '1px solid var(--pa-surface-variant)' }} onClick={() => setZoomedImage(receipt.image_url)}>
                                        <img src={receipt.image_url} alt="Nota" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="material-symbols-outlined text-white" style={{ fontSize: 32 }}>zoom_in</span>
                                        </div>
                                        {receipt.uploader && (
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white pa-label-caps text-xs">
                                                Diupload: {receipt.uploader.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Activity Log */}
                    {logsState.length > 0 && (
                        <section className="pa-bento-card-static p-6">
                            <h3 className="pa-headline-md mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>history</span>
                                Riwayat Sistem
                            </h3>
                            <div className="flex flex-col gap-3">
                                {logsState.map((log) => (
                                    <div key={log.id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="pa-body-sm" style={{ fontWeight: 600 }}>{formatAction(log.action)}</span>
                                            <span className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-muted)', fontSize: 9 }}>{formatDate(log.created_at)}</span>
                                        </div>
                                        <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', fontSize: 11 }}>Oleh: {log.user.name}</div>
                                        
                                        {log.action === 'STATUS_CHANGED' && log.metadata && (
                                            <div className="mt-2 pa-mono pa-label-caps" style={{ color: 'var(--pa-primary)' }}>
                                                {String(log.metadata.old_status || '')} &rarr; {String(log.metadata.new_status || '')}
                                            </div>
                                        )}
                                        {log.action === 'SETTLEMENT_CALCULATED' && log.metadata && (
                                            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--pa-surface-variant)' }}>
                                                <div className="pa-mono text-xs mb-1">Est: {formatRupiah(Number(log.metadata.estimated_amount || 0))}</div>
                                                <div className="pa-mono text-xs mb-1">Riil: {formatRupiah(Number(log.metadata.actual_amount || 0))}</div>
                                                {Number(log.metadata.refund_amount || 0) > 0 && (
                                                    <div className="pa-mono text-xs mt-2" style={{ color: 'var(--pa-status-completed)' }}>Refund: {formatRupiah(Number(log.metadata.refund_amount))}</div>
                                                )}
                                                {Number(log.metadata.additional_payment || 0) > 0 && (
                                                    <div className="pa-mono text-xs mt-2" style={{ color: 'var(--pa-alert-rose)' }}>Kurang: {formatRupiah(Number(log.metadata.additional_payment))}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Zoom Modal */}
            {zoomedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 cursor-zoom-out" onClick={() => setZoomedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-screen p-4 flex flex-col items-center">
                        <button onClick={() => setZoomedImage(null)} className="absolute top-0 right-4 pa-btn pa-btn-secondary bg-white/10 text-white border-0 hover:bg-white/20">
                            <span className="material-symbols-outlined">close</span> Tutup
                        </button>
                        <img src={zoomedImage} alt="Nota Besar" className="max-w-full max-h-[85vh] object-contain rounded-xl mt-12" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
