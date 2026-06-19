import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Kata Sandi" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Atur Ulang Sandi</h2>
                <p className="text-xs text-gray-500 mt-1">Masukkan kata sandi baru untuk akun Anda.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-bold text-slate-700 mb-1 block" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full text-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1 text-xs text-rose-600 font-medium" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-xs font-bold text-slate-700 mb-1 block" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-sm"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
                        required
                    />

                    <InputError message={errors.password} className="mt-1 text-xs text-rose-600 font-medium" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                        className="text-xs font-bold text-slate-700 mb-1 block"
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full text-sm"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Ulangi kata sandi baru"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1 text-xs text-rose-600 font-medium"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <PrimaryButton className="w-full text-center flex justify-center py-3 text-xs font-bold uppercase tracking-wider" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
