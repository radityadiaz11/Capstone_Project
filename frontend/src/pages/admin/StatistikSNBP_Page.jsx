import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatistikSNBP_Page.css';
import api from '../../api/axios';

function StatistikSNBP_Page() {
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
    const [activeTab, setActiveTab] = useState('overview');

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
                console.error('Error fetching admin statistik:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalSiswa = data?.totalSiswa || 0;
    const amanCount = data?.distribusiRisiko?.rendah || 0;
    const berisikoCount = (data?.distribusiRisiko?.tinggi || 0) + (data?.distribusiRisiko?.sedang || 0);

    const amanPct = totalSiswa > 0 ? ((amanCount / totalSiswa) * 100).toFixed(1) : 0;
    const berisikoPct = totalSiswa > 0 ? ((berisikoCount / totalSiswa) * 100).toFixed(1) : 0;

    const kelasCount = data?.kelasPerforma?.length || 0;

    // ── Data Statistik ────────────────────────────────────────────────
    const statCards = [
        { label: 'Total Siswa Kelas XII', value: String(totalSiswa), sub: `${kelasCount} kelas paralel`, color: 'blue' },
        { label: 'Aman', value: String(amanCount), sub: `${amanPct}% dari total`, color: 'green' },
        { label: 'Siswa Berisiko', value: String(berisikoCount), sub: `${berisikoPct}% dari total`, color: 'red' },
    ];

    const distribusiData = [
        { label: 'Aman', count: amanCount, pct: parseFloat(amanPct), color: '#16a34a' },
        { label: 'Berisiko', count: berisikoCount, pct: parseFloat(berisikoPct), color: '#dc2626' },
    ];

    const kelasPerforma = data?.kelasPerforma?.length > 0 ? data.kelasPerforma.map(k => ({
        kelas: k.kelas,
        aman: k.aman,
        total: k.total,
        pct: k.pct,
        trend: '+0' // Placeholder for trend
    })) : [];

    const getPctStyle = (pct) => {
        if (pct >= 85) return { background: '#e8f5e9', color: '#2e7d32' };
        return { background: '#fdecea', color: '#c62828' };
    };

    const getTrendStyle = (t) =>
        t.startsWith('+') ? { color: '#16a34a' } : { color: '#dc2626' };

    return (
        <div className="snbs-container">

            {/* ── MOBILE HEADER ── */}
            <div className="snbs-mobile-header">
                <div className="snbs-mobile-brand">
                    <span className="snbs-mobile-brand-title">SNBP Monitor</span>
                    <span className="snbs-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="snbs-mobile-toggle"
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
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}>
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

                        <button className="dbs-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
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
            <div className="snbs-main">

                {/* Topbar */}
                <header className="snbs-topbar">
                    <div className="snbs-page-info">
                        <h2 className="snbs-page-title">Statistik SNBP</h2>
                        <p className="snbs-page-sub">SMA Negeri 1 Yogyakarta · Tahun Ajaran 2025/2026</p>
                    </div>
                    <div className="snbs-profile-info">
                        <div className="snbs-profile-text">
                            <span className="snbs-profile-name">{user.nama || 'ADMIN'}</span>
                            <span className="snbs-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="snbs-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                    </div>
                </header>

                {/* Content */}
                <main className="snbs-content">

                    {/* ── STAT CARDS ── */}
                    <div className="snbs-stats-grid">
                        {statCards.map((c) => (
                            <div key={c.label} className="snbs-stat-card">
                                <span className="snbs-stat-label">{c.label}</span>
                                <div className={`snbs-stat-value snbs-val-${c.color}`}>{loading ? '—' : c.value}</div>
                                <div className="snbs-stat-sub">{c.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── TAB NAV ── */}
                    <div className="snbs-tab-nav">
                        {[
                            { key: 'overview', label: 'Ringkasan' },
                            { key: 'distribusi', label: 'Distribusi' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                className={`snbs-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── TAB: OVERVIEW ── */}
                    {activeTab === 'overview' && (
                        <div className="snbs-tab-content">
                            <div className="snbs-two-col">

                                {/* Performa Per Kelas */}
                                <section className="snbs-card">
                                    <div className="snbs-card-header">
                                        <h3 className="snbs-card-title">Performa kesiapan per kelas</h3>
                                        <span className="snbs-badge-blue">{kelasCount} Kelas</span>
                                    </div>
                                    <div className="snbs-table-wrapper">
                                        <table className="snbs-table">
                                            <thead>
                                                <tr>
                                                    <th>Kelas</th>
                                                    <th>Aman</th>
                                                    <th>Total</th>
                                                    <th>% Aman</th>
                                                    <th>Tren</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
                                                ) : kelasPerforma.length === 0 ? (
                                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data</td></tr>
                                                ) : (
                                                    kelasPerforma.map((row) => (
                                                        <tr key={row.kelas}>
                                                            <td className="snbs-td-bold">{row.kelas}</td>
                                                            <td>{row.aman}</td>
                                                            <td className="snbs-td-muted">{row.total}</td>
                                                            <td>
                                                                <span className="snbs-pct-badge" style={getPctStyle(row.pct)}>
                                                                    {row.pct}%
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="snbs-trend" style={getTrendStyle(row.trend)}>
                                                                    {row.trend}%
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Right Column */}
                                <div className="snbs-right-stack">

                                    {/* Bar Chart Mini */}
                                    <section className="snbs-card">
                                        <h3 className="snbs-card-title">Kesiapan per kelas</h3>
                                        <div className="snbs-bar-chart">
                                            {loading ? (
                                                <div style={{ textAlign: 'center', padding: '20px' }}>Memuat grafik...</div>
                                            ) : kelasPerforma.map((row) => (
                                                <div key={row.kelas} className="snbs-bar-row">
                                                    <span className="snbs-bar-row-label">{row.kelas}</span>
                                                    <div className="snbs-bar-track">
                                                        <div
                                                            className="snbs-bar-fill"
                                                            style={{
                                                                width: `${row.pct}%`,
                                                                background: row.pct >= 85 ? '#16a34a' : '#dc2626',
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="snbs-bar-row-pct">{row.pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Ringkasan Singkat */}
                                    <section className="snbs-card">
                                        <h3 className="snbs-card-title">Ringkasan cepat</h3>
                                        <div className="snbs-summary-list">
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Kelas terbaik</span>
                                                <span className="snbs-summary-val snbs-val-green">XII Bahasa (92% Aman)</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Kelas perlu intervensi</span>
                                                <span className="snbs-summary-val snbs-val-red">XII IPS 1 (81% Aman)</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Rata-rata kesiapan</span>
                                                <span className="snbs-summary-val">{amanPct}%</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Update terakhir</span>
                                                <span className="snbs-summary-val">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: DISTRIBUSI ── */}
                    {activeTab === 'distribusi' && (
                        <div className="snbs-tab-content">
                            <div className="snbs-two-col">

                                {/* Donut Chart (CSS) */}
                                <section className="snbs-card snbs-donut-card">
                                    <h3 className="snbs-card-title">Distribusi kategori siswa</h3>
                                    <div className="snbs-donut-wrapper">
                                        <div className="snbs-donut">
                                            <div className="snbs-donut-center">
                                                <span className="snbs-donut-total">{loading ? '—' : totalSiswa}</span>
                                                <span className="snbs-donut-label">Siswa</span>
                                            </div>
                                        </div>
                                        <div className="snbs-donut-legend">
                                            {distribusiData.map((d) => (
                                                <div key={d.label} className="snbs-legend-row">
                                                    <span className="snbs-legend-dot" style={{ background: d.color }} />
                                                    <span className="snbs-legend-text">{d.label}</span>
                                                    <span className="snbs-legend-count" style={{ color: d.color }}>
                                                        {d.count}
                                                    </span>
                                                    <span className="snbs-legend-pct">({d.pct}%)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Progress bars distribusi */}
                                    <div className="snbs-dist-bars">
                                        {distribusiData.map((d) => (
                                            <div key={d.label} className="snbs-dist-row">
                                                <div className="snbs-dist-top">
                                                    <span className="snbs-dist-label">{d.label}</span>
                                                    <span className="snbs-dist-count">{d.count} siswa</span>
                                                </div>
                                                <div className="snbs-dist-track">
                                                    <div
                                                        className="snbs-dist-fill"
                                                        style={{ width: `${d.pct}%`, background: d.color }}
                                                    />
                                                </div>
                                                <span className="snbs-dist-pct">{d.pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Detail distribusi */}
                                <div className="snbs-right-stack">
                                    {distribusiData.map((d) => (
                                        <section key={d.label} className="snbs-card snbs-dist-detail-card">
                                            <div className="snbs-dist-detail-top">
                                                <span
                                                    className="snbs-dist-detail-dot"
                                                    style={{ background: d.color }}
                                                />
                                                <span className="snbs-dist-detail-label">{d.label}</span>
                                            </div>
                                            <div className="snbs-dist-detail-num" style={{ color: d.color }}>
                                                {d.count}
                                            </div>
                                            <div className="snbs-dist-detail-pct">{d.pct}% dari total siswa</div>
                                        </section>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}





                </main>
            </div>

        </div>
    );
}

export default StatistikSNBP_Page;
