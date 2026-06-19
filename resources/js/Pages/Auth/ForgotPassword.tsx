import React from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Lupa Kata Sandi?</h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Jangan khawatir. Cukup masukkan alamat email Anda dan kami akan mengirimkan link untuk mengatur ulang kata sandi Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full text-sm"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Masukkan alamat email Anda"
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5 text-xs text-rose-600 font-medium" />
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <PrimaryButton className="w-full text-center flex justify-center py-3 text-xs font-bold uppercase tracking-wider" disabled={processing}>
                        {processing ? 'Mengirim...' : 'Kirim Link Atur Ulang'}
                    </PrimaryButton>
                    
                    <div className="text-center text-xs text-gray-500">
                        <Link
                            href={route('login')}
                            className="font-bold text-emerald-600 hover:text-emerald-700 transition"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
