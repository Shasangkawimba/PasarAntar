import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
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
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        setData('items', newItems);
    };

    const handleIncrementQty = (index: number) => {
        const newQty = (data.items[index].quantity || 0) + 1;
        handleItemChange(index, 'quantity', newQty);
    };

    const handleDecrementQty = (index: number) => {
        const newQty = Math.max(1, (data.items[index].quantity || 1) - 1);
        handleItemChange(index, 'quantity', newQty);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    // Calculate total count of items for summary
    const totalItems = data.items.length;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Buat Pesanan Belanja
                </h2>
            }
        >
            <Head title="Buat Pesanan" />

            <div className="pa-body pa-mobile-sticky-padding">
                <div className="pa-container" style={{ maxWidth: '800px' }}>
                    <div className="pa-header" style={{ marginBottom: '1.5rem' }}>
                        <div>
                            <h1 className="pa-title">{market.name}</h1>
                            <p className="pa-subtitle">{market.address}</p>
                        </div>
                        <Link href={route('markets.index')} className="pa-btn pa-btn-secondary pa-btn-sm">
                            Kembali ke Pasar
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 1. Rencana Belanja Section */}
                        <div className="pa-form-section">
                            <h2 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem' }}>Daftar Belanjaan</h2>
                            
                            {errors.items && (
                                <div className="pa-mb-4">
                                    <InputError message={errors.items} />
                                </div>
                            )}

                            {data.items.map((item, idx) => (
                                <div key={idx} className="pa-item-row-card">
                                    <div className="pa-item-header">
                                        <span className="pa-font-bold" style={{ fontSize: '0.875rem' }}>Barang #{idx + 1}</span>
                                        {data.items.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveItem(idx)}
                                                className="pa-btn pa-btn-danger pa-btn-sm" 
                                                style={{ minHeight: '32px', height: '32px', padding: '0 0.5rem' }}
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>

                                    <div className="pa-item-row-grid">
                                        {/* Nama Barang */}
                                        <div className="pa-form-group" style={{ marginBottom: 0 }}>
                                            <InputLabel htmlFor={`product_name_${idx}`} value="Nama Barang" className="pa-form-label" />
                                            <input
                                                id={`product_name_${idx}`}
                                                type="text"
                                                className="pa-input-text"
                                                placeholder="Contoh: Bayam, Ayam Potong"
                                                value={item.product_name}
                                                onChange={(e) => handleItemChange(idx, 'product_name', e.target.value)}
                                                required
                                            />
                                            {errors[`items.${idx}.product_name` as any] && (
                                                <InputError message={errors[`items.${idx}.product_name` as any]} className="pa-mt-1" />
                                            )}
                                        </div>

                                        {/* Jumlah / Qty */}
                                        <div className="pa-form-group" style={{ marginBottom: 0 }}>
                                            <InputLabel value="Jumlah" className="pa-form-label" />
                                            <div className="pa-flex-between" style={{ gap: '0.5rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrementQty(idx)}
                                                    className="pa-btn pa-btn-secondary"
                                                    style={{ width: '40px', minWidth: '40px', padding: 0 }}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="pa-input-text pa-text-center"
                                                    style={{ textAlign: 'center', padding: '0.75rem 0.25rem' }}
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrementQty(idx)}
                                                    className="pa-btn pa-btn-secondary"
                                                    style={{ width: '40px', minWidth: '40px', padding: 0 }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {errors[`items.${idx}.quantity` as any] && (
                                                <InputError message={errors[`items.${idx}.quantity` as any]} className="pa-mt-1" />
                                            )}
                                        </div>

                                        {/* Catatan */}
                                        <div className="pa-form-group" style={{ marginBottom: 0 }}>
                                            <div className="pa-flex-between">
                                                <InputLabel htmlFor={`notes_${idx}`} value="Catatan Belanja" className="pa-form-label" />
                                                {/* Desktop Remove Button */}
                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="hidden md:inline-flex text-red-500 hover:text-red-700 font-semibold text-xs"
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        Hapus Barang
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                id={`notes_${idx}`}
                                                type="text"
                                                className="pa-input-text"
                                                placeholder="Contoh: ikat besar, dada 1/2 kg"
                                                value={item.notes}
                                                onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                                            />
                                            {errors[`items.${idx}.notes` as any] && (
                                                <InputError message={errors[`items.${idx}.notes` as any]} className="pa-mt-1" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="pa-btn pa-btn-secondary"
                                style={{ width: '100%', marginTop: '0.5rem', borderStyle: 'dashed' }}
                            >
                                + Tambah Barang Lainnya
                            </button>
                        </div>

                        {/* 2. Estimasi Pembayaran Section */}
                        <div className="pa-form-section">
                            <h2 className="pa-font-bold pa-mb-4" style={{ fontSize: '1.125rem' }}>Estimasi Biaya Belanja</h2>
                            
                            <div className="pa-form-group">
                                <InputLabel htmlFor="estimated_amount" value="Estimasi Total Belanja (Rupiah)" className="pa-form-label" />
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold' }}>Rp</span>
                                    <input
                                        id="estimated_amount"
                                        type="number"
                                        className="pa-input-text"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Contoh: 150000"
                                        value={data.estimated_amount}
                                        onChange={(e) => setData('estimated_amount', e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                                <p className="pa-subtitle" style={{ marginTop: '0.5rem' }}>
                                    *Masukkan kisaran dana belanja. Uang sisa akan dikembalikan (*refund*) dan jika kurang dapat dibayarkan ke Joki saat pengantaran.
                                </p>
                                {errors.estimated_amount && (
                                    <InputError message={errors.estimated_amount} className="pa-mt-1" />
                                )}
                            </div>
                        </div>

                        {/* 3. Aksi Simpan */}
                        <div className="pa-mobile-sticky-footer md:mt-6" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Link
                                href={route('markets.index')}
                                className="pa-btn pa-btn-secondary md:w-auto"
                                style={{ flexGrow: 1, maxWidth: '200px' }}
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="pa-btn pa-btn-primary md:w-auto"
                                style={{ flexGrow: 2, maxWidth: '300px' }}
                            >
                                {processing ? 'Memproses...' : `Buat Pesanan (${totalItems} Barang)`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
