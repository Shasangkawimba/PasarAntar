import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface Market {
    id: number;
    name: string;
    address: string;
    is_active: boolean;
}

export default function MarketList({ markets }: { markets: Market[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(route('admin.markets.store'), {
            onSuccess: () => {
                reset();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const toggleStatus = (market: Market) => {
        router.patch(route('admin.markets.toggle', market.id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Pasar" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Kelola Pasar</h1>
                    <p className="pa-body-lg mt-1" style={{ color: 'var(--pa-text-muted)' }}>Tambah dan kelola status wilayah operasional pasar</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Market Form */}
                <div className="lg:col-span-1">
                    <div className="pa-bento-card p-6 sticky top-6">
                        <h2 className="pa-headline-md mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>add_business</span>
                            Tambah Pasar Baru
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Pasar" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="off"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="address" value="Alamat Lengkap" />
                                <textarea
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows={3}
                                    onChange={(e) => setData('address', e.target.value)}
                                    style={{
                                        borderRadius: 'var(--pa-radius-input)',
                                        border: '1px solid var(--pa-outline-variant)',
                                        padding: '0.75rem',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="pt-2">
                                <PrimaryButton className="w-full justify-center" disabled={processing || isSubmitting}>
                                    {processing ? 'Menyimpan...' : 'Simpan Pasar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Markets List */}
                <div className="lg:col-span-2">
                    <div className="pa-bento-card p-0 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="pa-headline-md flex items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--pa-primary)' }}>storefront</span>
                                    Daftar Pasar
                                </h2>
                            </div>
                        </div>

                        {markets.length === 0 ? (
                            <div className="pa-state-card border-0 rounded-none">
                                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--pa-outline)', marginBottom: 16 }}>store_off</span>
                                <h3 className="pa-headline-md" style={{ marginBottom: 8 }}>Belum Ada Pasar</h3>
                                <p className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>Tambahkan pasar pertama Anda melalui form di samping.</p>
                            </div>
                        ) : (
                            <div className="pa-table-container border-0 shadow-none rounded-none">
                                <table className="pa-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama Pasar</th>
                                            <th>Alamat</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {markets.map((market) => (
                                            <tr key={market.id}>
                                                <td className="pa-mono" style={{ color: 'var(--pa-text-muted)' }}>#{market.id}</td>
                                                <td style={{ fontWeight: 600 }}>{market.name}</td>
                                                <td className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>{market.address}</td>
                                                <td className="text-center">
                                                    {market.is_active ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => toggleStatus(market)}
                                                        className={`pa-btn pa-btn-sm inline-flex ${market.is_active ? 'pa-btn-outline border-red-200 text-red-600 hover:bg-red-50' : 'pa-btn-primary'}`}
                                                        style={market.is_active ? { color: 'var(--pa-alert-red)', borderColor: 'var(--pa-alert-red)' } : {}}
                                                    >
                                                        {market.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
