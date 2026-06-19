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

interface MasterChecklistListProps {
    checklists: Checklist[];
}

export default function MasterChecklistList({ checklists }: MasterChecklistListProps) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY_TO_SHOP':
                return { bg: '#e0f2fe', text: '#0369a1', label: 'SIAP BELANJA' };
            case 'SHOPPING':
                return { bg: '#f3e8ff', text: '#6b21a8', label: 'SEDANG BELANJA' };
            case 'COMPLETED':
                return { bg: '#d1fae5', text: '#059669', label: 'SELESAI' };
            default:
                return { bg: '#f3f4f6', text: '#4b5563', label: status };
        }
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Master Checklist Saya
                </h2>
            }
        >
            <Head title="Master Checklist Saya" />

            <div className="pa-body">
                <div className="pa-container">
                    <div className="pa-form-section">
                        <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem' }}>Daftar Belanja Gabungan</h3>
                        <p className="pa-subtitle pa-mb-6">Daftar barang gabungan yang mempermudah belanja beberapa pesanan sekaligus di pasar.</p>

                        {checklists.length === 0 ? (
                            <div className="pa-state-card">
                                <div className="pa-state-icon">🛒</div>
                                <h4 className="pa-state-title">Tidak ada Master Checklist</h4>
                                <p className="pa-subtitle">Anda belum memiliki Master Checklist belanja yang terbuat.</p>
                            </div>
                        ) : (
                            <div className="pa-table-container">
                                <table className="pa-table">
                                    <thead>
                                        <tr>
                                            <th>Checklist ID</th>
                                            <th>Pasar Tujuan</th>
                                            <th>Jumlah Pesanan</th>
                                            <th>Status</th>
                                            <th>Tanggal Pembuatan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checklists.map((checklist) => {
                                            const statusInfo = getStatusStyle(checklist.status);
                                            return (
                                                <tr key={checklist.id}>
                                                    <td className="pa-font-bold">#MC-{checklist.id}</td>
                                                    <td className="pa-font-bold">{checklist.market.name}</td>
                                                    <td>{checklist.orders_count} Pesanan</td>
                                                    <td>
                                                        <span
                                                            style={{
                                                                display: 'inline-flex',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold',
                                                                backgroundColor: statusInfo.bg,
                                                                color: statusInfo.text,
                                                            }}
                                                        >
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="pa-subtitle">{formatDate(checklist.created_at)}</td>
                                                    <td>
                                                        <Link
                                                            href={route('joki.checklists.show', checklist.id)}
                                                            className="pa-btn pa-btn-secondary pa-btn-sm"
                                                            style={{ minHeight: '32px', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            Buka Checklist
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
