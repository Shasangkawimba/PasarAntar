import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Market {
    id: number;
    name: string;
    address: string;
    is_active: boolean;
}

interface MarketListProps {
    markets: Market[];
}

export default function MarketList({ markets }: MarketListProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Pilih Pasar" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>
                        Pilih Pasar Tradisional
                    </h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        Pilih pasar dan mulai tulis daftar belanja Anda
                    </p>
                </div>
            </div>

            {/* Hero Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                <div
                    className="pa-bento-card md:col-span-8 p-6 md:p-8 flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-surface-container-lowest) 100%)` }}
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>storefront</span>
                            <span className="pa-label-caps">Personal Grocery Shopper</span>
                        </div>
                        <h2 style={{ fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--pa-text-main)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                            Bahan Makanan Segar,<br />
                            Dibelanjakan Secara Personal.
                        </h2>
                        <p className="pa-body-sm mt-3" style={{ color: 'var(--pa-text-muted)', maxWidth: 480 }}>
                            Pasar Antar menghubungkan Anda dengan Joki Pasar lokal terpercaya untuk berbelanja sayur, daging, dan bumbu langsung dari pasar tradisional.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                        <span className="w-3 h-3 rounded-full pa-pulse-dot" style={{ backgroundColor: 'var(--pa-status-completed)' }} />
                        <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>Joki Siap Membantu Anda</span>
                    </div>
                </div>

                <div className="pa-bento-card md:col-span-4 p-6 flex flex-col justify-between" style={{ background: `linear-gradient(135deg, var(--pa-tertiary-fixed, #ffddb8) 0%, var(--pa-surface-container-lowest) 100%)` }}>
                    <div>
                        <span className="pa-label-caps" style={{ color: 'var(--pa-tertiary)' }}>Cara Kerja</span>
                        <h3 className="pa-headline-md mt-2">Mudah &amp; Transparan</h3>
                        <div className="space-y-3 mt-4">
                            {[
                                { n: '1', text: 'Pilih pasar tradisional terdekat.' },
                                { n: '2', text: 'Input item belanjaan & estimasi biaya.' },
                                { n: '3', text: 'Joki belanja, selisih dihitung akurat.' },
                            ].map((s) => (
                                <div key={s.n} className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(130,81,0,0.1)', color: 'var(--pa-tertiary)', fontSize: 10, fontWeight: 700 }}>{s.n}</div>
                                    <span className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{s.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(130,81,0,0.15)' }}>
                        <span className="pa-label-caps" style={{ color: 'var(--pa-tertiary)', fontSize: 10 }}>Garansi Kesegaran Bahan</span>
                    </div>
                </div>
            </div>

            {/* Markets Header */}
            <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>explore</span>
                <h2 className="pa-headline-md">Mitra Pasar Tradisional</h2>
            </div>

            {/* Markets Grid */}
            {markets.length === 0 ? (
                <div className="pa-state-card">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>store</span>
                    <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Tidak Ada Pasar Aktif</h3>
                    <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Saat ini belum ada pasar tradisional yang aktif.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {markets.map((market) => (
                        <div key={market.id} className="pa-bento-card flex flex-col justify-between p-6 group">
                            <div>
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                                                <span className="material-symbols-outlined icon-fill">store</span>
                                            </div>
                                            <span className="pa-badge pa-badge-completed">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--pa-status-completed)' }} />
                                                Buka
                                            </span>
                                        </div>
                                        <h3 className="pa-headline-md" style={{ fontSize: 18 }}>{market.name}</h3>
                                        <p className="pa-body-sm mt-1 flex items-center gap-1" style={{ color: 'var(--pa-text-muted)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                                            {market.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                <Link
                                    href={route('orders.create', market.id)}
                                    className="pa-btn pa-btn-primary pa-btn-full"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_basket</span>
                                    Pilih &amp; Mulai Belanja
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
