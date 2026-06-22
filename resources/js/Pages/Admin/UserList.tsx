import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_number: string | null;
    is_active: boolean;
    created_at: string;
}

export default function UserList({ users }: { users: User[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const toggleStatus = (user: User) => {
        router.patch(route('admin.users.toggle', user.id), {}, { preserveScroll: true });
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Pengguna" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Kelola Pengguna</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>Kelola status keaktifan dan tangguhkan akun jika ada pelanggaran</p>
                </div>
            </div>

            <div className="pa-bento-card p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="pa-headline-md flex items-center gap-2 m-0">
                        <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>group</span>
                        Daftar Pengguna
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center w-full md:w-auto gap-3">
                        <div className="relative w-full sm:w-auto">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 20 }}>search</span>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-11"
                                style={{
                                    borderRadius: 'var(--pa-radius-input)',
                                    border: '1px solid var(--pa-outline-variant)',
                                    fontSize: '0.875rem',
                                    paddingLeft: '2.5rem'
                                }}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="py-2 w-full sm:w-auto border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-11"
                            style={{
                                borderRadius: 'var(--pa-radius-input)',
                                border: '1px solid var(--pa-outline-variant)',
                                fontSize: '0.875rem',
                                paddingLeft: '1rem',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="all">Semua Peran</option>
                            <option value="buyer">Buyer</option>
                            <option value="joki">Joki</option>
                        </select>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="pa-state-card border-0 rounded-none">
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>person_off</span>
                        <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Pengguna Tidak Ditemukan</h3>
                        <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Coba sesuaikan kata kunci pencarian atau filter peran Anda.</p>
                    </div>
                ) : (
                    <div>
                        {/* Mobile Card View */}
                        <div className="block md:hidden border-t border-gray-100">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className={`p-5 border-b border-gray-100 transition-colors ${!user.is_active ? 'bg-rose-50/50' : 'bg-white hover:bg-slate-50'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg mb-0.5">{user.name}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 mt-1">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                                                    Ditangguhkan
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-5 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Peran</div>
                                            <span style={{
                                                fontSize: 11,
                                                padding: '3px 10px',
                                                backgroundColor: user.role === 'joki' ? 'var(--pa-surface-container)' : 'var(--pa-surface-variant)',
                                                color: user.role === 'joki' ? 'var(--pa-primary)' : 'var(--pa-text-main)',
                                                borderRadius: 12,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kontak</div>
                                            <div className="pa-mono text-sm font-semibold text-slate-700">{user.phone_number || '-'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bergabung Sejak</div>
                                            <div className="text-sm font-semibold text-slate-700">{formatDate(user.created_at)}</div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => toggleStatus(user)}
                                        className={`pa-btn pa-btn-full flex justify-center items-center gap-2 ${user.is_active ? 'pa-btn-outline' : 'pa-btn-primary'}`}
                                        style={user.is_active ? { color: 'var(--pa-alert-red)', borderColor: 'var(--pa-alert-red)' } : {}}
                                    >
                                        {user.is_active ? 'Tangguhkan Akun' : 'Aktifkan Akun'}
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                            {user.is_active ? 'block' : 'check_circle'}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block pa-table-container border-0 shadow-none rounded-none">
                            <table className="pa-table">
                                <thead>
                                    <tr>
                                        <th>Pengguna</th>
                                        <th>Peran</th>
                                        <th>Kontak</th>
                                        <th>Bergabung</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className={!user.is_active ? 'bg-red-50/30' : ''}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{user.email}</div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontSize: 10,
                                                    padding: '2px 8px',
                                                    backgroundColor: user.role === 'joki' ? 'var(--pa-surface-container)' : 'var(--pa-surface-variant)',
                                                    color: user.role === 'joki' ? 'var(--pa-primary)' : 'var(--pa-text-main)',
                                                    borderRadius: 12,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="pa-mono pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                                {user.phone_number || '-'}
                                            </td>
                                            <td className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="text-center">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Ditangguhkan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => toggleStatus(user)}
                                                    className={`pa-btn pa-btn-sm inline-flex ${user.is_active ? 'pa-btn-outline border-red-200 text-red-600 hover:bg-red-50' : 'pa-btn-primary'}`}
                                                    style={user.is_active ? { color: 'var(--pa-alert-red)', borderColor: 'var(--pa-alert-red)' } : {}}
                                                >
                                                    {user.is_active ? 'Tangguhkan' : 'Aktifkan'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
