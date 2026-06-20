import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Dialog from '@/Components/Dialog';
import Toast from '@/Components/Toast';
import { useState } from 'react';

interface User { id: number; name: string; email: string; }
interface Market { id: number; name: string; }
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

export default function MasterChecklistList({ checklists }: { checklists: Checklist[] }) {
    const { flash } = usePage().props as any;
    
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'info'|'success'|'error' }>({ show: false, message: '', type: 'info' });
    const [confirmDialog, setConfirmDialog] = useState(false);

    const handleGenerate = () => {
        setConfirmDialog(true);
    };

    const confirmGenerate = () => {
        router.post(route('admin.checklists.generate'), {}, { 
            onSuccess: () => {
                setToast({ show: true, message: 'Proses agregasi dimulai di antrean latar belakang.', type: 'success' });
            } 
        });
        setConfirmDialog(false);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'READY_TO_SHOP': return { bg: 'rgba(249,115,22,0.1)', text: 'var(--pa-status-shopping)', icon: 'shopping_cart', label: 'Siap Belanja' };
            case 'SHOPPING': return { bg: 'rgba(16,185,129,0.1)', text: 'var(--pa-status-completed)', icon: 'directions_run', label: 'Sedang Belanja' };
            case 'COMPLETED': return { bg: 'var(--pa-surface-container-low)', text: 'var(--pa-text-muted)', icon: 'task_alt', label: 'Selesai' };
            default: return { bg: 'var(--pa-surface-variant)', text: 'var(--pa-text-muted)', icon: 'pending', label: 'Pending' };
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Master Checklist" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Master Checklist</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>Pantau dan jalankan agregasi belanja</p>
                </div>
                <button type="button" onClick={handleGenerate} className="pa-btn pa-btn-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_circle</span>
                    Jalankan Agregasi
                </button>
            </div>

            {flash?.success && (
                <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--pa-status-completed)' }}>check_circle</span>
                    <span className="pa-body-sm font-semibold" style={{ color: 'var(--pa-status-completed)' }}>{flash.success}</span>
                </div>
            )}

            <div className="pa-bento-card p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="pa-headline-md flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>list_alt</span>
                            Daftar Master Checklist
                        </h2>
                    </div>
                </div>

                {checklists.length === 0 ? (
                    <div className="pa-state-card border-0 rounded-none">
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>library_add</span>
                        <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Master Checklist</h3>
                        <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)', marginBottom: 16 }}>Klik tombol "Jalankan Agregasi" untuk memproses order.</p>
                        <button type="button" onClick={handleGenerate} className="pa-btn pa-btn-primary">Jalankan Sekarang</button>
                    </div>
                ) : (
                    <div className="pa-table-container border-0 shadow-none rounded-none">
                        <table className="pa-table">
                            <thead>
                                <tr>
                                    <th>ID Checklist</th>
                                    <th>Pasar Tujuan</th>
                                    <th>Joki Ditugaskan</th>
                                    <th>Total Order</th>
                                    <th>Status</th>
                                    <th>Tanggal Dibuat</th>
                                    <th className="text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklists.map((checklist) => {
                                    const statusInfo = getStatusStyle(checklist.status);
                                    return (
                                        <tr key={checklist.id}>
                                            <td className="pa-mono" style={{ fontWeight: 700 }}>#MC-{checklist.id}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm" style={{ color: 'var(--pa-status-completed)' }}>storefront</span>
                                                    <span style={{ fontWeight: 600 }}>{checklist.market.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{checklist.joki ? checklist.joki.name : <span className="italic" style={{ color: 'var(--pa-text-muted)' }}>Belum Ditugaskan</span>}</td>
                                            <td style={{ fontWeight: 600 }}>{checklist.orders_count} Pesanan</td>
                                            <td>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full pa-label-caps" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{statusInfo.icon}</span>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="pa-mono pa-body-sm text-gray-500">{formatDate(checklist.created_at)}</td>
                                            <td className="text-right">
                                                <Link href={route('admin.checklists.show', checklist.id)} className="pa-btn pa-btn-secondary pa-btn-sm inline-flex">
                                                    Detail
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

            <Dialog
                show={confirmDialog}
                onClose={() => setConfirmDialog(false)}
                title="Jalankan Agregasi?"
                icon="info"
                iconColor="var(--pa-primary)"
            >
                <p>Jalankan proses agregasi pesanan untuk menghasilkan Master Checklist baru?</p>
                <div className="mt-6 flex justify-end gap-3 w-full">
                    <button type="button" onClick={() => setConfirmDialog(false)} className="pa-btn pa-btn-ghost">
                        Batal
                    </button>
                    <button type="button" onClick={confirmGenerate} className="pa-btn pa-btn-primary">
                        Ya, Jalankan
                    </button>
                </div>
            </Dialog>

            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />
        </AuthenticatedLayout>
    );
}
