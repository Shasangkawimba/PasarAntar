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

                {/* Top Navigation - Glassmorphism & Brutalist pill */}
                <header
                    className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 flex justify-between items-center h-16 transition-all duration-300"
                    style={{
                        padding: '0 24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '999px',
                        border: '2px solid var(--pa-outline)',
                        boxShadow: '4px 4px 0px 0px var(--pa-outline)',
                    }}
                    id="top-nav"
                >
                    <div className="flex items-center gap-3">
                        <img src="/PasarAntar.png" alt="Pasar Antar" style={{ height: 40 }} />
                        <span style={{ color: 'var(--pa-text-main)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                            Pasar Antar
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#home" className="font-bold uppercase tracking-wider text-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: activeSection === 'home' ? 'var(--pa-primary)' : 'var(--pa-text-main)' }}>Home</a>
                        <a href="#how-it-works" className="font-bold uppercase tracking-wider text-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: activeSection === 'how-it-works' ? 'var(--pa-primary)' : 'var(--pa-text-main)' }}>Cara Kerja</a>
                        <a href="#become-joki" className="font-bold uppercase tracking-wider text-sm hover:text-[var(--pa-primary)] transition-colors" style={{ color: activeSection === 'become-joki' ? 'var(--pa-primary)' : 'var(--pa-text-main)' }}>Untuk Joki</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="pa-btn pa-btn-primary pa-btn-sm" style={{ padding: '0.5rem 1.25rem', minHeight: 'auto' }}>
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
                                <div className="hidden md:flex gap-3">
                                    <Link href={route('login')} className="pa-btn pa-btn-secondary pa-btn-sm" style={{ padding: '0.5rem 1.25rem', minHeight: 'auto' }}>
                                        Masuk
                                    </Link>
                                    <Link href={route('register')} className="pa-btn pa-btn-primary pa-btn-sm" style={{ padding: '0.5rem 1.25rem', minHeight: 'auto' }}>
                                        Daftar
                                    </Link>
                                </div>
                                <div className="md:hidden relative">
                                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full border-2 border-[var(--pa-outline)] flex items-center justify-center bg-white" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="material-symbols-outlined font-bold text-xl">menu</span>
                                    </button>
                                    {isMobileMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}></div>
                                            <div className="absolute right-0 mt-4 w-48 bg-white rounded-2xl p-2 z-50 overflow-hidden border-2 border-[var(--pa-outline)]" style={{ boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                                <Link href={route('login')} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-100 rounded-lg">Masuk</Link>
                                                <Link href={route('register')} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[var(--pa-primary)] hover:text-white rounded-lg mt-1 transition-colors">Daftar Sekarang</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow pt-28 pb-20 md:pb-12 w-full max-w-7xl mx-auto flex flex-col gap-y-16 md:gap-y-24 px-4 sm:px-6 lg:px-8">
                    {/* Hero Section - Vibrant Bento */}
                    <section className="flex flex-col md:grid md:grid-cols-2 md:gap-x-16 gap-y-12 items-center w-full mt-2 md:mt-8">
                        
                        {/* 1. Headline Block */}
                        <div className="flex flex-col gap-6 w-full z-10">
                            {/* Eyebrow Badge */}
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit border-2 border-[var(--pa-outline)] bg-[var(--pa-primary-fixed)]"
                                style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)', color: 'var(--pa-on-primary-fixed)' }}
                            >
                                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>storefront</span>
                                <span className="font-bold uppercase tracking-widest text-[10px]">Market Delivery</span>
                            </div>

                            {/* Headline */}
                            <h1 style={{ fontFamily: 'var(--pa-font-family)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--pa-text-main)', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05 }}>
                                Bahan segar dari{' '}
                                <span className="relative inline-block mt-2">
                                    <span className="relative z-10 px-4 py-1 bg-[var(--pa-primary)] text-white border-2 border-[var(--pa-outline)] rounded-2xl inline-block transform -rotate-1" style={{ boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                        pasar tradisional
                                    </span>
                                </span>
                                <br className="hidden md:block" />
                                <span className="mt-3 inline-block">langsung ke rumah Anda.</span>
                            </h1>
                        </div>

                        {/* 2. Description, CTA, & Benefits Block */}
                        <div className="flex flex-col gap-8 w-full z-10 md:row-start-2 md:col-start-1">
                            {/* Description */}
                            <p className="text-lg md:text-xl font-medium" style={{ color: 'var(--pa-text-muted)', maxWidth: 520, lineHeight: 1.6 }}>
                                Lewati keramaian pagi hari. Joki Pasar kami memilihkan sayur, daging, dan bumbu segar langsung dari pedagang lokal terpercaya.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                {auth.user ? (
                                    <Link href={route('markets.index')} className="pa-btn pa-btn-primary group" style={{ padding: '16px 32px', fontSize: '16px' }}>
                                        <span className="material-symbols-outlined icon-fill group-hover:rotate-12 transition-transform">shopping_basket</span>
                                        Mulai Belanja
                                    </Link>
                                ) : (
                                    <Link href={route('register')} className="pa-btn pa-btn-primary group" style={{ padding: '16px 32px', fontSize: '16px' }}>
                                        <span className="material-symbols-outlined icon-fill group-hover:rotate-12 transition-transform">shopping_basket</span>
                                        Mulai Belanja
                                    </Link>
                                )}
                                <a href="#become-joki" className="pa-btn pa-btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                                    <span className="material-symbols-outlined">motorcycle</span>
                                    Menjadi Joki
                                </a>
                            </div>

                            {/* Benefits/Keunggulan - Horizontal Scroll on Mobile, Grid on Desktop */}
                            <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 mt-8 pb-4 w-full max-w-full pa-scroll-hidden -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                                {/* Feature 1 */}
                                <div className="snap-center shrink-0 w-[140px] sm:w-auto flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-[var(--pa-outline)] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--pa-primary-fixed)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-primary)', boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="material-symbols-outlined icon-fill text-3xl">verified</span>
                                    </div>
                                    <span className="font-extrabold text-center uppercase tracking-wider" style={{ color: 'var(--pa-on-primary-fixed)', fontSize: '13px' }}>100% Segar</span>
                                </div>
                                {/* Feature 2 */}
                                <div className="snap-center shrink-0 w-[140px] sm:w-auto flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-[var(--pa-outline)] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--pa-secondary-container)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-secondary)', boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="material-symbols-outlined icon-fill text-3xl">payments</span>
                                    </div>
                                    <span className="font-extrabold text-center uppercase tracking-wider" style={{ color: 'var(--pa-on-secondary-container)', fontSize: '13px' }}>Harga Asli</span>
                                </div>
                                {/* Feature 3 */}
                                <div className="snap-center shrink-0 w-[140px] sm:w-auto flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-[var(--pa-outline)] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--pa-tertiary-fixed)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-tertiary)', boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="material-symbols-outlined icon-fill text-3xl">bolt</span>
                                    </div>
                                    <span className="font-extrabold text-center uppercase tracking-wider" style={{ color: '#0369a1', fontSize: '13px' }}>Kirim Cepat</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Image Block */}
                        <div className="w-full flex flex-col max-w-[360px] md:max-w-full mx-auto md:col-start-2 md:row-start-1 md:row-span-2 relative mt-6 md:mt-0 z-0">
                            <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-[40px] border-4 border-[var(--pa-outline)] bg-[var(--pa-primary-fixed)] overflow-hidden flex items-center justify-center" style={{ boxShadow: '8px 8px 0px 0px var(--pa-outline)' }}>
                                {/* Vibrant Background Pattern */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--pa-outline) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                
                                {/* Main Image */}
                                <img src="/market_hero.png" alt="Pasar Antar Market" className="w-4/5 h-auto object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                                
                                {/* Brutalist Rating Card (Inside) */}
                                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white px-4 py-3 rounded-2xl border-2 border-[var(--pa-outline)] flex items-center gap-3 z-20 hover:-translate-y-1 transition-transform" style={{ boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-[var(--pa-outline)] flex items-center justify-center overflow-hidden z-30"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" /></div>
                                        <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-[var(--pa-outline)] flex items-center justify-center overflow-hidden z-20"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" /></div>
                                        <div className="w-8 h-8 rounded-full bg-amber-300 border-2 border-[var(--pa-outline)] flex items-center justify-center z-10 text-[10px] font-black">+5k</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined icon-fill text-amber-400" style={{ fontSize: 16 }}>star</span>
                                            <span className="font-black text-sm">4.9/5</span>
                                        </div>
                                        <span className="font-bold text-[10px] uppercase tracking-wider text-gray-500">Rating Pengguna</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works — Bento Grid */}
                    <section className="flex flex-col gap-8 mt-12 md:mt-24" id="how-it-works">
                        <div className="text-center max-w-2xl mx-auto mb-4">
                            <h2 style={{ fontFamily: 'var(--pa-font-family)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--pa-text-main)', letterSpacing: '-0.02em' }}>
                                Bagaimana Pasar Antar Bekerja
                            </h2>
                            <p className="text-lg mt-4 font-medium" style={{ color: 'var(--pa-text-muted)' }}>
                                Koneksi mulus antara dapur Anda, joki belanja ahli, dan pasar tradisional penuh semangat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Step 1 */}
                            <div className="pa-bento-card-static p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-2 hover:bg-[var(--pa-primary-fixed)]">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--pa-primary)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-primary)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <span className="font-black text-2xl">1</span>
                                </div>
                                <h3 className="font-extrabold text-xl mb-3 uppercase tracking-wide">Pilih Pasar</h3>
                                <p className="font-medium flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Pilih pasar tradisional terdekat dan buat daftar belanja Anda melalui aplikasi dengan mudah dan praktis.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="pa-bento-card-static p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-2 hover:bg-[var(--pa-secondary-container)]">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--pa-secondary)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-secondary)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <span className="font-black text-2xl">2</span>
                                </div>
                                <h3 className="font-extrabold text-xl mb-3 uppercase tracking-wide">Joki Berbelanja</h3>
                                <p className="font-medium flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Joki berpengalaman akan memilihkan bahan terbaik dan segar dengan harga asli dari pedagang.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="pa-bento-card-static p-8 flex flex-col text-center items-center group transition-all hover:-translate-y-2 hover:bg-[var(--pa-tertiary-fixed)]">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--pa-tertiary)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white border-2 border-[var(--pa-outline)]" style={{ color: 'var(--pa-tertiary)', boxShadow: '4px 4px 0px 0px var(--pa-outline)' }}>
                                    <span className="font-black text-2xl">3</span>
                                </div>
                                <h3 className="font-extrabold text-xl mb-3 uppercase tracking-wide">Langsung Diantar</h3>
                                <p className="font-medium flex-grow" style={{ color: 'var(--pa-text-muted)', lineHeight: 1.6 }}>
                                    Belanjaan segera dikirim ke dapur Anda. Tanpa mampir ke gudang, dijamin kesegarannya.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Joki Section */}
                    <section className="mt-12 md:mt-24 mb-12" id="become-joki">
                        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 rounded-[40px] border-4 border-[var(--pa-outline)] relative overflow-hidden"
                            style={{ backgroundColor: 'var(--pa-primary)', color: 'var(--pa-on-primary)', boxShadow: '8px 8px 0px 0px var(--pa-outline)' }}
                        >
                            {/* Decorative background shapes */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>

                            <div className="flex-1 relative z-10">
                                <div className="inline-flex items-center px-3 py-1 bg-white text-[var(--pa-primary)] font-bold text-xs uppercase tracking-widest rounded-full border-2 border-[var(--pa-outline)] mb-4" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>Mitra Pasar & Joki</div>
                                <h3 className="font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.02em' }}>Hasilkan Pendapatan<br/>Sebagai Joki Pasar</h3>
                                <p className="mt-4 font-medium text-white/90 text-lg max-w-lg">
                                    Bergabunglah dengan jaringan kami dan bantu tetangga mendapatkan bahan segar sambil menghasilkan pendapatan yang adil. Jadwal fleksibel, komunitas yang mendukung.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Pendapatan</div>
                                        <div className="font-black text-xl text-white">Rp 150K+<span className="text-sm font-bold opacity-80">/hari</span></div>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Jadwal</div>
                                        <div className="font-black text-xl text-white">Fleksibel</div>
                                    </div>
                                </div>
                            </div>
                            {!auth.user && (
                                <div className="w-full md:w-auto relative z-10">
                                    <Link
                                        href={route('register')}
                                        className="w-full md:w-auto pa-btn flex items-center justify-center gap-3 bg-white text-[var(--pa-primary)] hover:bg-gray-50 active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0px_0px_var(--pa-outline)]"
                                        style={{ fontSize: '18px', padding: '20px 40px', borderRadius: '24px', border: '4px solid var(--pa-outline)', boxShadow: '6px 6px 0px 0px var(--pa-outline)' }}
                                    >
                                        <span className="material-symbols-outlined icon-fill text-2xl">motorcycle</span>
                                        Daftar Joki
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer - Brutalist */}
                <footer className="mt-auto border-t-4 border-[var(--pa-outline)] bg-[var(--pa-surface-container-low)]" style={{ color: 'var(--pa-text-main)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                            <div className="md:col-span-2 flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl border-2 border-[var(--pa-outline)] flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <img src="/PasarAntar.png" alt="Pasar Antar" className="h-8" />
                                    </div>
                                    <span className="font-black text-2xl tracking-tighter uppercase">Pasar Antar</span>
                                </div>
                                <p className="font-medium text-lg max-w-sm" style={{ color: 'var(--pa-text-muted)' }}>
                                    Memberdayakan pasar tradisional melalui teknologi pengiriman modern dan handal.
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <a href="#" className="w-12 h-12 bg-white border-2 border-[var(--pa-outline)] rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="font-black">FB</span>
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-[var(--pa-primary-fixed)] border-2 border-[var(--pa-outline)] rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="font-black">IG</span>
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-[var(--pa-tertiary-fixed)] border-2 border-[var(--pa-outline)] rounded-full flex items-center justify-center hover:-translate-y-1 transition-transform" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>
                                        <span className="font-black">X</span>
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h4 className="font-black text-xl uppercase tracking-wider mb-2">Tautan</h4>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Tentang Kami</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Mitra Pasar</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Karir Joki</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Blog</a>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h4 className="font-black text-xl uppercase tracking-wider mb-2">Bantuan</h4>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Pusat Bantuan</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Syarat & Ketentuan</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Kebijakan Privasi</a>
                                <a href="#" className="font-bold hover:text-[var(--pa-primary)] transition-colors inline-block w-fit relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-[var(--pa-primary)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Kontak</a>
                            </div>
                        </div>
                        <div className="mt-16 pt-8 border-t-4 border-[var(--pa-outline)] flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="font-bold" style={{ color: 'var(--pa-text-muted)' }}>&copy; {new Date().getFullYear()} Pasar Antar. Hak cipta dilindungi.</p>
                            <div className="flex gap-4 items-center">
                                <span className="font-bold px-3 py-1 bg-white border-2 border-[var(--pa-outline)] rounded-full text-xs uppercase" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>ID</span>
                                <span className="font-bold px-3 py-1 bg-gray-200 border-2 border-[var(--pa-outline)] rounded-full text-xs uppercase" style={{ boxShadow: '2px 2px 0px 0px var(--pa-outline)' }}>EN</span>
                                <p className="ml-4 font-bold text-xs flex items-center justify-center gap-2" style={{ color: 'var(--pa-text-muted)' }}>
                                    <span className="material-symbols-outlined text-[14px]">code</span>
                                    Laravel v{laravelVersion} (PHP v{phpVersion})
                                </p>
                            </div>
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
