import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EksporData_Page.css';

/* ── Mock data for sidebar ───────────────────────────────────────── */
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

/* ── Sidebar & Topbar Components ─────────────────────────────────── */
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

function Topbar({ title = 'Ekspor Data', subtitle = 'Pilih data yang ingin diekspor' }) {
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

/* ── Main Page Component ─────────────────────────────────────────── */
export default function EksporData_Page() {
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

  const exportOptions = [
    {
      id: 'laporan',
      title: 'Laporan kesiapan SNBP',
      description: 'Ringkasan status kesiapan, prediksi, dan rekomendasi per siswa.',
      btnLabel: 'Buat laporan',
      format: 'PDF',
      formatClass: 'fmt-pdf',
    },
    {
      id: 'rapor',
      title: 'Data nilai rapor siswa',
      description: 'Semua nilai per mata pelajaran semester 1–5 dalam format spreadsheet.',
      btnLabel: 'Ekspor Excel',
      format: 'Excel',
      formatClass: 'fmt-excel',
    },
  ];

  const exportHistory = [
    {
      id: 1,
      name: 'Laporan Kesiapan April 2026',
      format: 'PDF',
      formatClass: 'fmt-pdf',
    },
    {
      id: 2,
      name: 'Data Nilai Sem. 5',
      format: 'Excel',
      formatClass: 'fmt-excel',
    },
    {
      id: 4,
      name: 'Laporan Kesiapan Maret 2026',
      format: 'PDF',
      formatClass: 'fmt-pdf',
    },
  ];

  return (
    <div className="db-shell">
      {/* Sidebar with active state 'ekspor' */}
      <Sidebar active="ekspor" onNavigate={handleNavigate} />

      <div className="db-main">
        {/* Topbar with correct titles */}
        <Topbar title="Ekspor Data" subtitle="Pilih data yang ingin diekspor" />

        {/* Content Section */}
        <main className="db-content ekspor-content-wrapper">
          <div className="ekspor-grid-row">
            
            {/* Left stack: export option cards */}
            <div className="ekspor-options-stack">
              {exportOptions.map((opt) => (
                <div key={opt.id} className="db-card ekspor-opt-card">
                  <div className="ekspor-opt-body">
                    <div className="ekspor-opt-header">
                      <h2 className="ekspor-opt-title">{opt.title}</h2>
                      <span className={`ekspor-fmt-badge ${opt.formatClass}`}>{opt.format}</span>
                    </div>
                    <p className="ekspor-opt-desc">{opt.description}</p>
                    <button className="ekspor-action-btn" type="button">
                      {opt.btnLabel} <span className="arrow-icon">↗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right stack: export history */}
            <div className="ekspor-history-column">
              <div className="db-card ekspor-history-card">
                <div className="db-card-header no-border">
                  <span className="db-card-title text-large">Riwayat ekspor</span>
                </div>

                <div className="ekspor-history-list">
                  {exportHistory.map((hist) => (
                    <div key={hist.id} className="ekspor-history-row">
                      <span className="ekspor-history-name">{hist.name}</span>
                      <span className={`ekspor-fmt-badge ${hist.formatClass}`}>{hist.format}</span>
                    </div>
                  ))}
                </div>

                <div className="ekspor-history-footer">
                  Semua file tersimpan 30 hari
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
