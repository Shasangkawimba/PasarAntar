import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Konfirmasi Sandi</h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Ini adalah area aman aplikasi. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-xs font-bold text-slate-700 mb-1 block" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-sm"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5 text-xs text-rose-600 font-medium" />
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <PrimaryButton className="w-full text-center flex justify-center py-3 text-xs font-bold uppercase tracking-wider" disabled={processing}>
                        {processing ? 'Memproses...' : 'Konfirmasi Sandi'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
