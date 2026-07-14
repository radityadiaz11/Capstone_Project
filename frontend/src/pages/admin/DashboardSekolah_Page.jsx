import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSekolah_Page.css';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

function DashboardSekolah_Page() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: 'ADMIN', role: 'Kepala Sekolah' });
    const { logout } = useAuth(['admin']);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.success) {
                    setUser({ nama: res.data.data.nama, role: res.data.data.role === 'admin' ? 'Administrator' : 'Kepala Sekolah' });
                }
            } catch (err) {}
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/snbp-stats');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching admin dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalSiswa = data?.totalSiswa || 0;
    const amanCount = data?.distribusiRisiko?.rendah || 0;
    const berisikoCount = (data?.distribusiRisiko?.tinggi || 0) + (data?.distribusiRisiko?.sedang || 0);
    const avgScoreAll = data?.kelasPerforma?.length > 0
        ? Math.round(data.kelasPerforma.reduce((sum, k) => sum + (k.pct || 0), 0) / data.kelasPerforma.length)
        : 0;

    // Use API data or fallback
    const kelasData = data?.kelasPerforma?.length > 0 ? data.kelasPerforma.map((k, i) => ({
        kelas: k.kelas,
        wali: k.wali || `Wali Kelas ${i + 1}`,
        aman: k.aman,
        berisiko: k.total - k.aman,
        avgScore: k.pct,
        color: k.pct >= 80 ? '#185FA5' : k.pct >= 60 ? '#f59e0b' : '#dc2626'
    })) : [];

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

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/tambah-siswa'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">✚</span>
                            <span>Tambah Data Siswa</span>
                        </button>

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/tambah-role'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">👥</span>
                            <span>Tambah Role</span>
                        </button>

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>



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
                            <span className="dbs-profile-name">{user.nama || 'ADMIN'}</span>
                            <span className="dbs-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="dbs-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                    </div>
                </header>

                {/* Content */}
                <main className="dbs-content">

                    {/* === STAT CARDS ROW === */}
                    <div className="dbs-stats-grid">

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">Total siswa kelas XII</span>
                            <div className="dbs-stat-value dbs-val-blue">{loading ? '—' : totalSiswa}</div>
                            <div className="dbs-stat-sub">{kelasData.length} kelas paralel</div>
                        </div>

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">Aman</span>
                            <div className="dbs-stat-value dbs-val-green">{loading ? '—' : amanCount}</div>
                        </div>

                        <div className="dbs-stat-card">
                            <span className="dbs-stat-label">Siswa berisiko</span>
                            <div className="dbs-stat-value dbs-val-red">{loading ? '—' : berisikoCount}</div>
                            <div className="dbs-stat-sub dbs-sub-red">Perlu intervensi</div>
                        </div>

                    </div>

                    {/* === BOTTOM GRID: 2 Columns === */}
                    <div className="dbs-bottom-grid">

                        {/* LEFT: Rekap Tabel */}
                        <section className="dbs-card">
                            <div className="dbs-card-header">
                                <h3 className="dbs-card-title">Rekap kesiapan SNBP per kelas</h3>
                                <span className="dbs-badge-blue">{kelasData.length} Kelas</span>
                            </div>

                            <div className="dbs-table-wrapper">
                                <table className="dbs-table">
                                    <thead>
                                        <tr>
                                            <th>Kelas</th>
                                            <th>Wali Kelas</th>
                                            <th>Aman</th>
                                            <th className="dbs-th-berisiko">Berisiko</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
                                        ) : kelasData.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data</td></tr>
                                        ) : (
                                            kelasData.map((row) => (
                                                <tr key={row.kelas}>
                                                    <td className="dbs-td-kelas">{row.kelas}</td>
                                                    <td>{row.wali}</td>
                                                    <td>{row.aman}</td>
                                                    <td className="dbs-td-berisiko">{row.berisiko}</td>
                                                </tr>
                                            ))
                                        )}
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
                                        <span className="dbs-summary-label">Aman</span>
                                        <span className="dbs-summary-val dbs-val-green">{amanCount} / {totalSiswa}</span>
                                    </div>
                                    <div className="dbs-summary-row">
                                        <span className="dbs-summary-label">Rata-rata % Aman</span>
                                        <span className="dbs-summary-val">{avgScoreAll}%</span>
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
                    {/* === BAR CHART: Perbandingan Nilai Rapor === */}
                    <section className="dbs-card dbs-chart-card">
                        <h3 className="dbs-card-title">Perbandingan rata-rata nilai rapor antar kelas</h3>
                        <div className="dbs-chart-area">
                            {kelasData.map((row) => (
                                <div key={row.kelas} className="dbs-bar-wrapper" style={{ height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <div
                                            className="dbs-bar"
                                            style={{
                                                height: `${row.avgScore}%`,
                                                backgroundColor: row.color,
                                            }}
                                        >
                                            <span className="dbs-bar-pct">{row.avgScore}%</span>
                                        </div>
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
