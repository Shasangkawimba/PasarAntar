import React, { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'how-it-works', 'become-joki'];
            const scrollPosition = window.scrollY + 200;

            let current = 'home';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop - 100 <= scrollPosition) {
                    current = section;
                }
            }
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                current = 'become-joki';
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Selamat Datang di Pasar Antar" />
            <div id="home" className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--pa-background)', color: 'var(--pa-on-background)' }}>

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
                        <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 50 }} />
                        <span style={{ color: 'var(--pa-primary)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>
                            Pasar Antar
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#home" className="pa-button-text" style={{ color: activeSection === 'home' ? 'var(--pa-primary)' : 'var(--pa-text-muted)', borderBottom: activeSection === 'home' ? '2px solid var(--pa-primary)' : '2px solid transparent', paddingBottom: 4, transition: 'all 0.2s' }}>Home</a>
                        <a href="#how-it-works" className="pa-button-text" style={{ color: activeSection === 'how-it-works' ? 'var(--pa-primary)' : 'var(--pa-text-muted)', borderBottom: activeSection === 'how-it-works' ? '2px solid var(--pa-primary)' : '2px solid transparent', paddingBottom: 4, transition: 'all 0.2s' }}>Cara Kerja</a>
                        <a href="#become-joki" className="pa-button-text" style={{ color: activeSection === 'become-joki' ? 'var(--pa-primary)' : 'var(--pa-text-muted)', borderBottom: activeSection === 'become-joki' ? '2px solid var(--pa-primary)' : '2px solid transparent', paddingBottom: 4, transition: 'all 0.2s' }}>Untuk Joki</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="pa-btn pa-btn-primary pa-btn-sm">
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
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
                                <div className="md:hidden relative">
                                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full" style={{ color: 'var(--pa-primary)' }}>
                                        <span className="material-symbols-outlined text-2xl">menu</span>
                                    </button>
                                    {isMobileMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 overflow-hidden" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                                                <Link href={route('login')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-bold" style={{ color: 'var(--pa-primary)' }}>Masuk</Link>
                                                <Link href={route('register')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">Daftar Sekarang</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow pt-24 pb-20 md:pb-12 w-full max-w-7xl mx-auto flex flex-col gap-y-12 md:gap-y-20 px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <section className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-12 gap-y-6 md:gap-y-8 items-start w-full mt-4 md:mt-12">
                        
                        {/* 1. Headline Block */}
                        <div className="flex flex-col gap-6 md:col-start-1 md:row-start-1 z-10">
                            {/* Eyebrow Badge */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit"
                                style={{ backgroundColor: 'rgba(105, 141, 53, 0.1)', color: 'var(--pa-primary)' }}
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
                                {' '}langsung ke rumah Anda.
                            </h1>
                        </div>

                        {/* 2. Image Block (Mobile goes here natively, Desktop goes right) */}
                        <div className="w-full flex flex-col max-w-[320px] md:max-w-md lg:max-w-lg mx-auto md:col-start-2 md:row-start-1 md:row-span-2 relative mt-4 mb-10 md:mt-0 md:mb-0 z-0">
                            <div className="relative w-full">
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
                                    className="relative z-10 overflow-hidden flex items-center justify-center p-6 md:p-8"
                                    style={{
                                        borderRadius: 'var(--pa-radius-bento)',
                                        backgroundColor: 'var(--pa-surface-container-low)',
                                        border: '4px solid var(--pa-surface-container-lowest)',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <img src="/market_hero.png" alt="Pasar Antar Market" className="w-full h-auto object-contain" style={{ borderRadius: 12, aspectRatio: '1' }} />
                                </div>
                                
                                {/* Decorative Floating Rating Card */}
                                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-8 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20" style={{ animation: 'pa-float 4s ease-in-out infinite' }}>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--pa-tertiary-fixed)', color: 'var(--pa-on-tertiary-container)' }}>
                                        <span className="material-symbols-outlined icon-fill text-xl md:text-2xl" style={{ color: '#F59E0B' }}>star</span>
                                    </div>
                                    <div className="flex flex-col pr-2">
                                        <span className="font-bold text-gray-900" style={{ fontSize: '13px' }}>4.9/5 Rating</span>
                                        <span className="text-gray-500" style={{ fontSize: '11px' }}>Dari 5,000+ pengguna</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Description, CTA, & Benefits Block */}
                        <div className="flex flex-col gap-6 md:col-start-1 md:row-start-2 pb-4 md:pb-0 z-10">
                            {/* Description */}
                            <p className="pa-body-lg" style={{ color: 'var(--pa-text-muted)', maxWidth: 480 }}>
                                Lewati keramaian pagi hari. Joki Pasar kami memilihkan sayur, daging, dan bumbu segar langsung dari pedagang lokal terpercaya, menjamin kualitas dan harga pasar asli.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
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

                            {/* Benefits/Keunggulan */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 w-full max-w-full">
                                {/* Feature 1 */}
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 z-10 transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--pa-primary-fixed)', color: 'var(--pa-primary)' }}>
                                        <span className="material-symbols-outlined icon-fill text-xl sm:text-2xl">verified</span>
                                    </div>
                                    <span className="pa-body-sm font-extrabold text-center leading-tight z-10" style={{ color: 'var(--pa-text-main)', fontSize: 'clamp(11px, 2.5vw, 14px)' }}>100% Segar</span>
                                </div>
                                {/* Feature 2 */}
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 z-10 transition-transform group-hover:scale-110" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)' }}>
                                        <span className="material-symbols-outlined icon-fill text-xl sm:text-2xl">payments</span>
                                    </div>
                                    <span className="pa-body-sm font-extrabold text-center leading-tight z-10" style={{ color: 'var(--pa-text-main)', fontSize: 'clamp(11px, 2.5vw, 14px)' }}>Harga Asli</span>
                                </div>
                                {/* Feature 3 */}
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 z-10 transition-transform group-hover:scale-110" style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: 'var(--pa-info-sky)' }}>
                                        <span className="material-symbols-outlined icon-fill text-xl sm:text-2xl">bolt</span>
                                    </div>
                                    <span className="pa-body-sm font-extrabold text-center leading-tight z-10" style={{ color: 'var(--pa-text-main)', fontSize: 'clamp(11px, 2.5vw, 14px)' }}>Kirim Cepat</span>
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Step 1 */}
                            <div className="pa-bento-card p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--pa-primary-fixed)', color: 'var(--pa-primary)', border: '2px solid rgba(105,141,53,0.1)' }}>
                                    <span className="material-symbols-outlined icon-fill text-3xl">storefront</span>
                                </div>
                                <h3 className="pa-headline-md mb-3 text-xl">1. Pilih Pasar Favorit</h3>
                                <p className="pa-body-md flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Pilih pasar tradisional terdekat dan buat daftar belanja Anda melalui aplikasi dengan mudah dan praktis.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="pa-bento-card p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--pa-secondary-container)', color: 'var(--pa-secondary)', border: '2px solid rgba(13,109,79,0.1)' }}>
                                    <span className="material-symbols-outlined icon-fill text-3xl">shopping_cart</span>
                                </div>
                                <h3 className="pa-headline-md mb-3 text-xl">2. Joki Kami Berbelanja</h3>
                                <p className="pa-body-md flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Joki berpengalaman akan memilihkan bahan terbaik dan paling segar dengan harga asli dari pedagang.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="pa-bento-card p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--pa-status-shopping)', border: '2px solid rgba(249,115,22,0.1)' }}>
                                    <span className="material-symbols-outlined icon-fill text-3xl">two_wheeler</span>
                                </div>
                                <h3 className="pa-headline-md mb-3 text-xl">3. Langsung Diantar</h3>
                                <p className="pa-body-md flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Belanjaan segera dikirim langsung ke dapur Anda. Tanpa mampir ke gudang, dijamin kesegarannya.
                                </p>
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

                {/* Iconic Footer */}
                <footer className="relative mt-20" style={{ backgroundColor: 'var(--pa-surface-container)', borderTop: '1px solid var(--pa-surface-variant)' }}>
                    {/* Top Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--pa-primary), var(--pa-secondary-container), var(--pa-tertiary-container))' }} />
                    
                    <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-20">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
                            {/* Brand Column */}
                            <div className="md:col-span-5 flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm border" style={{ borderColor: 'var(--pa-surface-variant)' }}>
                                        <img src="/PasarAntar.png" alt="Logo" className="h-8 md:h-10 w-auto" />
                                    </div>
                                    <h2 className="pa-headline-md" style={{ color: 'var(--pa-text-main)', fontSize: 'clamp(20px, 3vw, 24px)' }}>Pasar Antar</h2>
                                </div>
                                <p className="pa-body-md" style={{ color: 'var(--pa-text-muted)', maxWidth: '320px', lineHeight: 1.6 }}>
                                    Menghubungkan dapur keluarga dengan kesegaran pasar tradisional lokal melalui joki belanja profesional yang dapat Anda percaya.
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:-translate-y-1 transition-all group" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                                        <span className="material-symbols-outlined group-hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>photo_camera</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:-translate-y-1 transition-all group" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                                        <span className="material-symbols-outlined group-hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>forum</span>
                                    </a>
                                </div>
                            </div>

                            {/* Links Column */}
                            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>Platform</h4>
                                    <a href="#home" className="pa-body-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>Beranda</a>
                                    <a href="#how-it-works" className="pa-body-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>Cara Kerja</a>
                                    <a href="#become-joki" className="pa-body-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>Gabung Joki</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>Pengguna</h4>
                                    <Link href={route('login')} className="pa-body-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>Masuk Akun</Link>
                                    <Link href={route('register')} className="pa-body-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: 'var(--pa-text-muted)' }}>Daftar Baru</Link>
                                </div>
                                <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                    <h4 className="font-bold pa-label-caps" style={{ color: 'var(--pa-text-main)' }}>Hubungi Kami</h4>
                                    <div className="flex items-start gap-2 pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                        <span className="material-symbols-outlined text-lg shrink-0" style={{ color: 'var(--pa-primary)' }}>mail</span>
                                        <span>halo@pasarantar.id</span>
                                    </div>
                                    <div className="flex items-start gap-2 pa-body-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                        <span className="material-symbols-outlined text-lg shrink-0" style={{ color: 'var(--pa-primary)' }}>location_on</span>
                                        <span>Jakarta, Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-12 md:mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: 'rgba(199,196,215,0.4)' }}>
                            <p className="pa-label-caps text-center md:text-left" style={{ color: 'var(--pa-outline)' }}>
                                &copy; {new Date().getFullYear()} Pasar Antar. Hak Cipta Dilindungi.
                            </p>
                            <p className="pa-label-caps flex items-center justify-center gap-2" style={{ color: 'var(--pa-outline)' }}>
                                <span className="material-symbols-outlined text-[14px]">code</span>
                                Laravel v{laravelVersion} (PHP v{phpVersion})
                            </p>
                        </div>
                    </div>
                </footer>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden pa-bottom-nav">
                    <a href="#home" className={`pa-bottom-nav-item ${activeSection === 'home' ? 'active' : ''}`}>
                        <span className="material-symbols-outlined icon-fill">home</span>
                        <span className="pa-nav-label">Home</span>
                    </a>
                    <a href="#how-it-works" className={`pa-bottom-nav-item ${activeSection === 'how-it-works' ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="pa-nav-label">Cara Kerja</span>
                    </a>
                    <a href="#become-joki" className={`pa-bottom-nav-item ${activeSection === 'become-joki' ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">store</span>
                        <span className="pa-nav-label">Joki</span>
                    </a>
                    {auth.user && (
                        <Link href={route('dashboard')} className="pa-bottom-nav-item">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="pa-nav-label">Dashboard</span>
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
}
