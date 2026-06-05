import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NilaiRapor_Page.css';

function NilaiRapor_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  // Data nilai siswa
  const grades = [
    { subject: 'Matematika',      score: 62, kkm: 75, status: 'Remedial' },
    { subject: 'Bahasa Indonesia', score: 58, kkm: 75, status: 'Remedial' },
    { subject: 'Biologi',          score: 60, kkm: 75, status: 'Remedial' },
    { subject: 'Kimia',            score: 56, kkm: 75, status: 'Remedial' },
    { subject: 'Fisika',           score: 65, kkm: 75, status: 'Remedial' },
    { subject: 'Bahasa Inggris',   score: 56, kkm: 75, status: 'Remedial' },
  ];

  // Data tren nilai per semester
  const trendData = [
    { sem: 'Sem 1', value: 72 },
    { sem: 'Sem 2', value: 74 },
    { sem: 'Sem 3', value: 70 },
    { sem: 'Sem 4', value: 65 },
    { sem: 'Sem 5', value: 58 },
  ];

  const maxValue = Math.max(...trendData.map(d => d.value));

  return (
    <div className="nr-container">

      {/* --- MOBILE HEADER & TOGGLE --- */}
      <div className="nr-mobile-header">
        <div className="nr-mobile-brand">
          <span className="nr-mobile-brand-title">SNBP Monitor</span>
          <span className="nr-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="nr-mobile-toggle"
          aria-label="Toggle Menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`nr-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div>
          {/* Logo Brand */}
          <div className="nr-brand">
            <h1 className="nr-brand-title">SNBP Monitor</h1>
            <p className="nr-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
          </div>

          {/* Role Badge */}
          <div className="nr-role-badge">
            <span className="nr-role-dot"></span>
            <span>Orang Tua</span>
          </div>

          {/* Navigation */}
          <nav className="nr-nav">
            <span className="nr-nav-label">Menu</span>

            <button
              onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
              className="nr-nav-item"
            >
              <span className="nr-nav-icon">⊞</span>
              <span>Beranda</span>
            </button>

            <button
              className="nr-nav-item active"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nr-nav-icon">≡</span>
              <span>Nilai Rapor</span>
            </button>

            <button
              onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
              className="nr-nav-item"
            >
              <span className="nr-nav-icon">◎</span>
              <span>Prediksi SNBP</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="nr-sidebar-bottom">
          <button
            onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
            className="nr-nav-item"
          >
            <span className="nr-nav-icon">🔔</span>
            <span>Notifikasi</span>
            <span className="nr-notif-badge">2</span>
          </button>

          <button
            onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
            className="nr-nav-item"
          >
            <span className="nr-nav-icon">⚙</span>
            <span>Pengaturan</span>
          </button>

          <button
            onClick={handleLogout}
            className="nr-nav-item nr-nav-logout"
          >
            <span className="nr-nav-icon">⏻</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="nr-main">

        {/* Sticky Topbar */}
        <header className="nr-topbar">
          <div className="nr-page-info">
            <h2 className="nr-page-title">Nilai Rapor</h2>
            <p className="nr-page-sub">Riwayat nilai akademik Farhan Hidayat</p>
          </div>

          <div className="nr-profile-info">
            <div className="nr-profile-text">
              <span className="nr-profile-name">Bapak Hidayat</span>
              <span className="nr-profile-role">Orang Tua Farhan</span>
            </div>
            <div className="nr-avatar">HN</div>
          </div>
        </header>

        {/* Content */}
        <main className="nr-content">

          {/* 3 Metric Cards */}
          <div className="nr-stats-grid">

            <div className="nr-stat-card">
              <span className="nr-stat-label">Rata-rata semester ini</span>
              <div className="nr-stat-value">58.1</div>
              <div className="nr-stat-sub">
                <span>↓</span> dari 65.3 (sem. lalu)
              </div>
            </div>

            <div className="nr-stat-card">
              <span className="nr-stat-label">Nilai tertinggi</span>
              <div className="nr-stat-value neutral">65</div>
              <div className="nr-stat-sub neutral">Fisika</div>
            </div>

            <div className="nr-stat-card">
              <span className="nr-stat-label">Nilai terendah</span>
              <div className="nr-stat-value">56</div>
              <div className="nr-stat-sub">Kimia &amp; B. Inggris</div>
            </div>

          </div>

          {/* 2-Column Grid */}
          <div className="nr-bottom-grid">

            {/* KIRI: Tabel nilai per mapel */}
            <section className="nr-card">
              <div className="nr-card-header">
                <h3 className="nr-card-title">Nilai per mata pelajaran</h3>
                <span className="nr-semester-badge">Semester 5</span>
              </div>

              <div className="nr-table-wrapper">
                <table className="nr-table">
                  <thead>
                    <tr>
                      <th>Mata Pelajaran</th>
                      <th>Nilai</th>
                      <th>KKM</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((item, i) => (
                      <tr key={i}>
                        <td>{item.subject}</td>
                        <td className="score-val">{item.score}</td>
                        <td>{item.kkm}</td>
                        <td>
                          <span className="nr-status-badge remedial">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* KANAN: Bar chart tren nilai */}
            <section className="nr-card">
              <h3 className="nr-card-title">Tren rata-rata nilai</h3>

              <div className="nr-chart-container">
                <div className="nr-bars">
                  {trendData.map((item) => (
                    <div key={item.sem} className="nr-bar-wrapper">
                      <div
                        className="nr-bar"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                      >
                        {item.value}
                      </div>
                      <span className="nr-bar-label">{item.sem}</span>
                    </div>
                  ))}
                </div>

                <div className="nr-chart-desc">
                  Tren nilai terus menurun &mdash; segera ambil tindakan
                </div>
              </div>
            </section>

          </div>

        </main>
      </div>

    </div>
  );
}

export default NilaiRapor_Page;
