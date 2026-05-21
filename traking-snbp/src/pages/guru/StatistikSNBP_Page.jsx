import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Share the premium layout and sidebar style
import './StatistikSNBP_Page.css';

/* ── Mock data ─────────────────────────────────────────────────── */
const navMenu = [
  {
    group: 'MENU UTAMA',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
      { id: 'prediksi', label: 'Prediksi Siswa', icon: '◎' },
      { id: 'nilai', label: 'Data Nilai', icon: '≡' },
      { id: 'monitoring', label: 'Monitoring Kelas', icon: '◫' },
    ],
  },
  {
    group: 'LAPORAN',
    items: [
      { id: 'statistik', label: 'Statistik SNBP', icon: '⊟' },
      { id: 'ekspor', label: 'Ekspor Data', icon: '↓' },
    ],
  },
];

/* ── Sub-components ────────────────────────────────────────────── */
function Sidebar({ active, onNavigate }) {
  return (
    <aside className="db-sidebar">
      <div className="db-sidebar-brand">
        <span className="db-brand-title">SNBP Monitor</span>
        <span className="db-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
      </div>

      <nav className="db-nav">
        {navMenu.map((section) => (
          <div key={section.group} className="db-nav-group">
            <span className="db-nav-group-label">{section.group}</span>
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`db-nav-item${active === item.id ? ' active' : ''}`}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <span className="db-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="db-sidebar-bottom">
        <button
          className={`db-nav-item${active === 'notifikasi-settings' ? ' active' : ''}`}
          onClick={() => onNavigate('notifikasi-settings')}
          type="button"
        >
          <span className="db-nav-icon">🔔</span>
          Notifikasi
        </button>
        <button
          className={`db-nav-item${active === 'pengaturan' ? ' active' : ''}`}
          onClick={() => onNavigate('pengaturan')}
          type="button"
        >
          <span className="db-nav-icon">⚙</span>
          Pengaturan
        </button>
        <button
          className="db-nav-item db-nav-logout"
          onClick={() => onNavigate('keluar')}
          type="button"
        >
          <span className="db-nav-icon">⏻</span>
          Keluar
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title = 'Statistik SNBP', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII' }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left">
        <h1 className="db-page-title">{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right">
        <div className="db-profile-info">
          <span className="db-profile-name">Ibu Sari</span>
          <span className="db-profile-role">Wali Kelas XII IPA 1</span>
        </div>
        <div className="db-avatar">SR</div>
      </div>
    </header>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function StatistikSNBP_Page() {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'prediksi') navigate('/prediksi-siswa');
    if (id === 'nilai') navigate('/data-nilai');
    if (id === 'monitoring') navigate('/monitoring-kelas');
    if (id === 'statistik') navigate('/statistik-snbp');
    if (id === 'ekspor') navigate('/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/notifikasi');
    if (id === 'pengaturan') navigate('/pengaturan');
    if (id === 'keluar') navigate('/');
  };

  const statCards = [
    {
      title: 'Lolos SNBP (tahun lalu)',
      value: '18',
      subtext: 'dari 36 siswa (50%)',
      valueColor: '#16a34a',
    },
    {
      title: 'Prediksi tahun ini',
      value: '22',
      subtext: '↑ 4 dari tahun lalu',
      valueColor: '#1d4ed8',
      subColor: '#16a34a',
    },
    {
      title: 'Prodi paling diminati',
      value: 'Kedokteran',
      subtext: '8 siswa minat',
      valueColor: '#1e293b',
    },
    {
      title: 'PTN paling diminati',
      value: 'UGM',
      subtext: '12 siswa pilih',
      valueColor: '#1e293b',
    },
  ];

  const peminatanProdi = [
    { name: 'Kedokteran', count: 8, pct: 80, color: '#1a56db' },
    { name: 'Teknik Informatika', count: 6, pct: 62, color: '#1e40af' },
    { name: 'Farmasi', count: 5, pct: 50, color: '#2563eb' },
    { name: 'Psikologi', count: 4, pct: 40, color: '#3b82f6' },
    { name: 'Lainnya', count: 13, pct: 30, color: '#cbd5e1' },
  ];

  return (
    <div className="db-shell">
      <Sidebar active="statistik" onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar />

        <main className="db-content">
          {/* Upper 4 Stat Cards */}
          <div className="db-stat-grid stat-four-columns">
            {statCards.map((card, index) => (
              <div key={index} className="db-stat-card">
                <span className="db-stat-label">{card.title}</span>
                <span className="db-stat-value" style={{ color: card.valueColor }}>
                  {card.value}
                </span>
                <span className="db-stat-sub" style={{ color: card.subColor || '#64748b' }}>
                  {card.subtext}
                </span>
              </div>
            ))}
          </div>

          {/* Middle Row Layout */}
          <div className="db-mid-row stat-mid-layout">
            
            {/* Left Card: Peminatan prodi siswa */}
            <div className="db-card stat-prodi-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Peminatan prodi siswa</span>
              </div>

              <div className="stat-prodi-list">
                {peminatanProdi.map((prodi, idx) => (
                  <div key={idx} className="stat-prodi-item">
                    <div className="stat-prodi-header">
                      <span className="stat-prodi-name">{prodi.name}</span>
                      <span className="stat-prodi-count">{prodi.count} siswa</span>
                    </div>
                    <div className="stat-prodi-track">
                      <div
                        className="stat-prodi-fill"
                        style={{ width: `${prodi.pct}%`, backgroundColor: prodi.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Perbandingan lolos SNBP */}
            <div className="db-card stat-lolos-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Perbandingan lolos SNBP</span>
              </div>

              <div className="stat-chart-container">
                <div className="stat-chart-bars">
                  
                  {/* Bar 1 */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2023">
                      <span className="stat-bar-val">50%</span>
                    </div>
                    <span className="stat-bar-label">2023/2024</span>
                  </div>

                  {/* Bar 2 */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2024">
                      <span className="stat-bar-val">56%</span>
                    </div>
                    <span className="stat-bar-label">2024/2025</span>
                  </div>

                  {/* Bar 3 (Highlight Green) */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2025 highlighted">
                      <span className="stat-bar-val text-white font-bold">61%</span>
                    </div>
                    <span className="stat-bar-label font-medium text-dark">2025/2026 +</span>
                  </div>

                </div>

                <div className="stat-chart-legend">
                  <span className="legend-plus">+</span> prediksi model ML
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
