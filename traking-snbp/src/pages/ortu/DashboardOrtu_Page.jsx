import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardOrtu_Page.css';

function DashboardOrtu_Page() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('beranda');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    // Mock data for student progress with exact hex colors
    const subjects = [
        { name: 'Matematika', score: 62, color: '#A32D2D' },
        { name: 'Bahasa Indonesia', score: 58, color: '#A32D2D' },
        { name: 'Biologi', score: 60, color: '#A32D2D' },
        { name: 'Kimia', score: 56, color: '#A32D2D' },
        { name: 'Fisika', score: 65, color: '#ff9f1c' },
    ];

    return (
        <div className="db-ortu-container">

            {/* --- MOBILE HEADER & TOGGLE --- */}
            <div className="db-ortu-mobile-header">
                <div className="db-ortu-mobile-brand">
                    <span className="db-ortu-mobile-brand-title">SNBP Monitor</span>
                    <span className="db-ortu-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="db-ortu-mobile-toggle"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`db-ortu-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    {/* Logo Brand */}
                    <div className="db-ortu-brand">
                        <h1 className="db-ortu-brand-title">SNBP Monitor</h1>
                        <p className="db-ortu-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    {/* Role Badge - Teal #0D7A7A */}
                    <div>
                        <div className="db-ortu-role-badge">
                            <span className="db-ortu-role-dot"></span>
                            <span>Orang Tua</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="db-ortu-nav">
                        <span className="db-ortu-nav-label">Menu</span>

                        <button
                            onClick={() => { setActiveTab('beranda'); setIsMobileMenuOpen(false); }}
                            className={`db-ortu-nav-item ${activeTab === 'beranda' ? 'active' : ''}`}
                        >
                            <span className="db-ortu-nav-icon">⊞</span>
                            <span>Beranda</span>
                        </button>

                        <button
                            onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
                            className={`db-ortu-nav-item ${activeTab === 'rapor' ? 'active' : ''}`}
                        >
                            <span className="db-ortu-nav-icon">≡</span>
                            <span>Nilai Rapor</span>
                        </button>

                        <button
                            onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
                            className={`db-ortu-nav-item ${activeTab === 'prediksi' ? 'active' : ''}`}
                        >
                            <span className="db-ortu-nav-icon">◎</span>
                            <span>Prediksi SNBP</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom Area */}
                <div className="db-ortu-sidebar-bottom">
                    <button
                        onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
                        className={`db-ortu-nav-item ${activeTab === 'notifikasi' ? 'active' : ''}`}
                    >
                        <span className="db-ortu-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        {/* Red Badge #A32D2D */}
                        <span className="db-ortu-notif-badge">2</span>
                    </button>

                    <button
                        onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
                        className={`db-ortu-nav-item ${activeTab === 'pengaturan' ? 'active' : ''}`}
                    >
                        <span className="db-ortu-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="db-ortu-nav-item db-ortu-nav-logout"
                    >
                        <span className="db-ortu-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA (RIGHT) --- */}
            <div className="db-ortu-main">

                {/* Sticky Topbar */}
                <header className="db-ortu-topbar">
                    <div className="db-ortu-page-info">
                        <h2 className="db-ortu-page-title">Beranda</h2>
                        <p className="db-ortu-page-sub">Pantau perkembangan akademik Farhan Hidayat</p>
                    </div>

                    {/* User Profile + Avatar */}
                    <div className="db-ortu-profile-info">
                        <div className="db-ortu-profile-text">
                            <span className="db-ortu-profile-name">Bapak Hidayat</span>
                            <span className="db-ortu-profile-role">Orang Tua Farhan</span>
                        </div>
                        {/* Avatar using blue #185FA5 details */}
                        <div className="db-ortu-avatar">
                            HN
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="db-ortu-content">

                    {/* Alert Banner Merah - #A32D2D */}
                    <div className="db-ortu-alert-banner">
                        <div className="db-ortu-alert-left">
                            <div className="db-ortu-alert-icon">
                                ⚠️
                            </div>
                            <div className="db-ortu-alert-text">
                                <h3 className="db-ortu-alert-title">
                                    Perhatian diperlukan untuk Farhan Hidayat
                                </h3>
                                <p className="db-ortu-alert-desc">
                                    Nilai rata-rata: 58.1 &bull; Kehadiran: 72%
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/ortu/nilai')}
                            className="db-ortu-alert-btn"
                        >
                            Lihat Rapor &rarr;
                        </button>
                    </div>

                    {/* 2 Metric Cards - Burgundy Red #A32D2D */}
                    <div className="db-ortu-stats-grid">

                        {/* Card 1: Rata-rata Nilai */}
                        <div className="db-ortu-stat-card">
                            <span className="db-ortu-stat-label">Rata-rata nilai</span>
                            <div className="db-ortu-stat-value">58.1</div>
                            <div className="db-ortu-stat-sub">
                                <span>↓</span> dari 65.3
                            </div>
                        </div>

                        {/* Card 2: Kehadiran */}
                        <div className="db-ortu-stat-card">
                            <span className="db-ortu-stat-label">Kehadiran bulan ini</span>
                            <div className="db-ortu-stat-value">72%</div>
                            <div className="db-ortu-stat-sub">
                                Di bawah standar 85%
                            </div>
                        </div>

                    </div>

                    {/* 2 Kolom Layout */}
                    <div className="db-ortu-bottom-grid">

                        {/* KOLOM KIRI: Card nilai per mapel dengan progress bar (Grid col-span 7) */}
                        <section className="db-ortu-card">
                            <div className="db-ortu-card-header">
                                <h3 className="db-ortu-card-title">Nilai per mata pelajaran</h3>

                                {/* Semester Indicator - Blue #185FA5 */}
                                <span className="db-ortu-semester-badge">
                                    Sem. 5
                                </span>
                            </div>

                            {/* Subject Rows */}
                            <div className="db-ortu-subject-list">
                                {subjects.map((sub) => (
                                    <div key={sub.name} className="db-ortu-subject-row">
                                        {/* Mapel Name */}
                                        <span className="db-ortu-subject-name">{sub.name}</span>

                                        {/* Progress Bar Track */}
                                        <div className="db-ortu-progress-track">
                                            <div
                                                className="db-ortu-progress-fill"
                                                style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                                            />
                                        </div>

                                        {/* Score Value */}
                                        <span className="db-ortu-progress-score">{sub.score}</span>
                                    </div>
                                ))}
                            </div>

                            {/* KKM Warning Label */}
                            <div className="db-ortu-kkm-note">
                                KKM: 75 &bull; Semua nilai masih di bawah KKM
                            </div>
                        </section>

                        {/* KOLOM KANAN: Card Sesi Konseling (Grid col-span 5) */}
                        <div className="db-ortu-right-stack">

                            {/* Card Sesi Konseling Terjadwal */}
                            <section className="db-ortu-card">
                                <h3 className="db-ortu-card-title">Sesi konseling terjadwal</h3>

                                <div className="db-ortu-list-rows">
                                    <div className="db-ortu-list-row">
                                        <span className="db-ortu-list-label">Tanggal</span>
                                        <span className="db-ortu-list-val">5 Mei 2026</span>
                                    </div>
                                    <div className="db-ortu-list-row">
                                        <span className="db-ortu-list-label">Topik</span>
                                        <span className="db-ortu-list-val">Motivasi & kehadiran</span>
                                    </div>
                                </div>

                                <div>
                                    {/* Badge using Teal #0D7A7A details */}
                                    <span className="db-ortu-teal-badge">
                                        Terjadwal
                                    </span>
                                </div>
                            </section>

                        </div>

                    </div>

                </main>
            </div>

        </div>
    );
}

export default DashboardOrtu_Page;
