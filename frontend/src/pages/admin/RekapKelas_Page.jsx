import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RekapKelas_Page.css';
import api from '../../api/axios';

function RekapKelas_Page() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: 'ADMIN', role: 'Kepala Sekolah' });

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', {
            replace: true
        });
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
                console.error('Error fetching rekap kelas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const kelasData = data?.kelasPerforma?.length > 0 ? data.kelasPerforma.map((k, i) => ({
        kelas: k.kelas,
        labelPendek: k.kelas.replace('XII ', ''),
        wali: k.wali || `Wali Kelas ${i + 1}`,
        total: k.total,
        aman: k.aman,
        berisiko: k.total - k.aman,
        avgScore: k.pct,
        barColor: k.pct >= 85 ? '#1d4ed8' : k.pct >= 75 ? '#3b82f6' : k.pct >= 60 ? '#f59e0b' : '#dc2626'
    })) : [];

    const MAX_BAR_HEIGHT = 160;
    const maxScore = kelasData.length > 0 ? Math.max(...kelasData.map(d => d.avgScore)) : 100;

    return (
        <div className="rkp-container">

            {/* ── MOBILE HEADER ── */}
            <div className="rkp-mobile-header">
                <div className="rkp-mobile-brand">
                    <span className="rkp-mobile-brand-title">SNBP Monitor</span>
                    <span className="rkp-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rkp-mobile-toggle"
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

            {/* ── SIDEBAR ── */}
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

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>
                        <button className="dbs-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
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

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/statistik'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/ekspor'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                <div className="dbs-sidebar-bottom">

                    <button className="dbs-nav-item" onClick={() => { navigate('/admin/notifikasi'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>
                    <button className="dbs-nav-item" onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button onClick={handleLogout} className="dbs-nav-item dbs-nav-logout">
                        <span className="dbs-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="rkp-main">

                <header className="rkp-topbar">
                    <div className="rkp-page-info">
                        <h2 className="rkp-page-title">Rekap Per Kelas</h2>
                        <p className="rkp-page-sub">Data kesiapan SNBP seluruh kelas XII</p>
                    </div>
                    <div className="rkp-profile-info">
                        <div className="rkp-profile-text">
                            <span className="rkp-profile-name">{user.nama || 'ADMIN'}</span>
                            <span className="rkp-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="rkp-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                    </div>
                </header>

                <main className="rkp-content">

                    <section className="rkp-card">
                        <div className="rkp-table-wrapper">
                            <table className="rkp-table">
                                <thead>
                                    <tr>
                                        <th>Kelas</th>
                                        <th>Wali Kelas</th>
                                        <th>Total Siswa</th>
                                        <th className="rkp-th-siap">Aman</th>
                                        <th className="rkp-th-berisiko">Berisiko</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
                                    ) : kelasData.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data</td></tr>
                                    ) : (
                                        kelasData.map((row, idx) => (
                                            <tr key={row.kelas} className={idx % 2 === 0 ? 'rkp-row-even' : ''}>
                                                <td className="rkp-td-kelas">{row.kelas}</td>
                                                <td className="rkp-td-wali">{row.wali}</td>
                                                <td>{row.total}</td>
                                                <td className="rkp-td-siap">{row.aman}</td>
                                                <td className="rkp-td-berisiko">{row.berisiko}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rkp-card rkp-chart-card">
                        <h3 className="rkp-chart-title">Visualisasi rata-rata nilai rapor per kelas</h3>
                        <div className="rkp-chart-area">
                            {loading ? (
                                <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat visualisasi...</div>
                            ) : kelasData.length === 0 ? (
                                <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Belum ada data</div>
                            ) : (
                                kelasData.map((row) => {
                                    const barH = Math.round((row.avgScore / maxScore) * MAX_BAR_HEIGHT);
                                    return (
                                        <div key={row.kelas} className="rkp-bar-col">
                                            <div className="rkp-bar-track">
                                                <div
                                                    className="rkp-bar"
                                                    style={{ height: `${barH}px`, backgroundColor: row.barColor }}
                                                >
                                                    <span className="rkp-bar-pct">{row.avgScore}%</span>
                                                </div>
                                            </div>
                                            <span className="rkp-bar-label">{row.labelPendek}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                </main>
            </div>

        </div>
    );
}

export default RekapKelas_Page;