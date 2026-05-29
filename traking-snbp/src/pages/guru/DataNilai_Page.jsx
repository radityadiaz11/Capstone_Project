import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './DataNilai_Page.css';
import api from '../../api/axios';


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

function Topbar({ title = 'Data Nilai', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII IPA 1' }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1 className="db-page-title" style={{ margin: 0 }}>{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="db-profile-info" style={{ textAlign: 'right' }}>
          <span className="db-profile-name" style={{ display: 'block', fontWeight: 600, fontSize: '13.5px' }}>Ibu Sari</span>
          <span className="db-profile-role" style={{ display: 'block', fontSize: '11.5px', color: '#64748b' }}>Wali Kelas XII IPA 1</span>
        </div>
        <div className="db-avatar">SR</div>
      </div>
    </header>
  );
}

const DataNilai_Page = () => {
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
    { label: 'Di atas KKM', value: '29', sub: '↑ 2 siswa', subColor: '#16a34a', accent: '#16a34a' },
    { label: 'Di bawah KKM', value: '7', sub: 'Perlu remedial', subColor: '#ef4444', accent: '#ef4444' },
    { label: 'Nilai tertinggi', value: '95.2', sub: 'Anisa Wahyu', subColor: '#555', accent: '#1a56db' },
    { label: 'Nilai terendah', value: '58.1', sub: 'Farhan Hidayat', subColor: '#555', accent: '#ea580c' },
  ];

  const subjects = [
    { name: 'Matematika', score: 86.2 },
    { name: 'Bahasa Indonesia', score: 84.7 },
    { name: 'Biologi', score: 81.4 },
    { name: 'Kimia', score: 79.3 },
    { name: 'Fisika', score: 74.8 },
    { name: 'Bahasa Inggris', score: 72.1 },
  ];

  const distributions = [
    { label: 'Sangat baik (≥90)', count: '8 siswa', color: '#16a34a' },
    { label: 'Baik (80–89)', count: '14 siswa', color: '#2563eb' },
    { label: 'Cukup (75–79)', count: '7 siswa', color: '#ea580c' },
    { label: 'Di bawah KKM (<75)', count: '7 siswa', color: '#ef4444' },
  ];

  const trends = [
    { sem: 'Sem 3', val: '80.1' },
    { sem: 'Sem 4', val: '82.2' },
    { sem: 'Sem 5', val: '83.4', up: true },
  ];

  return (
    <div className="db-shell">
      {/* Unified Sidebar */}
      <Sidebar active="nilai" onNavigate={handleNavigate} />

      {/* Main Area */}
      <div className="db-main">
        {/* Unified Topbar */}
        <Topbar title="Data Nilai" subtitle="Tahun Ajaran 2025/2026 • Kelas XII &middot; Kelas XII IPA 1" />

        {/* Content Area */}
        <main className="db-content nilai-content-wrapper">

          {/* Top 4 Stat Cards */}
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {statCards.map((card, idx) => (
              <div key={idx} className="db-stat-card">
                <span className="db-stat-label">{card.label}</span>
                <span className="db-stat-value" style={{ color: card.accent }}>{card.value}</span>
                <span className="db-stat-sub" style={{ color: card.subColor }}>{card.sub}</span>
              </div>
            ))}
          </section>

          {/* Middle Layout (Subjects average vs stats distribution) */}
          <div className="db-mid-row nilai-grid-row">

            {/* Left Card: Rata-rata nilai per mata pelajaran */}
            <div className="db-card nilai-subjects-card">
              <div className="db-card-header">
                <span className="db-card-title">Rata-rata nilai per mata pelajaran</span>
                <span className="db-badge db-badge-blue">Sem. 5</span>
              </div>

              <div className="db-progress-list nilai-progress-list">
                {subjects.map((subj) => (
                  <div key={subj.name} className="db-progress-row nilai-progress-row">
                    <span className="db-progress-label nilai-subj-name">{subj.name}</span>
                    <div className="db-progress-track">
                      <div
                        className="db-progress-fill"
                        style={{
                          width: `${subj.score}%`,
                          background: subj.score >= 75 ? '#2563eb' : '#ef4444' // Blue above KKM (75), red below
                        }}
                      />
                    </div>
                    <span className="db-progress-count nilai-subj-score">{subj.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Cards Stack: Distribusi & Tren */}
            <div className="nilai-right-stack">

              {/* Card 1: Distribusi Nilai */}
              <div className="db-card nilai-dist-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Distribusi nilai</span>
                </div>

                <div className="nilai-dist-list">
                  {distributions.map((dist, idx) => (
                    <div key={idx} className="nilai-dist-row">
                      <span className="dist-label">{dist.label}</span>
                      <span className="dist-count" style={{ color: dist.color, fontWeight: 600 }}>{dist.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Tren Nilai Kelas */}
              <div className="db-card nilai-trend-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Tren nilai kelas</span>
                </div>

                {/* Trend Stats */}
                <div className="trend-stats-row">
                  {trends.map((t, idx) => (
                    <div key={idx} className="trend-stat-box">
                      <span className="trend-val">
                        {t.val}{t.up && <span className="trend-arrow-up">↑</span>}
                      </span>
                      <span className="trend-sem">{t.sem}</span>
                    </div>
                  ))}
                </div>

                {/* Premium Mini Line Chart (SVG) */}
                <div className="trend-chart-container">
                  <svg width="100%" height="90" viewBox="0 0 320 90" className="trend-svg">
                    {/* SVG Gradients for high fidelity look */}
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                      d="M 40 60 L 100 55 L 160 56 L 220 48 L 280 40 L 280 80 L 40 80 Z"
                      fill="url(#chart-grad)"
                    />

                    {/* Gridlines */}
                    <line x1="40" y1="20" x2="280" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="45" x2="280" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="70" x2="280" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Chart Line path */}
                    <path
                      d="M 40 60 L 100 55 L 160 56 L 220 48 L 280 40"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    <circle cx="40" cy="60" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <circle cx="100" cy="55" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <circle cx="160" cy="56" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <circle cx="220" cy="48" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <circle cx="280" cy="40" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />

                    {/* X-Axis labels */}
                    <text x="40" y="82" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">Sem1</text>
                    <text x="100" y="82" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">Sem2</text>
                    <text x="160" y="82" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">Sem3</text>
                    <text x="220" y="82" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">Sem4</text>
                    <text x="280" y="82" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">Sem5</text>
                  </svg>
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default DataNilai_Page;
