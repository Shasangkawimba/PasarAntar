import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

interface Market {
    id: number;
    name: string;
    address: string;
}

interface CreateOrderProps {
    market: Market;
}

interface OrderItemInput {
    product_name: string;
    quantity: number;
    notes: string;
}

export default function CreateOrder({ market }: CreateOrderProps) {
    const { data, setData, post, processing, errors } = useForm({
        market_id: market.id,
        estimated_amount: '',
        items: [{ product_name: '', quantity: 1, notes: '' }] as OrderItemInput[],
    });

    const handleAddItem = () => {
        setData('items', [...data.items, { product_name: '', quantity: 1, notes: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const handleItemChange = (index: number, field: keyof OrderItemInput, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleIncrementQty = (index: number) => handleItemChange(index, 'quantity', (data.items[index].quantity || 0) + 1);
    const handleDecrementQty = (index: number) => handleItemChange(index, 'quantity', Math.max(1, (data.items[index].quantity || 1) - 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    const totalItems = data.items.length;

    return (
        <AuthenticatedLayout>
            <Head title="Buat Pesanan" />

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href={route('markets.index')} className="text-[var(--pa-text-muted)] hover:text-[var(--pa-primary)] transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                        <span className="pa-body-sm font-semibold">Kembali ke Pasar</span>
                    </Link>
                </div>
                <h1 className="pa-headline-lg pa-headline-lg-mobile md:pa-headline-lg">Buat Pesanan Baru</h1>
                <p className="pa-body-lg mt-2" style={{ color: 'var(--pa-text-muted)' }}>
                    Tuliskan daftar belanja Anda di <strong style={{ color: 'var(--pa-text-main)' }}>{market.name}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
                    
                    {/* Left Column: Form Steps (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-5 md:gap-8">
                        
                        {/* Step 1: Market Selected (Static Card) */}
                        <section className="pa-bento-card-static p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--pa-status-completed)', color: 'white' }}>
                                    <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16 }}>check</span>
                                </div>
                                <div>
                                    <h3 className="pa-headline-md">Pasar Terpilih</h3>
                                    <p className="pa-body-sm mt-0.5" style={{ color: 'var(--pa-text-muted)' }}>{market.name} — {market.address}</p>
                                </div>
                            </div>
                            <Link href={route('markets.index')} className="pa-btn pa-btn-secondary pa-btn-sm shrink-0">
                                Ganti Pasar
                            </Link>
                        </section>

                        {/* Step 2: Item List */}
                        <section className="pa-bento-card-static p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--pa-primary-container)', color: 'var(--pa-on-primary-container)' }}>
                                        2
                                    </div>
                                    <h3 className="pa-headline-md">Daftar Belanja</h3>
                                </div>
                            </div>

                            {errors.items && <div className="mb-4"><InputError message={errors.items} /></div>}

                            <div className="flex flex-col gap-4 mb-6">
                                {data.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-xl" style={{ backgroundColor: 'var(--pa-surface)', border: '1px solid var(--pa-surface-variant)' }}>
                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-0 px-0 py-2 pa-body-lg"
                                                style={{ borderBottom: '1px solid var(--pa-outline-variant)', borderRadius: 0 }}
                                                placeholder="Nama barang (cth: Bawang Merah, Ayam Fillet)"
                                                value={item.product_name}
                                                onChange={(e) => handleItemChange(idx, 'product_name', e.target.value)}
                                                required
                                            />
                                            {errors[`items.${idx}.product_name` as any] && <InputError message={errors[`items.${idx}.product_name` as any]} className="mt-1" />}
                                            
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-0 px-0 py-1 mt-1 text-sm focus:ring-0"
                                                style={{ color: 'var(--pa-text-muted)' }}
                                                placeholder="Catatan opsional (cth: yang segar, ukuran besar)"
                                                value={item.notes}
                                                onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                                            />
                                            {errors[`items.${idx}.notes` as any] && <InputError message={errors[`items.${idx}.notes` as any]} className="mt-1" />}
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="flex items-center rounded-md" style={{ border: '1px solid var(--pa-outline-variant)', backgroundColor: 'var(--pa-surface-bright)' }}>
                                                <button type="button" onClick={() => handleDecrementQty(idx)} className="px-3 py-2 text-gray-500 hover:text-[var(--pa-primary)] transition-colors">
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <input
                                                    type="number"
                                                    className="w-12 text-center border-0 bg-transparent py-2 pa-button-text p-0 focus:ring-0"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    required
                                                />
                                                <button type="button" onClick={() => handleIncrementQty(idx)} className="px-3 py-2 text-gray-500 hover:text-[var(--pa-primary)] transition-colors">
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                            {data.items.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveItem(idx)} className="p-2 rounded-md transition-colors ml-auto sm:ml-0" style={{ color: 'var(--pa-alert-rose)' }}>
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="w-full py-4 rounded-lg flex items-center justify-center gap-2 pa-button-text transition-all"
                                style={{
                                    border: '2px dashed var(--pa-outline-variant)',
                                    color: 'var(--pa-text-muted)',
                                    backgroundColor: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--pa-primary)';
                                    e.currentTarget.style.borderColor = 'var(--pa-primary)';
                                    e.currentTarget.style.backgroundColor = 'var(--pa-primary-fixed)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--pa-text-muted)';
                                    e.currentTarget.style.borderColor = 'var(--pa-outline-variant)';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Tambah Barang Belanjaan
                            </button>
                        </section>

                        {/* Step 3: Estimated Budget */}
                        <section className="pa-bento-card-static p-6 md:p-8 mb-8 md:mb-0">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--pa-surface-variant)', color: 'var(--pa-on-surface-variant)' }}>
                                    3
                                </div>
                                <h3 className="pa-headline-md">Estimasi Deposit Dana</h3>
                            </div>
                            <p className="pa-body-sm mb-4" style={{ color: 'var(--pa-text-muted)' }}>
                                Tetapkan batas deposit. Joki akan menggunakan dana ini untuk berbelanja, sisa dana dikembalikan (refund) atau kurang bayar diberikan langsung ke Joki saat serah-terima.
                            </p>
                            
                            <div className="flex items-center pb-2 max-w-sm" style={{ borderBottom: '2px solid var(--pa-primary)' }}>
                                <span className="pa-headline-lg mr-2" style={{ color: 'var(--pa-text-muted)' }}>Rp</span>
                                <input
                                    id="estimated_amount"
                                    type="number"
                                    className="w-full bg-transparent border-0 pa-headline-lg p-0 focus:ring-0"
                                    style={{ color: 'var(--pa-text-main)' }}
                                    placeholder="150000"
                                    value={data.estimated_amount}
                                    onChange={(e) => setData('estimated_amount', e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>
                            {errors.estimated_amount && <InputError message={errors.estimated_amount} className="mt-2" />}
                        </section>
                    </div>

                    {/* Right Column: Summary Sidebar (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="pa-bento-card-static p-6 sticky top-24">
                            <h3 className="pa-headline-md mb-6 pb-4" style={{ borderBottom: '1px solid var(--pa-surface-variant)' }}>Ringkasan Pesanan</h3>
                            
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--pa-text-muted)' }}>
                                        <span className="material-symbols-outlined text-sm">store</span>
                                        <span className="pa-body-sm">Pasar</span>
                                    </div>
                                    <span className="pa-button-text text-right">{market.name}</span>
                                </div>
                                
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--pa-text-muted)' }}>
                                        <span className="material-symbols-outlined text-sm">list_alt</span>
                                        <span className="pa-body-sm">Total Barang</span>
                                    </div>
                                    <span className="pa-button-text">{totalItems} jenis</span>
                                </div>

                                <div className="flex justify-between items-start pt-4" style={{ borderTop: '1px solid var(--pa-surface-variant)' }}>
                                    <div className="flex items-center gap-2" style={{ color: 'var(--pa-text-muted)' }}>
                                        <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                                        <span className="pa-body-sm">Estimasi Dana</span>
                                    </div>
                                    <span className="pa-button-text">Rp {data.estimated_amount ? parseInt(data.estimated_amount).toLocaleString('id-ID') : '0'}</span>
                                </div>
                            </div>

                            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--pa-surface-container)' }}>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--pa-info-sky)' }}>info</span>
                                    <p className="pa-body-sm" style={{ color: 'var(--pa-on-surface-variant)' }}>
                                        Biaya layanan akan ditambahkan setelah Joki menerima pesanan Anda berdasarkan jarak.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full pa-btn pa-btn-primary pa-button-text py-4 rounded-xl shadow-sm"
                            >
                                {processing ? 'Memproses...' : 'Konfirmasi Pesanan'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
