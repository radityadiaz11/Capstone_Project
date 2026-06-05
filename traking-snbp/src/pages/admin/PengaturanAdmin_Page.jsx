import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PengaturanAdmin_Page.css';

function PengaturanAdmin_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    const infoSistem = [
        { label: 'Model AI aktif',       value: 'Gradient Boosting v2.1', valueClass: 'pga-val-bold'  },
        { label: 'Akurasi model',        value: '87.3%',                  valueClass: 'pga-val-green' },
        { label: 'Update terakhir',      value: '1 Mei 2026',             valueClass: 'pga-val-bold'  },
        { label: 'Versi aplikasi',       value: 'v1.4.2',                 valueClass: 'pga-val-bold'  },
        { label: 'Total pengguna aktif', value: '41',                     valueClass: 'pga-val-bold'  },
        { label: 'Sekolah',              value: 'SMA Negeri 1 Yogyakarta',valueClass: 'pga-val-bold'  },
    ];

    return (
        <div className="pga-container">

            {/* --- MOBILE HEADER --- */}
            <div className="dbs-mobile-header">
                <div className="dbs-mobile-brand">
                    <span className="dbs-mobile-brand-title">SNBP Monitor</span>
                    <span className="dbs-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="dbs-mobile-toggle"
                    aria-label="Toggle Menu"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`dbs-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    {/* Brand */}
                    <div className="dbs-brand">
                        <h1 className="dbs-brand-title">SNBP Monitor</h1>
                        <p className="dbs-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    {/* Role Badge */}
                    <div className="dbs-role-badge">
                        <span className="dbs-role-dot"></span>
                        <span>Admin / Kepsek</span>
                    </div>

                    {/* Navigation */}
                    <nav className="dbs-nav">
                        <span className="dbs-nav-label">Menu Utama</span>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">◎</span>
                            <span>Rekap Per Kelas</span>
                        </button>

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/statistik-snbp'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/ekspor-data'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="dbs-sidebar-bottom">
                    <button
                        className="dbs-nav-item"
                        onClick={() => { navigate('/admin/notifikasi'); setIsMobileMenuOpen(false); }}
                    >
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>

                    {/* Pengaturan — ACTIVE */}
                    <button
                        className="dbs-nav-item active"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span className="dbs-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button onClick={handleLogout} className="dbs-nav-item dbs-nav-logout">
                        <span className="dbs-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="pga-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Pengaturan</h2>
                        <p className="dbs-page-sub">Profil dan konfigurasi sistem</p>
                    </div>
                    <div className="dbs-profile-info">
                        <div className="dbs-profile-text">
                            <span className="dbs-profile-name">Bapak Hartono</span>
                            <span className="dbs-profile-role">Kepala Sekolah</span>
                        </div>
                        <div className="dbs-avatar">HT</div>
                    </div>
                </header>

                {/* Content */}
                <main className="pga-content">
                    <div className="pga-grid">

                        {/* ---- LEFT: Profil Admin ---- */}
                        <section className="pga-card">
                            <h3 className="pga-card-title">Profil Admin</h3>

                            {/* Avatar + Nama */}
                            <div className="pga-profile-head">
                                <div className="pga-avatar-lg">HT</div>
                                <div>
                                    <p className="pga-profile-name">Bapak Hartono, M.Pd</p>
                                    <p className="pga-profile-role">Kepala Sekolah · Administrator</p>
                                </div>
                            </div>

                            {/* Info Rows */}
                            <div className="pga-info-list">
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Email</span>
                                    <span className="pga-info-val pga-val-link">kepala@sman1yk.sch.id</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Level akses</span>
                                    <span className="pga-badge-superadmin">Super Admin</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Tahun ajaran aktif</span>
                                    <span className="pga-info-val pga-val-bold">2025/2026</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">KKM berlaku</span>
                                    <span className="pga-info-val pga-val-bold">75</span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                className="pga-edit-btn"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Simpan profil' : 'Edit profil'}
                            </button>
                        </section>

                        {/* ---- RIGHT: Info Sistem ---- */}
                        <section className="pga-card">
                            <h3 className="pga-card-title">Info Sistem</h3>

                            <div className="pga-info-list">
                                {infoSistem.map((item, idx) => (
                                    <div key={idx} className="pga-info-row">
                                        <span className="pga-info-label">{item.label}</span>
                                        <span className={`pga-info-val ${item.valueClass}`}>
                                            {item.value}
                                        </span>
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

export default PengaturanAdmin_Page;
