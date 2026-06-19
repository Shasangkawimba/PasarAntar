import React from 'react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center p-6"
            style={{ backgroundColor: 'var(--pa-background)' }}
        >
            <div className="w-full max-w-md flex flex-col items-center">

                {/* Logo & Slogan Header */}
                <div className="mb-8 text-center flex flex-col items-center">
                    <Link href="/" className="transition hover:opacity-90">
                        <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 72 }} />
                    </Link>
                    <h1
                        className="text-2xl font-bold mt-4"
                        style={{ color: 'var(--pa-primary)', letterSpacing: '-0.01em' }}
                    >
                        Pasar Antar
                    </h1>
                    <p className="pa-label-caps mt-1" style={{ color: 'var(--pa-text-muted)' }}>
                        Jasa Belanja Tradisional Terpercaya
                    </p>
                </div>

                {/* Form Card Container - Bento Styled */}
                <div
                    className="w-full relative overflow-hidden"
                    style={{
                        backgroundColor: 'var(--pa-surface-container-lowest)',
                        border: '1px solid var(--pa-surface-variant)',
                        borderRadius: 'var(--pa-radius-bento)',
                        padding: '2rem',
                        boxShadow: 'var(--pa-shadow-card)',
                    }}
                >
                    {/* Top Decorative Bar */}
                    <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                            height: 4,
                            background: `linear-gradient(90deg, var(--pa-primary), var(--pa-secondary), var(--pa-tertiary-fixed-dim, #ffb95f))`,
                        }}
                    />

                    {children}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center pa-label-caps" style={{ color: 'var(--pa-outline)', fontSize: 10 }}>
                    Pasar Antar &copy; {new Date().getFullYear()} &bull; Fresh &amp; Healthy
                </div>
            </div>
        </div>
    );
}
