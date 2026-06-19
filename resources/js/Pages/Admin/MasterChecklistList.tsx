import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

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
    joki: User | null;
}

interface MasterChecklistListProps {
    checklists: Checklist[];
}

export default function MasterChecklistList({ checklists }: MasterChecklistListProps) {
    const { flash } = usePage().props as any;

    const handleGenerate = () => {
        if (confirm('Jalankan proses agregasi pesanan untuk menghasilkan Master Checklist baru?')) {
            router.post(route('admin.checklists.generate'), {}, {
                onSuccess: () => {
                    alert('Proses agregasi dimulai di antrean latar belakang.');
                }
            });
        }
    };

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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Master Checklist (Admin)
                    </h2>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="pa-btn pa-btn-primary pa-btn-sm"
                        style={{ minHeight: '36px' }}
                    >
                        Generate Checklist
                    </button>
                </div>
            }
        >
            <Head title="Admin - Master Checklist" />

            <div className="pa-body">
                <div className="pa-container">
                    {flash?.success && (
                        <div style={{ padding: '1rem', backgroundColor: 'var(--pa-primary-light)', border: '1px solid var(--pa-primary)', color: 'var(--pa-primary-dark)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                            {flash.success}
                        </div>
                    )}

                    <div className="pa-form-section">
                        <h3 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem' }}>Daftar Master Checklist</h3>

                        {checklists.length === 0 ? (
                            <div className="pa-state-card">
                                <div className="pa-state-icon">📋</div>
                                <h4 className="pa-state-title">Belum ada Master Checklist</h4>
                                <p className="pa-subtitle">Silakan klik "Generate Checklist" untuk memproses pesanan Joki berstatus ASSIGNED.</p>
                            </div>
                        ) : (
                            <div className="pa-table-container">
                                <table className="pa-table">
                                    <thead>
                                        <tr>
                                            <th>Checklist ID</th>
                                            <th>Pasar</th>
                                            <th>Joki Terpenuhi</th>
                                            <th>Total Pesanan</th>
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
                                                    <td>{checklist.joki ? checklist.joki.name : 'Belum Ditugaskan'}</td>
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
                                                            href={route('admin.checklists.show', checklist.id)}
                                                            className="pa-btn pa-btn-secondary pa-btn-sm"
                                                            style={{ minHeight: '32px', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            Lihat Rincian
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
