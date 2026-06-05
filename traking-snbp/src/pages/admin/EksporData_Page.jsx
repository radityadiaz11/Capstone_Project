import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EksporData_Page.css';

function EksporData_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loadingItem, setLoadingItem] = useState(null);

    const handleLogout = () => {
        navigate('/');
    };

    const handleExport = (type) => {
        setLoadingItem(type);
        setTimeout(() => setLoadingItem(null), 1800);
    };

    const riwayatEkspor = [
        { label: 'Laporan Kesiapan April 2026', type: 'PDF', typeClass: 'ekd-badge-pdf' },
        { label: 'Data Nilai Sem. 5 Semua Kelas', type: 'Excel', typeClass: 'ekd-badge-excel' },
        { label: 'Laporan Kesiapan Maret 2026', type: 'PDF', typeClass: 'ekd-badge-pdf' },
    ];

    return (
        <div className="ekd-container">

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
                            onClick={() => { navigate('/admin/statistik'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button
                            className="dbs-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="dbs-sidebar-bottom">
                    <button className="dbs-nav-item"
                        onClick={() => { navigate('/admin/notifikasi'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>

                    <button className="dbs-nav-item"
                        onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}>
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
            <div className="ekd-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Ekspor Data</h2>
                        <p className="dbs-page-sub">Pilih data yang ingin diekspor</p>
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
                <main className="ekd-content">
                    <div className="ekd-grid">

                        {/* ---- LEFT: Ekspor Cards ---- */}
                        <div className="ekd-left">

                            {/* Card 1: Laporan Kesiapan SNBP */}
                            <div className="ekd-card">
                                <div className="ekd-card-header">
                                    <div>
                                        <h3 className="ekd-card-title">Laporan kesiapan SNBP</h3>
                                        <p className="ekd-card-desc">
                                            Ringkasan status kesiapan, prediksi, dan rekomendasi per kelas.
                                        </p>
                                    </div>
                                    <span className="ekd-badge ekd-badge-pdf">PDF</span>
                                </div>
                                <button
                                    className={`ekd-btn ${loadingItem === 'pdf' ? 'ekd-btn-loading' : ''}`}
                                    onClick={() => handleExport('pdf')}
                                    disabled={loadingItem === 'pdf'}
                                >
                                    {loadingItem === 'pdf' ? (
                                        <span className="ekd-spinner"></span>
                                    ) : (
                                        <>Buat laporan <span className="ekd-btn-arrow">↗</span></>
                                    )}
                                </button>
                            </div>

                            {/* Card 2: Data Nilai Seluruh Siswa */}
                            <div className="ekd-card">
                                <div className="ekd-card-header">
                                    <div>
                                        <h3 className="ekd-card-title">Data nilai seluruh siswa</h3>
                                        <p className="ekd-card-desc">
                                            Semua nilai per mata pelajaran semester 1–5 dalam format spreadsheet.
                                        </p>
                                    </div>
                                    <span className="ekd-badge ekd-badge-excel">Excel</span>
                                </div>
                                <button
                                    className={`ekd-btn ${loadingItem === 'excel' ? 'ekd-btn-loading' : ''}`}
                                    onClick={() => handleExport('excel')}
                                    disabled={loadingItem === 'excel'}
                                >
                                    {loadingItem === 'excel' ? (
                                        <span className="ekd-spinner"></span>
                                    ) : (
                                        <>Ekspor Excel <span className="ekd-btn-arrow">↗</span></>
                                    )}
                                </button>
                            </div>



                        </div>

                        {/* ---- RIGHT: Riwayat Ekspor ---- */}
                        <div className="ekd-right">
                            <div className="ekd-card ekd-riwayat-card">
                                <h3 className="ekd-card-title">Riwayat ekspor</h3>
                                <div className="ekd-riwayat-list">
                                    {riwayatEkspor.map((item, idx) => (
                                        <div key={idx} className="ekd-riwayat-item">
                                            <span className="ekd-riwayat-label">{item.label}</span>
                                            <span className={`ekd-badge ${item.typeClass}`}>{item.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

        </div>
    );
}

export default EksporData_Page;
