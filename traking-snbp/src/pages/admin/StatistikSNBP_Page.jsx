import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatistikSNBP_Page.css';

function StatistikSNBP_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        navigate('/');
    };

    // ── Data Statistik ────────────────────────────────────────────────
    const statCards = [
        { label: 'Total Siswa Kelas XII', value: '216', sub: '6 kelas paralel', color: 'blue' },
        { label: 'Prediksi Lolos SNBP', value: '142', sub: '65.7% dari total', color: 'green' },
        { label: 'Siswa Berisiko', value: '31', sub: '14.4% dari total', color: 'red' },
        { label: 'Akurasi Model AI', value: '87%', sub: 'Gradient Boosting', color: 'blue' },
    ];

    const distribusiData = [
        { label: 'Siap (>70%)', count: 142, pct: 65.7, color: '#16a34a' },
        { label: 'Perhatian (50–70%)', count: 43, pct: 19.9, color: '#f59e0b' },
        { label: 'Berisiko (<50%)', count: 31, pct: 14.4, color: '#dc2626' },
    ];

    const trenData = [
        { tahun: '2023/2024', lolos: 118, total: 210, pct: 56 },
        { tahun: '2024/2025', tahunLabel: 'lalu', lolos: 124, total: 212, pct: 58 },
        { tahun: '2025/2026', lolos: 142, total: 216, pct: 66, current: true },
    ];

    const faktorData = [
        { faktor: 'Nilai Rapor (bobot 60%)', rata: 81.3, status: 'Baik', statusColor: 'green' },
        { faktor: 'Kehadiran (bobot 25%)', rata: '93%', status: 'Baik', statusColor: 'green' },
        { faktor: 'Ekstrakurikuler (bobot 10%)', rata: '74%', status: 'Cukup', statusColor: 'yellow' },
        { faktor: 'Tren Nilai (bobot 5%)', rata: '+2.1', status: 'Naik', statusColor: 'green' },
    ];

    const kelasPerforma = [
        { kelas: 'XII IPA 1', lolos: 22, total: 36, pct: 61, trend: '+3' },
        { kelas: 'XII IPA 2', lolos: 25, total: 36, pct: 69, trend: '+5' },
        { kelas: 'XII IPA 3', lolos: 20, total: 36, pct: 56, trend: '+1' },
        { kelas: 'XII IPS 1', lolos: 18, total: 36, pct: 50, trend: '-2' },
        { kelas: 'XII IPS 2', lolos: 21, total: 36, pct: 58, trend: '+4' },
        { kelas: 'XII Bahasa', lolos: 16, total: 31, pct: 52, trend: '+2' },
    ];

    const getStatusStyle = (color) => {
        if (color === 'green') return { background: '#dcfce7', color: '#16a34a' };
        if (color === 'yellow') return { background: '#fef9c3', color: '#ca8a04' };
        if (color === 'red') return { background: '#fdecea', color: '#dc2626' };
        return {};
    };

    const getPctStyle = (pct) => {
        if (pct >= 65) return { background: '#e8f5e9', color: '#2e7d32' };
        if (pct >= 50) return { background: '#fff8e1', color: '#f59e0b' };
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
            <aside className={`snbs-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    {/* Brand */}
                    <div className="snbs-brand">
                        <h1 className="snbs-brand-title">SNBP Monitor</h1>
                        <p className="snbs-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    {/* Role Badge */}
                    <div className="snbs-role-badge">
                        <span className="snbs-role-dot"></span>
                        <span>Admin / Kepsek</span>
                    </div>

                    {/* Navigation */}
                    <nav className="snbs-nav">
                        <span className="snbs-nav-label">Menu Utama</span>

                        <button
                            className="snbs-nav-item"
                            onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="snbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>

                        <button
                            className="snbs-nav-item"
                            onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="snbs-nav-icon">◎</span>
                            <span>Rekap Per Kelas</span>
                        </button>

                        <span className="snbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button
                            className="snbs-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="snbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button
                            className="snbs-nav-item"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="snbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="snbs-sidebar-bottom">
                    <button className="snbs-nav-item">
                        <span className="snbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="snbs-notif-badge">2</span>
                    </button>

                    <button className="snbs-nav-item">
                        <span className="snbs-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button onClick={handleLogout} className="snbs-nav-item snbs-nav-logout">
                        <span className="snbs-nav-icon">⏻</span>
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
                            <span className="snbs-profile-name">Bapak Hartono</span>
                            <span className="snbs-profile-role">Kepala Sekolah</span>
                        </div>
                        <div className="snbs-avatar">HT</div>
                    </div>
                </header>

                {/* Content */}
                <main className="snbs-content">

                    {/* ── STAT CARDS ── */}
                    <div className="snbs-stats-grid">
                        {statCards.map((c) => (
                            <div key={c.label} className="snbs-stat-card">
                                <span className="snbs-stat-label">{c.label}</span>
                                <div className={`snbs-stat-value snbs-val-${c.color}`}>{c.value}</div>
                                <div className="snbs-stat-sub">{c.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── TAB NAV ── */}
                    <div className="snbs-tab-nav">
                        {[
                            { key: 'overview', label: 'Ringkasan' },
                            { key: 'distribusi', label: 'Distribusi' },
                            { key: 'tren', label: 'Tren Tahunan' },
                            { key: 'faktor', label: 'Faktor AI' },
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
                                        <h3 className="snbs-card-title">Performa prediksi per kelas</h3>
                                        <span className="snbs-badge-blue">6 Kelas</span>
                                    </div>
                                    <div className="snbs-table-wrapper">
                                        <table className="snbs-table">
                                            <thead>
                                                <tr>
                                                    <th>Kelas</th>
                                                    <th>Lolos</th>
                                                    <th>Total</th>
                                                    <th>%</th>
                                                    <th>Tren</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kelasPerforma.map((row) => (
                                                    <tr key={row.kelas}>
                                                        <td className="snbs-td-bold">{row.kelas}</td>
                                                        <td>{row.lolos}</td>
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
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Right Column */}
                                <div className="snbs-right-stack">

                                    {/* Bar Chart Mini */}
                                    <section className="snbs-card">
                                        <h3 className="snbs-card-title">Prediksi lolos per kelas</h3>
                                        <div className="snbs-bar-chart">
                                            {kelasPerforma.map((row) => (
                                                <div key={row.kelas} className="snbs-bar-row">
                                                    <span className="snbs-bar-row-label">{row.kelas}</span>
                                                    <div className="snbs-bar-track">
                                                        <div
                                                            className="snbs-bar-fill"
                                                            style={{
                                                                width: `${row.pct}%`,
                                                                background: row.pct >= 65
                                                                    ? '#16a34a'
                                                                    : row.pct >= 50 ? '#f59e0b' : '#dc2626',
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
                                                <span className="snbs-summary-val snbs-val-green">XII IPA 2 (69%)</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Kelas perlu intervensi</span>
                                                <span className="snbs-summary-val snbs-val-red">XII IPS 1 (50%)</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Rata-rata prediksi</span>
                                                <span className="snbs-summary-val">57.7%</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Update terakhir</span>
                                                <span className="snbs-summary-val">22 Mei 2026</span>
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
                                                <span className="snbs-donut-total">216</span>
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

                    {/* ── TAB: TREN TAHUNAN ── */}
                    {activeTab === 'tren' && (
                        <div className="snbs-tab-content">
                            <section className="snbs-card">
                                <h3 className="snbs-card-title">Tren prediksi lolos SNBP (3 tahun terakhir)</h3>
                                <div className="snbs-tren-grid">
                                    {trenData.map((t) => (
                                        <div
                                            key={t.tahun}
                                            className={`snbs-tren-card ${t.current ? 'current' : ''}`}
                                        >
                                            <div className="snbs-tren-year">{t.tahun}</div>
                                            {t.current && (
                                                <span className="snbs-tren-badge">Tahun ini</span>
                                            )}
                                            <div className="snbs-tren-lolos">{t.lolos}</div>
                                            <div className="snbs-tren-sub">dari {t.total} siswa</div>
                                            <div
                                                className="snbs-tren-pct-bar"
                                                style={{ '--pct': `${t.pct}%` }}
                                            >
                                                <div
                                                    className="snbs-tren-pct-fill"
                                                    style={{
                                                        width: `${t.pct}%`,
                                                        background: t.current ? '#185FA5' : '#94a3b8',
                                                    }}
                                                />
                                            </div>
                                            <div className="snbs-tren-pct-num">{t.pct}% prediksi lolos</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Catatan */}
                                <div className="snbs-tren-note">
                                    <span className="snbs-note-icon">📈</span>
                                    <span>
                                        Tren positif selama 3 tahun berturut-turut. Prediksi lolos naik{' '}
                                        <strong>+18 siswa</strong> dibanding tahun lalu.
                                    </span>
                                </div>
                            </section>

                            {/* Perbandingan kolom */}
                            <section className="snbs-card">
                                <h3 className="snbs-card-title">Perbandingan visual prediksi lolos</h3>
                                <div className="snbs-vertical-chart">
                                    {trenData.map((t) => (
                                        <div key={t.tahun} className="snbs-vchart-col">
                                            <div className="snbs-vchart-bar-wrap">
                                                <div
                                                    className="snbs-vchart-bar"
                                                    style={{
                                                        height: `${t.pct * 2.8}px`,
                                                        background: t.current ? '#185FA5' : '#cbd5e1',
                                                    }}
                                                >
                                                    <span className="snbs-vchart-pct">{t.pct}%</span>
                                                </div>
                                            </div>
                                            <span className="snbs-vchart-label">{t.tahun}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ── TAB: FAKTOR AI ── */}
                    {activeTab === 'faktor' && (
                        <div className="snbs-tab-content">
                            <div className="snbs-two-col">

                                <section className="snbs-card">
                                    <div className="snbs-card-header">
                                        <h3 className="snbs-card-title">Faktor yang mempengaruhi prediksi AI</h3>
                                        <span className="snbs-badge-blue">Gradient Boosting</span>
                                    </div>
                                    <div className="snbs-table-wrapper">
                                        <table className="snbs-table">
                                            <thead>
                                                <tr>
                                                    <th>Faktor</th>
                                                    <th>Rata-rata</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {faktorData.map((f) => (
                                                    <tr key={f.faktor}>
                                                        <td className="snbs-td-bold">{f.faktor}</td>
                                                        <td>{f.rata}</td>
                                                        <td>
                                                            <span
                                                                className="snbs-status-badge"
                                                                style={getStatusStyle(f.statusColor)}
                                                            >
                                                                {f.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <div className="snbs-right-stack">
                                    {/* Model Info */}
                                    <section className="snbs-card">
                                        <h3 className="snbs-card-title">Informasi model AI</h3>
                                        <div className="snbs-summary-list">
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Algoritma</span>
                                                <span className="snbs-summary-val">Gradient Boosting</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Akurasi</span>
                                                <span className="snbs-summary-val snbs-val-green">87%</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Dilatih</span>
                                                <span className="snbs-summary-val">1.200 data historis</span>
                                            </div>
                                            <div className="snbs-summary-row">
                                                <span className="snbs-summary-label">Update terakhir</span>
                                                <span className="snbs-summary-val">1 Mei 2026</span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Bobot Faktor */}
                                    <section className="snbs-card">
                                        <h3 className="snbs-card-title">Bobot faktor prediksi</h3>
                                        <div className="snbs-bar-chart">
                                            {[
                                                { label: 'Nilai Rapor', pct: 60, color: '#185FA5' },
                                                { label: 'Kehadiran', pct: 25, color: '#6d28d9' },
                                                { label: 'Ekstrakurikuler', pct: 10, color: '#f59e0b' },
                                                { label: 'Tren Nilai', pct: 5, color: '#94a3b8' },
                                            ].map((b) => (
                                                <div key={b.label} className="snbs-bar-row">
                                                    <span className="snbs-bar-row-label">{b.label}</span>
                                                    <div className="snbs-bar-track">
                                                        <div
                                                            className="snbs-bar-fill"
                                                            style={{ width: `${b.pct}%`, background: b.color }}
                                                        />
                                                    </div>
                                                    <span className="snbs-bar-row-pct">{b.pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
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
