import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './DashboardPage.css';
import './MonitoringKelas_Page.css';

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

function Topbar({ title = 'Monitoring Kelas', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII IPA 1' }) {
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

const MonitoringKelas_Page = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    overallAttendance: '0',
    activeStudents: 0,
    totalStudents: 0,
    extracurricularCount: 0,
    weekly: [],
    lowAttendanceStudents: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/academic/monitoring');
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError('Gagal memuat data monitoring');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    { label: 'Kehadiran rata-rata', value: `${data.overallAttendance}%`, sub: 'Rata-rata kelas', subColor: '#16a34a', accent: '#16a34a' },
    { label: 'Siswa aktif', value: `${data.activeStudents}`, sub: `dari ${data.totalStudents} siswa`, subColor: '#555', accent: '#2563eb' },
    { label: 'Ekstrakurikuler', value: `${data.extracurricularCount}`, sub: 'ikut ekskul aktif', subColor: '#555', accent: '#ea580c' },
  ];

  const weeklyAttendance = data.weekly?.map((val, idx) => ({
    label: `Minggu ${idx + 1}`,
    value: parseInt(val),
    color: parseInt(val) >= 90 ? '#16a34a' : parseInt(val) >= 80 ? '#2563eb' : '#ea580c'
  })) || [];

  const absentStudents = data.lowAttendanceStudents?.map(s => ({
    name: s.nama,
    initials: s.initials,
    detail: `${s.days_absent} hari absen`,
    badges: s.status === 'KRITIS' 
      ? [{ text: 'Pantau', class: 'badge-pantau' }, { text: 'Kritis', class: 'badge-kritis' }]
      : [{ text: 'Perhatian', class: 'badge-perhatian' }]
  })) || [];

  return (
    <div className="db-shell">
      <Sidebar active="monitoring" onNavigate={handleNavigate} />

      {/* Main Area */}
      <div className="db-main">
        {/* Unified Topbar */}
        <Topbar title="Monitoring Kelas" subtitle="Tahun Ajaran 2025/2026 • Kelas XII &middot; Kelas XII IPA 1" />

        {/* Content Area */}
        <main className="db-content monitoring-content-wrapper">
          {loading ? (
            <div className="db-loading-state">
              <div className="spinner"></div>
              <p>Memuat data monitoring...</p>
            </div>
          ) : error ? (
            <div className="db-error-state">{error}</div>
          ) : (
            <>
          {/* Top 3 Stat Cards */}
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {statCards.map((card, idx) => (
              <div key={idx} className="db-stat-card">
                <span className="db-stat-label">{card.label}</span>
                <span className="db-stat-value" style={{ color: card.accent }}>{card.value}</span>
                <span className="db-stat-sub" style={{ color: card.subColor }}>{card.sub}</span>
              </div>
            ))}
          </section>

          {/* Middle Layout (Weekly attendance vs frequently absent) */}
          <div className="db-mid-row monitoring-grid-row">
            
            {/* Left Card: Rekap kehadiran per minggu */}
            <div className="db-card attendance-weekly-card">
              <div className="db-card-header">
                <span className="db-card-title">Rekap kehadiran per minggu</span>
                <span className="db-badge db-badge-blue">April 2026</span>
              </div>

              <div className="db-progress-list attendance-progress-list">
                {weeklyAttendance.map((wk) => (
                  <div key={wk.label} className="db-progress-row attendance-progress-row">
                    <span className="db-progress-label attendance-label">{wk.label}</span>
                    <div className="db-progress-track">
                      <div
                        className="db-progress-fill"
                        style={{ width: `${wk.value}%`, background: wk.color }}
                      />
                    </div>
                    <span className="db-progress-count attendance-val">{wk.value}%</span>
                  </div>
                ))}
              </div>

              <div className="attendance-footer">
                Rata-rata kehadiran: {data.overallAttendance}% &bull; Target: &ge;90%
              </div>
            </div>

            {/* Right Card: Siswa sering absen */}
            <div className="db-card frequent-absent-card">
              <div className="db-card-header" style={{ marginBottom: '14px' }}>
                <span className="db-card-title">Siswa sering absen</span>
              </div>

              <div className="absent-student-list">
                {absentStudents.map((stud, idx) => (
                  <div key={idx} className="absent-student-row">
                    <div className="abs-left">
                      <div className="abs-avatar-circle">{stud.initials}</div>
                      <div className="abs-info">
                        <span className="abs-name">{stud.name}</span>
                        <span className="abs-detail">{stud.detail}</span>
                      </div>
                    </div>
                    <div className="abs-badges">
                      {stud.badges.map((b, bIdx) => (
                        <span key={bIdx} className={`abs-badge ${b.class}`}>{b.text}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* In the mockup, there was a "Buat surat panggilan" button here. It has been removed per user instruction. */}
            </div>

          </div>
          </>
          )}

        </main>
      </div>
    </div>
  );
};

export default MonitoringKelas_Page;
