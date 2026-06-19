import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface User { id: number; name: string; email: string; }
interface Market { id: number; name: string; address: string; }
interface ChecklistItem { id: number; item_name: string; total_quantity: number; }
interface Order { id: number; order_number: string; estimated_amount: number; buyer: User; }
interface Checklist { id: number; status: string; market: Market; joki: User | null; items: ChecklistItem[]; orders: Order[]; }

export default function MasterChecklistDetail({ checklist }: { checklist: Checklist }) {
    const formatRupiah = (value: number | null) => value === null ? '-' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY_TO_SHOP': return { bg: 'rgba(249,115,22,0.1)', text: 'var(--pa-status-shopping)', icon: 'shopping_cart' };
            case 'SHOPPING': return { bg: 'rgba(16,185,129,0.1)', text: 'var(--pa-status-completed)', icon: 'directions_run' };
            case 'COMPLETED': return { bg: 'var(--pa-surface-container-low)', text: 'var(--pa-text-muted)', icon: 'task_alt' };
            default: return { bg: 'var(--pa-surface-variant)', text: 'var(--pa-text-muted)', icon: 'pending' };
        }
    };

    const statusInfo = getStatusStyle(checklist.status);

    return (
        <AuthenticatedLayout>
            <Head title={`Admin - Master Checklist #MC-${checklist.id}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('admin.checklists.index')} className="text-[var(--pa-text-muted)] hover:text-[var(--pa-primary)] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                            <span className="pa-body-sm font-semibold">Kembali ke Daftar Checklist</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>Detail Master Checklist</h1>
                        <span className="pa-mono pa-label-caps px-2 py-1 rounded" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                            #MC-{checklist.id}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full pa-label-caps" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{statusInfo.icon}</span>
                            {statusInfo.label}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-5 md:gap-8">
                    
                    {/* Market Info */}
                    <section className="pa-bento-card-static p-6">
                        <span className="pa-label-caps flex items-center gap-1" style={{ color: 'var(--pa-text-muted)', marginBottom: 12 }}>
                            <span className="material-symbols-outlined text-sm">storefront</span>
                            Pasar Tujuan Agregasi
                        </span>
                        <h3 className="pa-headline-md">{checklist.market.name}</h3>
                        <p className="pa-body-sm mt-1" style={{ color: 'var(--pa-text-muted)' }}>{checklist.market.address}</p>
                    </section>

                    {/* Aggregated Items */}
                    <section className="pa-bento-card-static p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="pa-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>receipt_long</span>
                                Bahan Belanja Teragregasi
                            </h3>
                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>
                                {checklist.items.length} Item
                            </span>
                        </div>

                        {checklist.items.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-surface-variant)' }}>remove_shopping_cart</span>
                                <p className="pa-body-sm mt-4" style={{ color: 'var(--pa-text-muted)' }}>Tidak ada item belanja teragregasi.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {checklist.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--pa-surface)', border: '1px solid var(--pa-surface-variant)' }}>
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_mall</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="pa-body-lg" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>
                                                {item.item_name}
                                            </div>
                                        </div>
                                        <div className="pa-mono pa-headline-md shrink-0 py-1 px-3 rounded-lg" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-main)' }}>
                                            {item.total_quantity}x
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5 md:gap-8">
                    
                    {/* Joki Assignment */}
                    <section className="pa-bento-card-static p-6">
                        <h3 className="pa-headline-md mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-status-assigned)' }}>two_wheeler</span>
                            Joki Penanggung Jawab
                        </h3>
                        {checklist.joki ? (
                            <div className="rounded-xl p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                <span className="material-symbols-outlined mt-0.5" style={{ color: 'var(--pa-text-muted)' }}>person</span>
                                <div>
                                    <div className="pa-body-sm" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>{checklist.joki.name}</div>
                                    <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{checklist.joki.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)' }}>
                                    <span className="material-symbols-outlined">person_search</span>
                                </div>
                                <span className="pa-body-sm italic" style={{ color: 'var(--pa-text-muted)' }}>Belum ditugaskan ke joki</span>
                            </div>
                        )}
                    </section>

                    {/* Linked Orders */}
                    <section className="pa-bento-card-static p-6">
                        <h3 className="pa-headline-md mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>link</span>
                            Pesanan Terkait
                        </h3>
                        <p className="pa-body-sm mb-6" style={{ color: 'var(--pa-text-muted)' }}>
                            Checklist ini menggabungkan belanjaan dari {checklist.orders.length} pesanan berikut:
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            {checklist.orders.map((order) => (
                                <Link 
                                    key={order.id} 
                                    href={route('admin.orders.show', order.id)}
                                    className="p-4 rounded-xl flex items-center justify-between hover:border-[var(--pa-primary)] transition-colors"
                                    style={{ border: '1px solid var(--pa-surface-variant)', backgroundColor: 'var(--pa-surface)' }}
                                >
                                    <div>
                                        <div className="pa-mono pa-label-caps mb-1" style={{ color: 'var(--pa-primary)' }}>{order.order_number}</div>
                                        <div className="pa-body-sm mb-1" style={{ color: 'var(--pa-text-main)', fontWeight: 600 }}>{order.buyer.name}</div>
                                        <div className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>{formatRupiah(order.estimated_amount)}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--pa-surface-container)' }}>
                                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-text-muted)' }}>arrow_forward</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
