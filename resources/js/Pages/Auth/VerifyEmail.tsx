import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Verifikasi Email Anda</h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi alamat email Anda dengan mengklik link yang baru saja kami kirimkan ke email Anda. Jika tidak menerima email, kami akan dengan senang hati mengirimkan yang baru.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    Link verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <PrimaryButton className="w-full text-center flex justify-center py-3 text-xs font-bold uppercase tracking-wider" disabled={processing}>
                        {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                    </PrimaryButton>

                    <div className="text-center mt-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-rose-500 transition"
                        >
                            Keluar Aplikasi
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
