import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(70,72,212,0.1)', color: 'var(--pa-primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>login</span>
                </div>
                <h2 className="pa-headline-lg">Selamat Datang Kembali</h2>
                <p className="pa-body-lg mt-2" style={{ color: 'var(--pa-text-muted)' }}>Silakan masuk untuk melanjutkan ke Pasar Antar.</p>
            </div>

            {status && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--pa-status-completed)' }}>check_circle</span>
                    <span className="pa-body-sm font-semibold" style={{ color: 'var(--pa-status-completed)' }}>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="pa-bento-card-static p-6 md:p-8 space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" className="pa-label-caps mb-2 block" style={{ color: 'var(--pa-text-muted)' }} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                        />
                        <InputError message={errors.email} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel htmlFor="password" value="Kata Sandi" className="pa-label-caps block" style={{ color: 'var(--pa-text-muted)' }} />
                            {canResetPassword && (
                                <Link href={route('password.request')} className="pa-label-caps hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>
                                    Lupa Sandi?
                                </Link>
                            )}
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-[var(--pa-surface-container)] border-transparent focus:border-[var(--pa-primary)] focus:ring-[var(--pa-primary)] rounded-xl pa-body-lg p-4"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="mt-2 text-sm text-[var(--pa-alert-rose)]" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center cursor-pointer select-none group">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                                className="rounded border-gray-300 w-5 h-5"
                                style={{ color: 'var(--pa-primary)', borderColor: 'var(--pa-outline)' }}
                            />
                            <span className="ms-3 pa-body-sm group-hover:text-[var(--pa-text-main)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>
                                Ingat Saya
                            </span>
                        </label>
                    </div>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full text-center flex justify-center py-4 text-[15px] font-bold rounded-xl" style={{ backgroundColor: 'var(--pa-primary)' }} disabled={processing}>
                        {processing ? 'Memproses...' : 'Masuk Aplikasi'}
                    </PrimaryButton>
                    
                    <div className="text-center mt-6 pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="font-bold hover:underline transition-all" style={{ color: 'var(--pa-primary)' }}>
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
