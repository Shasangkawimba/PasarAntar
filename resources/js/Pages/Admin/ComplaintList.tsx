import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Complaint {
    id: number;
    order_id: number;
    order: {
        order_number: string;
    };
    buyer: {
        name: string;
    };
    reason: string;
    description: string;
    status: string;
    created_at: string;
}

export default function ComplaintList({ complaints }: { complaints: Complaint[] }) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Pengaduan" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg" style={{ color: 'var(--pa-text-main)' }}>Pengaduan Pelanggan</h1>
                    <p className="pa-body-lg mt-2" style={{ color: 'var(--pa-text-muted)' }}>Pantau dan selesaikan keluhan dari Buyer.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="pa-bento-card-static p-6 flex flex-col items-start justify-center">
                    <span className="pa-label-caps text-[var(--pa-text-muted)] mb-2">Total Pengaduan</span>
                    <span className="pa-headline-lg text-[var(--pa-text-main)]">{complaints.length}</span>
                </div>
                <div className="pa-bento-card-static p-6 flex flex-col items-start justify-center">
                    <span className="pa-label-caps text-[var(--pa-alert-rose)] mb-2">Pending (Perlu Diproses)</span>
                    <span className="pa-headline-lg text-[var(--pa-alert-rose)]">{complaints.filter(c => c.status === 'PENDING').length}</span>
                </div>
                <div className="pa-bento-card-static p-6 flex flex-col items-start justify-center">
                    <span className="pa-label-caps text-[var(--pa-status-completed)] mb-2">Resolved (Selesai)</span>
                    <span className="pa-headline-lg text-[var(--pa-status-completed)]">{complaints.filter(c => c.status === 'RESOLVED').length}</span>
                </div>
            </div>

            <div className="pa-bento-card-static overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-text-muted)', borderBottom: '1px solid var(--pa-outline)' }}>
                                <th className="p-4 pa-label-caps font-semibold">Waktu Pengaduan</th>
                                <th className="p-4 pa-label-caps font-semibold">No. Pesanan</th>
                                <th className="p-4 pa-label-caps font-semibold">Pelanggan</th>
                                <th className="p-4 pa-label-caps font-semibold">Alasan</th>
                                <th className="p-4 pa-label-caps font-semibold">Status</th>
                                <th className="p-4 pa-label-caps font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="pa-body-sm">
                            {complaints.length > 0 ? (
                                complaints.map((complaint) => (
                                    <tr key={complaint.id} className="transition-colors hover:bg-[var(--pa-surface-variant)]" style={{ borderBottom: '1px solid var(--pa-surface-variant)' }}>
                                        <td className="p-4 whitespace-nowrap text-[var(--pa-text-muted)]">{formatDate(complaint.created_at)}</td>
                                        <td className="p-4 whitespace-nowrap font-medium text-[var(--pa-text-main)]">{complaint.order.order_number}</td>
                                        <td className="p-4 whitespace-nowrap text-[var(--pa-text-muted)]">{complaint.buyer.name}</td>
                                        <td className="p-4 whitespace-nowrap text-[var(--pa-text-main)]">{complaint.reason}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="px-2 py-1 rounded pa-label-caps" style={{ 
                                                backgroundColor: complaint.status === 'RESOLVED' ? 'rgba(16,185,129,0.1)' 
                                                    : complaint.status === 'REJECTED' ? 'rgba(225,29,72,0.1)' 
                                                    : 'rgba(245,158,11,0.1)',
                                                color: complaint.status === 'RESOLVED' ? 'var(--pa-status-completed)' 
                                                    : complaint.status === 'REJECTED' ? 'var(--pa-alert-rose)' 
                                                    : 'var(--pa-status-shopping)'
                                            }}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-right">
                                            <Link href={route('admin.orders.show', complaint.order_id)} className="pa-btn pa-btn-sm pa-btn-secondary inline-flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                Lihat Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[var(--pa-text-muted)]">
                                        Tidak ada keluhan saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
