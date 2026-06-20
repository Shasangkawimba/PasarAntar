import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import Dialog from '@/Components/Dialog';

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

export default function AvailableOrders({ orders }: { orders: Order[] }) {
    const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; orderId: number | null }>({ show: false, orderId: null });

    const handleAssign = (orderId: number) => {
        setConfirmDialog({ show: true, orderId });
    };

    const confirmAssign = () => {
        if (confirmDialog.orderId) {
            router.post(route('joki.orders.assign', confirmDialog.orderId));
            setConfirmDialog({ show: false, orderId: null });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pesanan Tersedia" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Tugas Tersedia</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        {orders.length > 0 ? `Ada ${orders.length} pesanan baru menunggu Anda` : 'Belum ada pesanan baru'}
                    </p>
                </div>
            </div>

            {/* Hero Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                <div className="pa-bento-card md:col-span-8 p-5 md:p-8 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(105, 141, 53, 0.1)', color: 'var(--pa-primary)' }}>
                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>radar</span>
                            <span className="pa-label-caps">Radar Joki</span>
                        </div>
                        <h2 className="pa-headline-md leading-tight" style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}>
                            Ambil Pesanan Belanja,<br />
                            Bantu Tetangga Anda.
                        </h2>
                        <p className="pa-body-sm mt-3 max-w-lg" style={{ color: 'var(--pa-text-muted)' }}>
                            Pilih pesanan yang sesuai dengan lokasi Anda saat ini. Pastikan Anda dapat segera menuju ke pasar setelah menerima pesanan.
                        </p>
                    </div>
                </div>

                <div className="pa-bento-card md:col-span-4 p-5 md:p-6 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, rgba(249,115,22,0.08) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <span className="pa-label-caps" style={{ color: 'var(--pa-status-shopping)' }}>Panduan Joki</span>
                    <h3 className="pa-headline-md mt-2" style={{ fontSize: 'clamp(16px, 3vw, 20px)' }}>Prosedur Belanja</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)', fontSize: 10, fontWeight: 700 }}>1</div>
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Ambil pesanan &amp; mulai belanja.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)', fontSize: 10, fontWeight: 700 }}>2</div>
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Minta struk/nota dari kios.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)', fontSize: 10, fontWeight: 700 }}>3</div>
                            <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Upload nota &amp; input nominal.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>list_alt</span>
                <h2 className="pa-headline-md">Pesanan Siap Diproses</h2>
            </div>

            {orders.length === 0 ? (
                <div className="pa-state-card">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>inbox</span>
                    <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Tidak Ada Pesanan</h3>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Saat ini belum ada pesanan baru dari pembeli.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {orders.map((order) => (
                        <div key={order.id} className="pa-bento-card flex flex-col justify-between p-6">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16 }}>receipt_long</span>
                                        </div>
                                        <span className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>{order.order_number}</span>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Market Info */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-status-completed)' }}>storefront</span>
                                        <h3 className="pa-headline-md" style={{ fontSize: 16 }}>{order.market.name}</h3>
                                    </div>
                                    <p className="pa-body-sm ml-6" style={{ color: 'var(--pa-text-muted)' }}>{order.market.address}</p>
                                </div>

                                {/* Buyer Info */}
                                <div className="rounded-xl p-3 flex items-start gap-3 mb-4" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                    <span className="material-symbols-outlined mt-0.5" style={{ color: 'var(--pa-text-muted)' }}>person</span>
                                    <div>
                                        <div className="pa-body-sm" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>{order.buyer.name}</div>
                                        <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{order.buyer.phone_number || '-'}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                    <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', fontSize: 12 }}>{formatDate(order.created_at)}</span>
                                    <div className="text-right">
                                        <span className="pa-label-caps block" style={{ color: 'var(--pa-text-muted)', fontSize: 10 }}>Estimasi Dana</span>
                                        <span className="pa-button-text" style={{ color: 'var(--pa-status-completed)' }}>{formatRupiah(order.estimated_amount)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                <button
                                    type="button"
                                    onClick={() => handleAssign(order.id)}
                                    className="pa-btn pa-btn-primary pa-btn-full"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>task_alt</span>
                                    Ambil Kerja Belanja
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                show={confirmDialog.show}
                onClose={() => setConfirmDialog({ show: false, orderId: null })}
                title="Konfirmasi Pesanan"
                icon="help"
                iconColor="var(--pa-info-sky)"
            >
                <p>Apakah Anda yakin ingin mengambil pesanan ini? Anda akan bertanggung jawab untuk membelanjakan pesanan ini.</p>
                <div className="mt-6 flex justify-end gap-3 w-full">
                    <button type="button" onClick={() => setConfirmDialog({ show: false, orderId: null })} className="pa-btn pa-btn-ghost">
                        Batal
                    </button>
                    <button type="button" onClick={confirmAssign} className="pa-btn pa-btn-primary">
                        Ya, Ambil Pesanan
                    </button>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
