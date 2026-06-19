import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Market {
    id: number;
    name: string;
}

interface Checklist {
    id: number;
    market_id: number;
    assigned_joki_id: number | null;
    status: string;
    created_at: string;
    orders_count: number;
    market: Market;
}

export default function MasterChecklistList({ checklists }: { checklists: Checklist[] }) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY_TO_SHOP': return { bg: 'rgba(249,115,22,0.1)', text: 'var(--pa-status-shopping)', icon: 'shopping_cart' };
            case 'SHOPPING': return { bg: 'rgba(16,185,129,0.1)', text: 'var(--pa-status-completed)', icon: 'directions_run' };
            case 'COMPLETED': return { bg: 'var(--pa-surface-container-low)', text: 'var(--pa-text-muted)', icon: 'task_alt' };
            default: return { bg: 'var(--pa-surface-variant)', text: 'var(--pa-text-muted)', icon: 'pending' };
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AuthenticatedLayout>
            <Head title="Master Checklist" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Master Checklist</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        {checklists.length > 0 ? `Terdapat ${checklists.length} daftar belanja gabungan` : 'Daftar belanja gabungan kosong'}
                    </p>
                </div>
            </div>

            {/* Hero Row */}
            <div className="pa-bento-card mb-8 p-6 md:p-8 flex flex-col justify-between"
                style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}
            >
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                        <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>view_list</span>
                        <span className="pa-label-caps">Fitur Agregasi</span>
                    </div>
                    <h2 className="pa-headline-md mb-3" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
                        Belanja lebih cerdas dengan<br />
                        daftar gabungan.
                    </h2>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                        Daftar agregasi bahan belanjaan menggabungkan barang yang sama dari beberapa pesanan sekaligus, sehingga Anda tidak perlu bolak-balik ke kios yang sama di pasar.
                    </p>
                </div>
            </div>

            {/* List Section */}
            <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>receipt_long</span>
                <h2 className="pa-headline-md">Daftar Master Checklist Anda</h2>
            </div>

            {checklists.length === 0 ? (
                <div className="pa-state-card">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>list_alt_add</span>
                    <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Checklist</h3>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Anda belum ditugaskan ke Master Checklist belanja saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {checklists.map((checklist) => {
                        const statusStyle = getStatusStyle(checklist.status);
                        
                        return (
                            <Link key={checklist.id} href={route('joki.checklists.show', checklist.id)} className="pa-bento-card flex flex-col justify-between p-6 hover:border-[var(--pa-primary)] transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                                                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16 }}>format_list_bulleted</span>
                                            </div>
                                            <span className="pa-mono pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>#MC-{checklist.id}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full pa-label-caps" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{statusStyle.icon}</span>
                                            {checklist.status.replace(/_/g, ' ')}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-status-completed)' }}>storefront</span>
                                            <h3 className="pa-headline-md" style={{ fontSize: 16 }}>{checklist.market.name}</h3>
                                        </div>
                                    </div>

                                    <div className="rounded-xl p-3 flex items-center gap-3 mb-4" style={{ backgroundColor: 'var(--pa-surface-container-low)', border: '1px solid var(--pa-surface-variant)' }}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--pa-surface-variant)' }}>
                                            <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-text-muted)' }}>shopping_bag</span>
                                        </div>
                                        <div>
                                            <div className="pa-body-sm" style={{ fontWeight: 600, color: 'var(--pa-text-main)' }}>{checklist.orders_count} Pesanan Digabung</div>
                                            <div className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>Efisien Waktu & Tenaga</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                    <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', fontSize: 12 }}>Dibuat: {formatDate(checklist.created_at)}</span>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>arrow_forward</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
