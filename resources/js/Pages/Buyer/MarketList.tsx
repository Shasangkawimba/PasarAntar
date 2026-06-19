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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pilih Pasar Tradisional
                </h2>
            }
        >
            <Head title="Pilih Pasar" />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-header">
                        <div>
                            <h1 className="pa-title">Daftar Pasar</h1>
                            <p className="pa-subtitle">Pilih pasar tradisional terdekat untuk mulai berbelanja harian</p>
                        </div>
                    </div>

                    {markets.length === 0 ? (
                        <div className="pa-state-card">
                            <div className="pa-state-icon">🏪</div>
                            <h3 className="pa-state-title">Tidak Ada Pasar Aktif</h3>
                            <p>Saat ini belum ada pasar tradisional yang aktif di sistem.</p>
                        </div>
                    ) : (
                        <div className="pa-market-grid">
                            {markets.map((market) => (
                                <div key={market.id} className="pa-market-card">
                                    <div>
                                        <h3 className="pa-market-name">{market.name}</h3>
                                        <p className="pa-market-address">{market.address}</p>
                                    </div>
                                    <Link
                                        href={route('orders.create', market.id)}
                                        className="pa-btn pa-btn-primary"
                                        style={{ width: '100%', marginTop: '1rem' }}
                                    >
                                        Pilih Pasar & Mulai
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
