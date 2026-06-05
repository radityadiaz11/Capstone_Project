import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSekolah_Page.css';

function DashboardSekolah_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    // Data rekap per kelas
    const kelasData = [
        { kelas: 'XII IPA 1', wali: 'Ibu Sari R.', siap: 22, perhatian: 9, berisiko: 5, prediksi: 61, color: '#185FA5' },
        { kelas: 'XII IPA 2', wali: 'Bp. Andi W.', siap: 25, perhatian: 7, berisiko: 4, prediksi: 69, color: '#185FA5' },
        { kelas: 'XII IPA 3', wali: 'Ibu Dewi K.', siap: 20, perhatian: 10, berisiko: 6, prediksi: 56, color: '#185FA5' },
        { kelas: 'XII IPS 1', wali: 'Bp. Rudi S.', siap: 18, perhatian: 11, berisiko: 7, prediksi: 50, color: '#f59e0b' },
        { kelas: 'XII IPS 2', wali: 'Ibu Lestari', siap: 21, perhatian: 9, berisiko: 6, prediksi: 58, color: '#f59e0b' },
        { kelas: 'XII Bahasa', wali: 'Ibu Ratna M.', siap: 16, perhatian: 12, berisiko: 3, prediksi: 52, color: '#94a3b8' },
    ];

    const getPrediksiStyle = (val) => {
        if (val >= 65) return { background: '#e8f5e9', color: '#2e7d32' };
        if (val >= 55) return { background: '#fff8e1', color: '#f59e0b' };
        return { background: '#fdecea', color: '#c62828' };
    };

    return (
        <div className="dbs-container">

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
                    <div className="dbs-brand">
                        <h1 className="dbs-brand-title">SNBP Monitor</h1>
                        <p className="dbs-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    <div className="dbs-role-badge">
                        <span className="dbs-role-dot"></span>
                        <span>Admin / Kepsek</span>
                    </div>

                    <nav className="dbs-nav">
                        <span className="dbs-nav-label">Menu Utama</span>

                        <button className="dbs-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="dbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>

                        <button className="dbs-nav-item"
                            onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">◎</span>
                            <span>Rekap Per Kelas</span>
                        </button>

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button className="dbs-nav-item"
                            onClick={() => { navigate('/admin/statistik'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button className="dbs-nav-item"
                            onClick={() => { navigate('/admin/ekspor'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

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
            <div className="dbs-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Dashboard Sekolah</h2>
                        <p className="dbs-page-sub">SMA Negeri 1 Yogyakarta · Tahun Ajaran 2025/2026</p>
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
                <main className="dbs-content">

                    {/* === STAT CARDS ROW === */}
                    <div className="dbs-stats-grid">

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">Total siswa kelas XII</span>
                            <div className="dbs-stat-value dbs-val-blue">216</div>
                            <div className="dbs-stat-sub">6 kelas paralel</div>
                        </div>

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">On track</span>
                            <div className="dbs-stat-value dbs-val-green">142</div>
                        </div>

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">Siswa berisiko</span>
                            <div className="dbs-stat-value dbs-val-red">31</div>
                            <div className="dbs-stat-sub dbs-sub-red">Perlu intervensi</div>
                        </div>

                    </div>

                    {/* === BOTTOM GRID: 2 Columns === */}
                    <div className="dbs-bottom-grid">

                        {/* LEFT: Rekap Tabel */}
                        <section className="dbs-card">
                            <div className="dbs-card-header">
                                <h3 className="dbs-card-title">Rekap kesiapan SNBP per kelas</h3>
                                <span className="dbs-badge-blue">6 Kelas</span>
                            </div>

                            <div className="dbs-table-wrapper">
                                <table className="dbs-table">
                                    <thead>
                                        <tr>
                                            <th>Kelas</th>
                                            <th>Wali Kelas</th>
                                            <th>Siap</th>
                                            <th className="dbs-th-berisiko">Berisiko</th>
                                            <th>Prediksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kelasData.map((row) => (
                                            <tr key={row.kelas}>
                                                <td className="dbs-td-kelas">{row.kelas}</td>
                                                <td>{row.wali}</td>
                                                <td>{row.siap}</td>
                                                <td className="dbs-td-berisiko">{row.berisiko}</td>
                                                <td>
                                                    <span
                                                        className="dbs-prediksi-badge"
                                                        style={getPrediksiStyle(row.prediksi)}
                                                    >
                                                        {row.prediksi}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* RIGHT: Ringkasan + Aktivitas */}
                        <div className="dbs-right-stack">

                            {/* Ringkasan Sekolah */}
                            <section className="dbs-card">
                                <h3 className="dbs-card-title">Ringkasan sekolah</h3>
                                <div className="dbs-summary-list">
                                    <div className="dbs-summary-row">
                                        <span className="dbs-summary-label">On track</span>
                                        <span className="dbs-summary-val dbs-val-green">142 / 216</span>
                                    </div>
                                    <div className="dbs-summary-row">
                                        <span className="dbs-summary-label">Rata-rata nilai</span>
                                        <span className="dbs-summary-val">81.3</span>
                                    </div>
                                    <div className="dbs-summary-row">
                                        <span className="dbs-summary-label">Kehadiran rata-rata</span>
                                        <span className="dbs-summary-val">93%</span>
                                    </div>
                                </div>
                            </section>

                            {/* Aktivitas Terbaru */}
                            <section className="dbs-card">
                                <h3 className="dbs-card-title">Aktivitas terbaru</h3>
                                <div className="dbs-activity-list">

                                    <div className="dbs-activity-item">
                                        <div className="dbs-activity-icon dbs-icon-success">✓</div>
                                        <div className="dbs-activity-text">
                                            <p className="dbs-activity-msg">XII IPA 2: input nilai sem. 5 selesai 100%</p>
                                            <span className="dbs-activity-time">2 jam lalu</span>
                                        </div>
                                    </div>

                                    <div className="dbs-activity-item">
                                        <div className="dbs-activity-icon dbs-icon-warn">⚠</div>
                                        <div className="dbs-activity-text">
                                            <p className="dbs-activity-msg">XII IPS 1: 7 siswa berisiko perlu perhatian</p>
                                            <span className="dbs-activity-time">Hari ini, 08.00</span>
                                        </div>
                                    </div>

                                </div>
                            </section>

                        </div>
                    </div>

                    {/* === BAR CHART: Perbandingan Prediksi === */}
                    <section className="dbs-card dbs-chart-card">
                        <h3 className="dbs-card-title">Perbandingan prediksi lolos antar kelas</h3>
                        <div className="dbs-chart-area">
                            {kelasData.map((row) => (
                                <div key={row.kelas} className="dbs-bar-wrapper">
                                    <div
                                        className="dbs-bar"
                                        style={{
                                            height: `${row.prediksi * 2.2}px`,
                                            backgroundColor: row.color,
                                        }}
                                    >
                                        <span className="dbs-bar-pct">{row.prediksi}%</span>
                                    </div>
                                    <span className="dbs-bar-label">{row.kelas}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>

        </div>
    );
}

export default DashboardSekolah_Page;
