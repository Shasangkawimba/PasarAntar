import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'buyer', phone_number: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--pa-status-completed)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>person_add</span>
                </div>
                <h2 className="pa-headline-lg">Daftar Akun Baru</h2>
                <p className="pa-body-lg mt-2" style={{ color: 'var(--pa-text-muted)' }}>Lengkapi data diri untuk mulai berbelanja atau menjadi Joki.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="pa-bento-card-static p-6 md:p-8 space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama Lengkap Anda"
                            required
                        />
                        <InputError message={errors.name} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Daftar Sebagai" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="buyer">Pembeli (Buyer)</option>
                            <option value="joki">Joki Pasar</option>
                        </select>
                        <InputError message={errors.role} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone_number" value="Nomor Telepon" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                        <TextInput
                            id="phone_number"
                            type="text"
                            name="phone_number"
                            value={data.phone_number}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4 pa-mono"
                            placeholder="Contoh: 08123456789"
                            onChange={(e) => setData('phone_number', e.target.value)}
                            required
                        />
                        <InputError message={errors.phone_number} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="password" value="Kata Sandi" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Sandi" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi kata sandi"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full text-center flex justify-center py-4 text-[15px] font-bold rounded-xl" style={{ backgroundColor: 'var(--pa-primary)' }} disabled={processing}>
                        {processing ? 'Memproses...' : 'Daftar Akun Baru'}
                    </PrimaryButton>
                    
                    <div className="text-center mt-6 pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="font-bold hover:underline transition-all" style={{ color: 'var(--pa-primary)' }}>
                            Masuk Aplikasi
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
