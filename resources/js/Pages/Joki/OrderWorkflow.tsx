import React, { useState } from 'react';
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
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        actual_amount: order.actual_amount !== null ? order.actual_amount.toString() : '',
        receipt: null as File | null,
    });

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
    const canComplete = order.receipts && order.receipts.length > 0 && order.actual_amount !== null;

    const handleStatusUpdate = () => {
        if (!action) return;
        if (action.nextStatus === 'COMPLETED' && !canComplete) {
            alert('Anda harus mengisi total belanja riil dan mengunggah foto nota belanja terlebih dahulu sebelum menyelesaikan pesanan.');
            return;
        }
        if (confirm(action.confirmMessage)) {
            router.post(route('joki.orders.status', order.id), {
                status: action.nextStatus,
            });
        }
    };

    const handleSubmitSettlement = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('joki.orders.settle', order.id), {
            forceFormData: true,
            onSuccess: () => {
                setReceiptPreview(null);
                reset('receipt');
            },
        });
    };

    // Real-time calculations for frontend preview
    const estimated = order.estimated_amount;
    const actual = parseInt(data.actual_amount) || 0;
    let refund = 0;
    let additional = 0;

    if (data.actual_amount !== '') {
        if (estimated > actual) {
            refund = estimated - actual;
        } else if (actual > estimated) {
            additional = actual - estimated;
        }
    }

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

                        {/* Right Column: Cost Summary & Action & Settlement Form */}
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
                                    <span className={order.actual_amount !== null ? 'pa-font-bold' : 'pa-subtitle'}>
                                        {formatRupiah(order.actual_amount)}
                                    </span>
                                </div>

                                {order.actual_amount !== null && (
                                    <>
                                        {order.refund_amount !== null && order.refund_amount > 0 && (
                                            <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)', color: 'var(--pa-primary-dark)' }}>
                                                <span className="pa-subtitle" style={{ color: 'var(--pa-primary-dark)' }}>Selisih Kembalian (Refund)</span>
                                                <span className="pa-font-bold">{formatRupiah(order.refund_amount)}</span>
                                            </div>
                                        )}
                                        {order.additional_payment !== null && order.additional_payment > 0 && (
                                            <div className="pa-flex-between pa-mt-2" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--pa-border)', color: 'var(--pa-danger)' }}>
                                                <span className="pa-subtitle" style={{ color: 'var(--pa-danger)' }}>Kurang Bayar (Additional)</span>
                                                <span className="pa-font-bold">{formatRupiah(order.additional_payment)}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Settlement Form (Only during SHOPPING or DELIVERING) */}
                            {(order.status === 'SHOPPING' || order.status === 'DELIVERING') && (
                                <form onSubmit={handleSubmitSettlement} className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Penyelesaian Belanja</h3>

                                    <div className="pa-form-group">
                                        <label className="pa-form-label" htmlFor="actual_amount">
                                            Total Belanja Riil (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            id="actual_amount"
                                            name="actual_amount"
                                            className="pa-input-text"
                                            placeholder="Masukkan total belanja fisik"
                                            value={data.actual_amount}
                                            onChange={e => setData('actual_amount', e.target.value)}
                                            min="0"
                                            required
                                        />
                                        {errors.actual_amount && (
                                            <p className="pa-subtitle pa-mt-1" style={{ color: 'var(--pa-danger)' }}>{errors.actual_amount}</p>
                                        )}
                                    </div>

                                    <div className="pa-form-group">
                                        <label className="pa-form-label" htmlFor="receipt">
                                            Foto Nota Belanja
                                        </label>
                                        <input
                                            type="file"
                                            id="receipt"
                                            name="receipt"
                                            className="pa-input-text"
                                            accept="image/*"
                                            onChange={e => {
                                                const files = e.target.files;
                                                if (files && files.length > 0) {
                                                    setData('receipt', files[0]);
                                                    setReceiptPreview(URL.createObjectURL(files[0]));
                                                }
                                            }}
                                            required={!order.receipts || order.receipts.length === 0}
                                        />
                                        {errors.receipt && (
                                            <p className="pa-subtitle pa-mt-1" style={{ color: 'var(--pa-danger)' }}>{errors.receipt}</p>
                                        )}
                                    </div>

                                    {/* Local File Preview */}
                                    {receiptPreview && (
                                        <div className="pa-mb-4">
                                            <span className="pa-subtitle">Preview Nota Baru:</span>
                                            <div style={{ marginTop: '0.25rem' }}>
                                                <img
                                                    src={receiptPreview}
                                                    alt="Preview Nota"
                                                    style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '0.5rem', border: '1px solid var(--pa-border)', objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Existing Receipts Thumbnail */}
                                    {order.receipts && order.receipts.length > 0 && (
                                        <div className="pa-mb-4">
                                            <span className="pa-subtitle">Nota Terunggah:</span>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                                {order.receipts.map((r) => (
                                                    <img
                                                        key={r.id}
                                                        src={r.image_url}
                                                        alt="Nota Terunggah"
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid var(--pa-border)', cursor: 'pointer' }}
                                                        onClick={() => setZoomedImage(r.image_url)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Live Settlement Calculation Preview */}
                                    {data.actual_amount !== '' && (
                                        <div className="pa-mb-4" style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: refund > 0 ? '#ecfdf5' : additional > 0 ? '#fef2f2' : '#f9fafb', border: '1px solid', borderColor: refund > 0 ? '#10b981' : additional > 0 ? '#ef4444' : 'var(--pa-border)' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: refund > 0 ? '#047857' : additional > 0 ? '#b91c1c' : 'var(--pa-text-muted)', marginBottom: '0.25rem' }}>
                                                ESTIMASI SELISIH (PREVIEW SEBELUM DISIMPAN)
                                            </div>
                                            <div className="pa-flex-between" style={{ fontSize: '0.875rem' }}>
                                                <span>Estimasi Deposito:</span>
                                                <span className="pa-font-bold">{formatRupiah(estimated)}</span>
                                            </div>
                                            <div className="pa-flex-between pa-mt-1" style={{ fontSize: '0.875rem' }}>
                                                <span>Belanja Riil:</span>
                                                <span className="pa-font-bold">{formatRupiah(actual)}</span>
                                            </div>
                                            {refund > 0 && (
                                                <div className="pa-flex-between pa-mt-2" style={{ color: '#047857', borderTop: '1px dashed #10b981', paddingTop: '0.5rem' }}>
                                                    <span>Kembalian ke Buyer:</span>
                                                    <span className="pa-font-bold">{formatRupiah(refund)}</span>
                                                </div>
                                            )}
                                            {additional > 0 && (
                                                <div className="pa-flex-between pa-mt-2" style={{ color: '#b91c1c', borderTop: '1px dashed #ef4444', paddingTop: '0.5rem' }}>
                                                    <span>Kurang Bayar (Joki):</span>
                                                    <span className="pa-font-bold">{formatRupiah(additional)}</span>
                                                </div>
                                            )}
                                            {refund === 0 && additional === 0 && (
                                                <div className="pa-flex-between pa-mt-2" style={{ color: 'var(--pa-text-muted)', borderTop: '1px dashed var(--pa-border)', paddingTop: '0.5rem' }}>
                                                    <span>Jumlah Pas:</span>
                                                    <span className="pa-font-bold">{formatRupiah(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="pa-btn pa-btn-secondary"
                                        style={{ width: '100%', minHeight: '40px' }}
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Nota & Settlement'}
                                    </button>
                                </form>
                            )}

                            {/* Action Button for Workflow Progress */}
                            {action && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Aksi Selanjutnya</h3>
                                    
                                    {action.nextStatus === 'COMPLETED' && !canComplete && (
                                        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #d97706', color: '#92400e', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            ⚠️ Selesaikan form <strong>Penyelesaian Belanja</strong> terlebih dahulu (input nominal riil belanja & unggah foto nota belanja) sebelum dapat menyelesaikan pesanan.
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        className="pa-btn pa-btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={action.nextStatus === 'COMPLETED' && !canComplete}
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
                                        <p className="pa-subtitle pa-mt-2 font-medium text-emerald-800">Pesanan ini telah diselesaikan dan nota belanja telah disimpan.</p>
                                    </div>
                                </div>
                            )}

                            {/* Receipt Image Thumbnail (Read Only when COMPLETED) */}
                            {order.status === 'COMPLETED' && order.receipts && order.receipts.length > 0 && (
                                <div className="pa-form-section pa-mt-4">
                                    <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1rem' }}>Nota Terlampir</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {order.receipts.map((r) => (
                                            <img
                                                key={r.id}
                                                src={r.image_url}
                                                alt="Nota Belanja"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--pa-border)', cursor: 'pointer' }}
                                                onClick={() => setZoomedImage(r.image_url)}
                                            />
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
