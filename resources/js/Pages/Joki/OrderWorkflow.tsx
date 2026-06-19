import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
    order_id: number;
    image_url: string;
    uploaded_by: number | null;
    created_at: string;
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
    items: OrderItem[];
    receipts: Receipt[];
}

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string; confirmMessage: string }> = {
    ASSIGNED: { label: 'Mulai Belanja', nextStatus: 'SHOPPING', confirmMessage: 'Mulai belanja untuk pesanan ini?' },
    SHOPPING: { label: 'Antar Pesanan', nextStatus: 'DELIVERING', confirmMessage: 'Belanja selesai dan siap antar pesanan ini?' },
    DELIVERING: { label: 'Selesaikan Pesanan', nextStatus: 'COMPLETED', confirmMessage: 'Pesanan sudah diterima oleh pembeli?' },
};

export default function OrderWorkflow({ order }: { order: Order }) {
    const [orderState, setOrderState] = useState<Order>(order);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const { data, setData, post, processing, errors, reset } = useForm({
        actual_amount: orderState.actual_amount !== null ? orderState.actual_amount.toString() : '',
        receipt: null as File | null,
    });

    useEffect(() => {
        setOrderState(order);
        setData('actual_amount', order.actual_amount !== null ? order.actual_amount.toString() : '');
    }, [order]);

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
                if (e.receipts) updated.receipts = e.receipts;
                return updated;
            });
            if (e.actual_amount !== null) setData('actual_amount', e.actual_amount.toString());
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

    const formatRupiah = (value: number | null) =>
        value === null ? '-' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    const action = STATUS_ACTIONS[orderState.status];
    const canComplete = orderState.receipts && orderState.receipts.length > 0 && orderState.actual_amount !== null;

    const handleStatusUpdate = () => {
        if (!action) return;
        if (action.nextStatus === 'COMPLETED' && !canComplete) {
            alert('Anda harus mengisi total belanja riil dan mengunggah foto nota belanja terlebih dahulu sebelum menyelesaikan pesanan.');
            return;
        }
        if (confirm(action.confirmMessage)) {
            router.post(route('joki.orders.status', orderState.id), { status: action.nextStatus });
        }
    };

    const handleSubmitSettlement = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('joki.orders.settle', orderState.id), {
            forceFormData: true,
            onSuccess: () => {
                setReceiptPreview(null);
                reset('receipt');
            },
        });
    };

    const toggleItemCheck = (itemId: number) => setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

    const estimated = orderState.estimated_amount;
    const actual = parseInt(data.actual_amount) || 0;
    let refund = 0;
    let additional = 0;

    if (data.actual_amount !== '') {
        if (estimated > actual) refund = estimated - actual;
        else if (actual > estimated) additional = actual - estimated;
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Kerja ${orderState.order_number}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('joki.orders.assigned')} className="text-[var(--pa-text-muted)] hover:text-[var(--pa-primary)] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                            <span className="pa-body-sm font-semibold">Kembali ke Tugas Saya</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>Alur Kerja Joki</h1>
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
                            Tahapan Pengiriman
                        </h3>
                        <ProgressTimeline currentStatus={orderState.status} />
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                        {/* Market Info */}
                        <section className="pa-bento-card-static p-6 flex flex-col justify-between">
                            <div>
                                <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-text-muted)', marginBottom: 12 }}>
                                    <span className="material-symbols-outlined text-sm">storefront</span>
                                    Pasar Tujuan Belanja
                                </span>
                                <h3 className="pa-headline-md">{orderState.market.name}</h3>
                                <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.market.address}</p>
                            </div>
                        </section>

                        {/* Buyer Info */}
                        <section className="pa-bento-card-static p-6 flex flex-col justify-between" style={{ backgroundColor: 'var(--pa-surface-container-low)' }}>
                            <div>
                                <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-primary)', marginBottom: 12 }}>
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Penerima (Buyer)
                                </span>
                                <h3 className="pa-headline-md">{orderState.buyer.name}</h3>
                                <p className="pa-mono pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{orderState.buyer.phone_number || 'Tidak ada nomor'}</p>
                            </div>
                            {orderState.buyer.phone_number && (
                                <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                    <a href={`tel:${orderState.buyer.phone_number}`} className="pa-btn pa-btn-secondary pa-btn-sm w-full justify-center">
                                        <span className="material-symbols-outlined text-sm">call</span>
                                        Hubungi Pembeli
                                    </a>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Interactive Checklist */}
                    <section className="pa-bento-card-static p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="pa-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>checklist</span>
                                Daftar Belanjaan
                            </h3>
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>
                                {Object.values(checkedItems).filter(Boolean).length}/{orderState.items.length} Dibeli
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {orderState.items.map((item) => {
                                const isChecked = !!checkedItems[item.id];
                                return (
                                    <div 
                                        key={item.id} 
                                        onClick={() => toggleItemCheck(item.id)}
                                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors"
                                        style={{ 
                                            backgroundColor: isChecked ? 'rgba(16,185,129,0.05)' : 'var(--pa-surface)', 
                                            border: `1px solid ${isChecked ? 'rgba(16,185,129,0.2)' : 'var(--pa-surface-variant)'}`
                                        }}
                                    >
                                        <div 
                                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                                            style={{ 
                                                backgroundColor: isChecked ? 'var(--pa-status-completed)' : 'transparent',
                                                border: `2px solid ${isChecked ? 'var(--pa-status-completed)' : 'var(--pa-outline)'}`
                                            }}
                                        >
                                            {isChecked && <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>check</span>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="pa-body-lg" style={{ fontWeight: 600, color: isChecked ? 'var(--pa-text-muted)' : 'var(--pa-text-main)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                                                {item.product_name}
                                            </div>
                                            {item.notes && <div className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>Catatan: {item.notes}</div>}
                                        </div>
                                        <div className="pa-mono pa-headline-md shrink-0 py-1 px-3 rounded-lg" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-main)' }}>
                                            {item.quantity}x
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5 md:gap-8">
                    
                    {/* Primary Action Button */}
                    {action && (
                        <div className="pa-bento-card-static p-6" style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}>
                            <span className="pa-label-caps block mb-3" style={{ color: 'var(--pa-primary)' }}>Aksi Tahapan Selanjutnya</span>
                            {action.nextStatus === 'COMPLETED' && !canComplete && (
                                <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)' }}>
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-alert-rose)' }}>⚠️ Lengkapi penyelesaian belanja (nominal fisik & nota) sebelum menyelesaikan transaksi.</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleStatusUpdate}
                                className="w-full pa-btn pa-btn-primary pa-button-text py-4 rounded-xl shadow-sm justify-center"
                                disabled={action.nextStatus === 'COMPLETED' && !canComplete}
                            >
                                {action.label}
                            </button>
                        </div>
                    )}

                    {orderState.status === 'COMPLETED' && (
                        <div className="pa-bento-card-static p-6 text-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                            <span className="material-symbols-outlined text-4xl mb-2" style={{ color: 'var(--pa-status-completed)' }}>verified</span>
                            <h3 className="pa-headline-md" style={{ color: 'var(--pa-status-completed)' }}>Tugas Selesai</h3>
                            <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-status-completed)', opacity: 0.8 }}>Transaksi ini telah selesai diproses.</p>
                        </div>
                    )}

                    {/* Settlement Form */}
                    {(orderState.status === 'SHOPPING' || orderState.status === 'DELIVERING' || orderState.status === 'COMPLETED') && (
                        <section className="pa-bento-card-static p-6">
                            <h3 className="pa-headline-md mb-6 pb-4" style={{ borderBottom: '1px solid var(--pa-surface-variant)' }}>Penyelesaian Belanja</h3>
                            
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Estimasi Deposit</span>
                                    <span className="pa-mono pa-button-text">{formatRupiah(estimated)}</span>
                                </div>
                            </div>

                            {(orderState.status === 'SHOPPING' || orderState.status === 'DELIVERING') ? (
                                <form onSubmit={handleSubmitSettlement}>
                                    <div className="flex flex-col gap-4 mb-6">
                                        <div>
                                            <label className="pa-body-sm block mb-1" style={{ fontWeight: 600 }}>Total Belanja Riil (Rp)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent pa-mono pa-headline-md"
                                                style={{ borderBottom: '2px solid var(--pa-primary)', borderRadius: 0, padding: '0.5rem 0' }}
                                                placeholder="0"
                                                value={data.actual_amount}
                                                onChange={e => setData('actual_amount', e.target.value)}
                                                min="0"
                                                required
                                            />
                                            {errors.actual_amount && <p className="text-xs text-rose-600 mt-1">{errors.actual_amount}</p>}
                                        </div>

                                        <div>
                                            <label className="pa-body-sm block mb-1" style={{ fontWeight: 600 }}>Unggah Foto Nota</label>
                                            <input
                                                type="file"
                                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                accept="image/*"
                                                onChange={e => {
                                                    const files = e.target.files;
                                                    if (files && files.length > 0) {
                                                        setData('receipt', files[0]);
                                                        setReceiptPreview(URL.createObjectURL(files[0]));
                                                    }
                                                }}
                                                required={!orderState.receipts || orderState.receipts.length === 0}
                                            />
                                            {errors.receipt && <p className="text-xs text-rose-600 mt-1">{errors.receipt}</p>}
                                        </div>

                                        {receiptPreview && (
                                            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={receiptPreview} alt="Preview Nota" className="w-full h-32 object-cover" />
                                            </div>
                                        )}

                                        {/* Live Calculation Preview */}
                                        {data.actual_amount !== '' && (
                                            <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: 'var(--pa-surface-container)' }}>
                                                {refund > 0 && (
                                                    <div>
                                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-status-completed)' }}>Kembalikan ke Buyer (Refund)</span>
                                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-status-completed)' }}>{formatRupiah(refund)}</span>
                                                    </div>
                                                )}
                                                {additional > 0 && (
                                                    <div>
                                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-alert-rose)' }}>Minta dari Buyer</span>
                                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-alert-rose)' }}>{formatRupiah(additional)}</span>
                                                    </div>
                                                )}
                                                {refund === 0 && additional === 0 && (
                                                    <div>
                                                        <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-text-muted)' }}>Jumlah Pas</span>
                                                        <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>{formatRupiah(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" disabled={processing} className="w-full pa-btn pa-btn-secondary justify-center">
                                        {processing ? 'Menyimpan...' : 'Simpan & Hitung'}
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Total Belanja Aktual</span>
                                        <span className="pa-mono pa-headline-md" style={{ color: 'var(--pa-text-main)' }}>{formatRupiah(orderState.actual_amount)}</span>
                                    </div>
                                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                                        {orderState.refund_amount !== null && orderState.refund_amount > 0 ? (
                                            <div className="p-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                                <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-status-completed)' }}>Kembalikan ke Buyer (Refund)</span>
                                                <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-status-completed)' }}>{formatRupiah(orderState.refund_amount)}</span>
                                            </div>
                                        ) : orderState.additional_payment !== null && orderState.additional_payment > 0 ? (
                                            <div className="p-4" style={{ backgroundColor: 'rgba(225,29,72,0.1)' }}>
                                                <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-alert-rose)' }}>Minta dari Buyer</span>
                                                <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-alert-rose)' }}>{formatRupiah(orderState.additional_payment)}</span>
                                            </div>
                                        ) : (
                                            <div className="p-4" style={{ backgroundColor: 'var(--pa-surface-container)' }}>
                                                <span className="pa-label-caps block mb-1" style={{ color: 'var(--pa-text-muted)' }}>Jumlah Pas</span>
                                                <span className="pa-mono pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>{formatRupiah(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Existing Receipts Thumbnail */}
                            {orderState.receipts && orderState.receipts.length > 0 && (
                                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                    <span className="pa-label-caps block mb-3" style={{ color: 'var(--pa-text-muted)' }}>Nota Terunggah</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {orderState.receipts.map((r) => (
                                            <div key={r.id} className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-gray-200" onClick={() => setZoomedImage(r.image_url)}>
                                                <img src={r.image_url} alt="Nota" className="w-16 h-16 object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
