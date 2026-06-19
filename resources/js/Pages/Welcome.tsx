import React from 'react';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Selamat Datang di Pasar Antar" />
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--pa-background)', color: 'var(--pa-on-background)' }}>

                {/* Top Navigation */}
                <header
                    className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 transition-all duration-300"
                    style={{
                        padding: '0 var(--pa-margin-mobile)',
                        backgroundColor: 'var(--pa-surface)',
                        boxShadow: 'var(--pa-shadow-nav)',
                    }}
                    id="top-nav"
                >
                    <div className="flex items-center gap-3">
                        <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 32 }} />
                        <span style={{ color: 'var(--pa-primary)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>
                            Pasar Antar
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="pa-button-text" style={{ color: 'var(--pa-primary)', borderBottom: '2px solid var(--pa-primary)', paddingBottom: 4 }}>Home</a>
                        <a href="#how-it-works" className="pa-button-text" style={{ color: 'var(--pa-text-muted)', paddingBottom: 4, transition: 'color 0.2s' }}>Cara Kerja</a>
                        <a href="#become-joki" className="pa-button-text" style={{ color: 'var(--pa-text-muted)', paddingBottom: 4, transition: 'color 0.2s' }}>Untuk Joki</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="pa-btn pa-btn-primary pa-btn-sm">
                                Buka Dashboard
                            </Link>
                        ) : (
                            <div className="hidden md:flex gap-3">
                                <Link
                                    href={route('login')}
                                    className="pa-btn pa-btn-secondary pa-btn-sm"
                                    style={{ borderRadius: 9999 }}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="pa-btn pa-btn-primary pa-btn-sm"
                                    style={{ borderRadius: 9999 }}
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        )}
                        <button className="md:hidden p-2 rounded-full" style={{ color: 'var(--pa-primary)' }}>
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow pt-16 pb-20 md:pb-0 w-full max-w-7xl mx-auto flex flex-col gap-y-8 md:gap-y-16 mt-8"
                    style={{ padding: '80px var(--pa-margin-mobile) 80px' }}
                >
                    {/* Hero Section */}
                    <section className="flex flex-col md:flex-row items-center gap-8 justify-between w-full mt-4 md:mt-12">
                        <div className="flex-1 flex flex-col gap-6 md:pr-12">
                            {/* Eyebrow Badge */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit"
                                style={{ backgroundColor: 'rgba(70,72,212,0.08)', color: 'var(--pa-primary)' }}
                            >
                                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>storefront</span>
                                <span className="pa-label-caps">Human-Powered Market Delivery</span>
                            </div>

                            {/* Headline */}
                            <h1 style={{ fontFamily: 'var(--pa-font-family)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--pa-text-main)', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                                Bahan segar dari{' '}
                                <span style={{ color: 'var(--pa-primary)', position: 'relative', display: 'inline-block' }}>
                                    pasar tradisional
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 opacity-70" style={{ color: 'var(--pa-tertiary-fixed-dim, #ffb95f)' }} preserveAspectRatio="none" viewBox="0 0 100 10">
                                        <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                                    </svg>
                                </span>
                                <br className="hidden md:block" />
                                langsung ke rumah Anda.
                            </h1>

                            {/* Description */}
                            <p className="pa-body-lg" style={{ color: 'var(--pa-text-muted)', maxWidth: 480 }}>
                                Lewati keramaian pagi hari. Joki Pasar kami memilihkan sayur, daging, dan bumbu segar langsung dari pedagang lokal terpercaya, menjamin kualitas dan harga pasar asli.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {auth.user ? (
                                    <Link href={route('markets.index')} className="pa-btn pa-btn-primary" style={{ borderRadius: 12, padding: '16px 32px' }}>
                                        <span className="material-symbols-outlined icon-fill">shopping_basket</span>
                                        Mulai Belanja
                                    </Link>
                                ) : (
                                    <Link href={route('register')} className="pa-btn pa-btn-primary" style={{ borderRadius: 12, padding: '16px 32px' }}>
                                        <span className="material-symbols-outlined icon-fill">shopping_basket</span>
                                        Mulai Belanja
                                    </Link>
                                )}
                                <a href="#become-joki" className="pa-btn pa-btn-secondary" style={{ borderRadius: 12, padding: '16px 32px' }}>
                                    <span className="material-symbols-outlined">motorcycle</span>
                                    Menjadi Joki
                                </a>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                                            style={{
                                                borderColor: 'var(--pa-surface-container-lowest)',
                                                backgroundColor: i === 1 ? 'var(--pa-primary-fixed)' : i === 2 ? 'var(--pa-secondary-container)' : 'var(--pa-tertiary-fixed, #ffddb8)',
                                                color: i === 1 ? 'var(--pa-primary)' : i === 2 ? 'var(--pa-secondary)' : 'var(--pa-tertiary)',
                                                zIndex: 4 - i,
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--pa-text-main)' }}>5,000+</span> tetangga senang
                                </div>
                            </div>
                        </div>

                        {/* Hero Right: Logo Display */}
                        <div className="flex-1 w-full relative max-w-md mx-auto md:max-w-none mt-8 md:mt-0">
                            {/* Decorative blob */}
                            <div
                                className="absolute rounded-full blur-3xl opacity-40"
                                style={{
                                    backgroundColor: 'var(--pa-primary-fixed)',
                                    width: '75%', height: '75%',
                                    top: '12%', left: '12%',
                                }}
                            />
                            {/* Main Logo Display */}
                            <div
                                className="relative z-10 overflow-hidden flex items-center justify-center p-8"
                                style={{
                                    borderRadius: 'var(--pa-radius-bento)',
                                    backgroundColor: 'var(--pa-surface-container-low)',
                                    border: '4px solid var(--pa-surface-container-lowest)',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                                    aspectRatio: '1',
                                }}
                            >
                                <img src="/PasarAntar.png" alt="Pasar Antar Logo" className="w-full h-full object-contain" style={{ borderRadius: 12 }} />
                            </div>

                            {/* Floating Status Card 1 */}
                            <div
                                className="absolute z-20 pa-bento-card flex items-center gap-3"
                                style={{ bottom: -24, left: -24, padding: '12px 16px', animation: 'pa-pulse-green 3s infinite' }}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.15)', color: 'var(--pa-status-shopping)' }}>
                                    <span className="material-symbols-outlined icon-fill">storefront</span>
                                </div>
                                <div>
                                    <div className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>Status</div>
                                    <div className="pa-button-text" style={{ color: 'var(--pa-status-shopping)' }}>Belanja di Pasar Senen</div>
                                </div>
                            </div>

                            {/* Floating Status Card 2 */}
                            <div
                                className="absolute z-20 pa-bento-card flex items-center gap-3"
                                style={{ top: -24, right: -24, padding: '12px 16px' }}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: 'var(--pa-status-completed)' }}>
                                    <span className="material-symbols-outlined icon-fill">check_circle</span>
                                </div>
                                <div>
                                    <div className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>Dikirim</div>
                                    <div className="pa-button-text" style={{ color: 'var(--pa-text-main)' }}>Bahan Segar Tiba</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works — Bento Grid */}
                    <section className="flex flex-col gap-5 mt-12 md:mt-24" id="how-it-works">
                        <div className="text-center max-w-2xl mx-auto mb-8">
                            <h2 className="pa-headline-md md:pa-headline-lg mb-4" style={{ color: 'var(--pa-text-main)', fontSize: 'clamp(20px, 3vw, 30px)' }}>
                                Bagaimana Pasar Antar Bekerja
                            </h2>
                            <p className="pa-body-lg" style={{ color: 'var(--pa-text-muted)' }}>
                                Koneksi mulus antara dapur Anda, joki belanja ahli, dan pasar tradisional penuh semangat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                            {/* Step 1 */}
                            <div className="pa-bento-card md:col-span-4 p-6 md:p-8 flex flex-col group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: 'var(--pa-info-sky)' }}>
                                    <span className="material-symbols-outlined icon-fill text-2xl">map</span>
                                </div>
                                <h3 className="pa-headline-md mb-2">1. Pilih Pasar</h3>
                                <p className="pa-body-sm flex-grow" style={{ color: 'var(--pa-text-muted)' }}>
                                    Pilih pasar tradisional lokal favorit Anda. Kami bermitra dengan pasar-pasar utama untuk memastikan Anda mendapatkan apa yang biasa dibeli.
                                </p>
                                <div className="mt-6 rounded-lg p-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--pa-surface-container)', border: '1px solid var(--pa-surface-variant)' }}>
                                    <div className="flex items-center justify-between p-2 rounded shadow-sm" style={{ backgroundColor: 'var(--pa-surface-container-lowest)', border: '1px solid rgba(199,196,215,0.3)' }}>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--pa-primary)' }}>store</span>
                                            <span className="pa-button-text" style={{ fontSize: 13 }}>Pasar Senen</span>
                                        </div>
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--pa-status-completed)' }} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded shadow-sm opacity-50" style={{ backgroundColor: 'var(--pa-surface-container-lowest)', border: '1px solid rgba(199,196,215,0.3)' }}>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--pa-text-muted)' }}>store</span>
                                            <span className="pa-button-text" style={{ fontSize: 13, color: 'var(--pa-text-muted)' }}>Pasar Kramat Jati</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="pa-bento-card md:col-span-8 p-0 flex flex-col md:flex-row overflow-hidden relative">
                                <div className="p-6 md:p-8 flex flex-col flex-1 z-10" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)' }}>
                                        <span className="material-symbols-outlined icon-fill text-2xl">shopping_cart</span>
                                    </div>
                                    <h3 className="pa-headline-md mb-2">2. Joki Belanja Langsung</h3>
                                    <p className="pa-body-sm max-w-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                        Joki personal shopper berpengalaman menelusuri pasar, memilih bahan terbaik dan bernegosiasi harga seperti Anda sendiri.
                                    </p>
                                    <div className="mt-auto rounded-xl p-4 max-w-sm" style={{ backgroundColor: 'var(--pa-surface-container)', border: '1px solid var(--pa-surface-variant)' }}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="pa-label-caps" style={{ color: 'var(--pa-text-muted)' }}>Daftar Belanja Budi</span>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: 'rgba(249,115,22,0.15)', color: 'var(--pa-status-shopping)' }}>AKTIF</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 p-2 rounded shadow-sm opacity-50" style={{ backgroundColor: 'var(--pa-surface-container-lowest)' }}>
                                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-status-completed)', fontSize: 18 }}>check_box</span>
                                                <span className="pa-body-sm line-through" style={{ color: 'var(--pa-text-muted)', fontSize: 13 }}>Ayam Kampung (1 ekor)</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-2 rounded shadow-sm" style={{ backgroundColor: 'var(--pa-surface-container-lowest)', borderLeft: '2px solid var(--pa-status-shopping)' }}>
                                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-outline)', fontSize: 18 }}>check_box_outline_blank</span>
                                                <span className="pa-body-sm font-semibold" style={{ fontSize: 13, color: 'var(--pa-text-main)' }}>Bawang Merah (500g)</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-2 rounded shadow-sm" style={{ backgroundColor: 'var(--pa-surface-container-lowest)' }}>
                                                <span className="material-symbols-outlined" style={{ color: 'var(--pa-outline)', fontSize: 18 }}>check_box_outline_blank</span>
                                                <span className="pa-body-sm" style={{ fontSize: 13, color: 'var(--pa-text-main)' }}>Cabai Rawit Merah (250g)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative side */}
                                <div className="h-48 md:h-auto md:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--pa-surface-variant)' }}>
                                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, var(--pa-primary-fixed) 0%, var(--pa-secondary-container) 50%, var(--pa-tertiary-fixed, #ffddb8) 100%)`, opacity: 0.6 }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined icon-fill" style={{ fontSize: 80, color: 'var(--pa-primary)', opacity: 0.3 }}>storefront</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="pa-bento-card md:col-span-12 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"
                                style={{ background: `linear-gradient(135deg, var(--pa-surface-container-lowest), var(--pa-surface-container-low))` }}
                            >
                                <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                                    style={{ backgroundColor: 'var(--pa-secondary-container)', color: 'var(--pa-on-secondary-container)', border: '1px solid rgba(0,108,73,0.2)' }}
                                >
                                    <span className="material-symbols-outlined icon-fill text-3xl">two_wheeler</span>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="pa-headline-md mb-2">3. Langsung ke Dapur Anda</h3>
                                    <p className="pa-body-sm max-w-2xl" style={{ color: 'var(--pa-text-muted)' }}>
                                        Setelah selesai belanja, Joki segera mengirimkan bahan segar ke pintu rumah Anda. Tanpa gudang perantara, tanpa penundaan. Cuma bahan pasar segar, cepat.
                                    </p>
                                </div>
                                <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
                                    style={{ backgroundColor: 'var(--pa-surface-container-lowest)', border: '1px solid var(--pa-surface-variant)' }}
                                >
                                    <span className="w-3 h-3 rounded-full pa-pulse-dot" style={{ backgroundColor: 'var(--pa-status-completed)' }} />
                                    <span className="pa-button-text" style={{ fontSize: 13, color: 'var(--pa-status-completed)' }}>Estimasi 30-45 menit</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Joki Section */}
                    <section className="mt-12 md:mt-20 mb-12" id="become-joki">
                        <div className="pa-bento-card p-6 md:p-10 flex flex-col md:flex-row items-center gap-8"
                            style={{ background: `linear-gradient(135deg, var(--pa-primary) 0%, var(--pa-primary-container) 100%)`, color: 'var(--pa-on-primary)', border: 'none' }}
                        >
                            <div className="flex-1">
                                <span className="pa-label-caps" style={{ opacity: 0.8 }}>Mitra Pasar & Joki</span>
                                <h3 className="pa-headline-md mt-2 text-white" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>Hasilkan Pendapatan Sebagai Joki Pasar</h3>
                                <p className="pa-body-sm mt-3" style={{ opacity: 0.85, maxWidth: 480 }}>
                                    Bergabunglah dengan jaringan kami dan bantu tetangga mendapatkan bahan segar sambil menghasilkan pendapatan yang adil. Jadwal fleksibel, komunitas yang mendukung.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        <span className="pa-label-caps" style={{ opacity: 0.7, fontSize: 10 }}>Pendapatan</span>
                                        <div className="pa-button-text mt-1">Rp 150K+/hari</div>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        <span className="pa-label-caps" style={{ opacity: 0.7, fontSize: 10 }}>Jadwal</span>
                                        <div className="pa-button-text mt-1">Fleksibel</div>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        <span className="pa-label-caps" style={{ opacity: 0.7, fontSize: 10 }}>Rating</span>
                                        <div className="pa-button-text mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>star</span>
                                            4.9 Rata-rata
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!auth.user && (
                                <Link
                                    href={route('register')}
                                    className="pa-btn shrink-0"
                                    style={{ backgroundColor: 'white', color: 'var(--pa-primary)', fontWeight: 700, borderRadius: 12, padding: '16px 32px' }}
                                >
                                    <span className="material-symbols-outlined">motorcycle</span>
                                    Daftar Sebagai Joki
                                </Link>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer style={{ borderTop: '1px solid var(--pa-surface-variant)', backgroundColor: 'var(--pa-surface-container-lowest)', padding: '2rem 0' }}>
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 pa-label-caps" style={{ color: 'var(--pa-outline)', fontSize: 10 }}>
                        <div className="flex items-center gap-2">
                            <img src="/PasarAntar.png" alt="" style={{ height: 16, opacity: 0.5 }} />
                            Pasar Antar &copy; {new Date().getFullYear()}
                        </div>
                        <div>Laravel v{laravelVersion} (PHP v{phpVersion})</div>
                    </div>
                </footer>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden pa-bottom-nav">
                    <a href="#" className="pa-bottom-nav-item active">
                        <span className="material-symbols-outlined icon-fill">home</span>
                        <span className="pa-nav-label">Home</span>
                    </a>
                    <a href="#how-it-works" className="pa-bottom-nav-item">
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="pa-nav-label">Cara Kerja</span>
                    </a>
                    <a href="#become-joki" className="pa-bottom-nav-item">
                        <span className="material-symbols-outlined">store</span>
                        <span className="pa-nav-label">Joki</span>
                    </a>
                    {auth.user ? (
                        <Link href={route('dashboard')} className="pa-bottom-nav-item">
                            <span className="material-symbols-outlined">person</span>
                            <span className="pa-nav-label">Profil</span>
                        </Link>
                    ) : (
                        <Link href={route('login')} className="pa-bottom-nav-item">
                            <span className="material-symbols-outlined">login</span>
                            <span className="pa-nav-label">Masuk</span>
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}
