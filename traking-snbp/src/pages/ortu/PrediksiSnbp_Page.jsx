import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrediksiSnbp_Page.css';

function PrediksiSnbp_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => navigate('/');

    // Faktor-faktor yang mempengaruhi prediksi
    const factors = [
        { name: 'Nilai rapor (bobot 60%)', value: 'Rendah — 58.1', type: 'red' },
        { name: 'Kehadiran (bobot 25%)', value: 'Rendah — 72%', type: 'red' },
        { name: 'Ekstrakurikuler (bobot 10%)', value: 'Tidak ada', type: 'muted' },
        { name: 'Tren nilai (bobot 5%)', value: 'Menurun', type: 'red' },
    ];

    // Rekomendasi aksi untuk orang tua
    const actions = [
        {
            dot: 'blue',
            label: 'Tingkatkan kehadiran — target minimal 90% bulan depan',
            sub: 'Segera',
            subType: 'urgent',
        },
        {
            dot: 'orange',
            label: 'Bimbel Matematika & Kimia — nilai perlu naik di atas KKM 75',
            sub: 'Minggu ini',
            subType: 'warn',
        },
        {
            dot: 'teal',
            label: 'Daftar ekstrakurikuler — menambah poin non-akademik',
            sub: 'Bulan ini',
            subType: 'info',
        },
        {
            dot: 'grey',
            label: 'Hadiri sesi konseling bersama wali kelas Ibu Sari',
            sub: '5 Mei 2026',
            subType: 'neutral',
        },
    ];

    // SVG donut: r=46, circumference ≈ 289, 41% filled → dashoffset = 289*(1-0.41) ≈ 170
    const CIRC = 289;
    const pct = 41;
    const offset = CIRC * (1 - pct / 100);

    return (
        <div className="ps-container">

            {/* --- MOBILE HEADER --- */}
            <div className="ps-mobile-header">
                <div className="ps-mobile-brand">
                    <span className="ps-mobile-brand-title">SNBP Monitor</span>
                    <span className="ps-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    className="ps-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(v => !v)}
                    aria-label="Toggle Menu"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        {isMobileMenuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`ps-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    <div className="ps-brand">
                        <h1 className="ps-brand-title">SNBP Monitor</h1>
                        <p className="ps-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    <div className="ps-role-badge">
                        <span className="ps-role-dot"></span>
                        <span>Orang Tua</span>
                    </div>

                    <nav className="ps-nav">
                        <span className="ps-nav-label">Menu</span>

                        <button
                            className="ps-nav-item"
                            onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="ps-nav-icon">⊞</span>
                            <span>Beranda</span>
                        </button>

                        <button
                            className="ps-nav-item"
                            onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="ps-nav-icon">≡</span>
                            <span>Nilai Rapor</span>
                        </button>

                        <button
                            className="ps-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="ps-nav-icon">◎</span>
                            <span>Prediksi SNBP</span>
                        </button>

                        <button
                            className="ps-nav-item"
                            onClick={() => { navigate('/ortu/pesan-guru'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="ps-nav-icon">✉</span>
                            <span>Pesan Guru</span>
                        </button>
                    </nav>
                </div>

                <div className="ps-sidebar-bottom">
                    <button
                        className="ps-nav-item"
                        onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
                    >
                        <span className="ps-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="ps-notif-badge">3</span>
                    </button>

                    <button
                        className="ps-nav-item"
                        onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
                    >
                        <span className="ps-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button className="ps-nav-item ps-nav-logout" onClick={handleLogout}>
                        <span className="ps-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="ps-main">

                {/* Sticky Topbar */}
                <header className="ps-topbar">
                    <div className="ps-page-info">
                        <h2 className="ps-page-title">Prediksi SNBP</h2>
                        <p className="ps-page-sub">Estimasi peluang lolos SNBP Farhan Hidayat</p>
                    </div>
                    <div className="ps-profile-info">
                        <div className="ps-profile-text">
                            <span className="ps-profile-name">Bapak Hidayat</span>
                            <span className="ps-profile-role">Orang Tua Farhan</span>
                        </div>
                        <div className="ps-avatar">HN</div>
                    </div>
                </header>

                {/* Content */}
                <main className="ps-content">
                    <div className="ps-grid">

                        {/* ===== KIRI: Prediksi Card ===== */}
                        <section className="ps-card">

                            {/* Gauge + Status */}
                            <div className="ps-gauge-row">

                                {/* SVG Donut */}
                                <div className="ps-donut-wrap">
                                    <svg className="ps-donut-svg" viewBox="0 0 120 120">
                                        <circle className="ps-donut-bg" cx="60" cy="60" r="46" />
                                        <circle
                                            className="ps-donut-fill"
                                            cx="60" cy="60" r="46"
                                            strokeDasharray={CIRC}
                                            strokeDashoffset={offset}
                                        />
                                    </svg>
                                    <div className="ps-donut-label">
                                        <span className="ps-donut-pct">{pct}%</span>
                                        <span className="ps-donut-text">peluang lolos</span>
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="ps-status-block">
                                    <h3 className="ps-status-title">Status: Berisiko</h3>
                                    <p className="ps-status-desc">
                                        Prediksi AI berdasarkan nilai rapor semester 1–5, kehadiran, dan faktor akademik lainnya.
                                    </p>
                                    <div className="ps-status-tags">
                                        <span className="ps-tag red">Nilai rendah</span>
                                        <span className="ps-tag red">Kehadiran rendah</span>
                                    </div>
                                </div>
                            </div>

                            {/* Faktor */}
                            <div className="ps-factors-title">Faktor yang mempengaruhi prediksi</div>
                            <div className="ps-factor-list">
                                {factors.map((f, i) => (
                                    <div key={i} className="ps-factor-row">
                                        <span className="ps-factor-name">{f.name}</span>
                                        <span className={`ps-factor-val ${f.type}`}>{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ===== KANAN: Aksi Card ===== */}
                        <section className="ps-card">
                            <div className="ps-action-title">Yang bisa dilakukan sekarang</div>
                            <div className="ps-action-list">
                                {actions.map((a, i) => (
                                    <div key={i} className="ps-action-item">
                                        <span className={`ps-action-dot ${a.dot}`}></span>
                                        <div className="ps-action-body">
                                            <span className="ps-action-label">{a.label}</span>
                                            <span className={`ps-action-sub ${a.subType}`}>{a.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

        </div>
    );
}

export default PrediksiSnbp_Page;
