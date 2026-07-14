import React, { useState, useEffect } from 'react';
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
      { id: 'tambah-siswa', label: 'Tambah Data Siswa', icon: '✚' },
    ],
  },
  {
    group: 'LAPORAN',
    items: [
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
              <button key={item.id} className={`db-nav-item${active === item.id ? ' active' : ''}`} onClick={() => onNavigate(item.id)} type="button">
                <span className="db-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="db-sidebar-bottom">
        <button className={`db-nav-item${active === 'notifikasi-settings' ? ' active' : ''}`} onClick={() => onNavigate('notifikasi-settings')} type="button"><span className="db-nav-icon">🔔</span>Notifikasi</button>
        <button className={`db-nav-item${active === 'pengaturan' ? ' active' : ''}`} onClick={() => onNavigate('pengaturan')} type="button"><span className="db-nav-icon">⚙</span>Pengaturan</button>
        <button className="db-nav-item db-nav-logout" onClick={() => onNavigate('keluar')} type="button"><span className="db-nav-icon">⏻</span>Keluar</button>
      </div>
    </aside>
  );
}

function Topbar({ title = 'Data Nilai', subtitle = 'Tahun Ajaran 2025/2026', profile = {} }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1 className="db-page-title" style={{ margin: 0 }}>{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
      </div>
    </header>
  );
}

const DataNilai_Page = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState({});
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academic/scores');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/guru/dashboard');
    if (id === 'prediksi') navigate('/guru/prediksi-siswa');
    if (id === 'nilai') navigate('/guru/data-nilai');
    if (id === 'monitoring') navigate('/guru/monitoring-kelas');
    if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
    if (id === 'ekspor') navigate('/guru/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/guru/notifikasi');
    if (id === 'pengaturan') navigate('/guru/pengaturan');
    if (id === 'keluar') { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/', { replace: true }); }
  };

  const stats = data?.stats;
  const subjects = data?.subjects || [];
  const distributions = data?.distributions || [];

  const statCards = stats ? [
    { label: 'Di atas KKM', value: String(stats.diAtasKKM), sub: `dari ${stats.diAtasKKM + stats.diBawahKKM} siswa`, subColor: '#16a34a', accent: '#16a34a' },
    { label: 'Di bawah KKM', value: String(stats.diBawahKKM), sub: 'Perlu remedial', subColor: '#ef4444', accent: '#ef4444' },
    { label: 'Nilai tertinggi', value: stats.tertinggi?.val || '—', sub: stats.tertinggi?.name || '', subColor: '#555', accent: '#1a56db' },
    { label: 'Nilai terendah', value: stats.terendah?.val || '—', sub: stats.terendah?.name || '', subColor: '#555', accent: '#ea580c' },
  ] : [];

  return (
    <div className="db-shell">
      <Sidebar active="nilai" onNavigate={handleNavigate} />
      <div className="db-main">
        <Topbar profile={profile} title="Data Nilai" subtitle="Tahun Ajaran 2025/2026" />
        <main className="db-content nilai-content-wrapper">

          {/* Top 4 Stat Cards */}
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="db-stat-card db-skeleton">
                  <div className="skeleton-line skeleton-sm"></div>
                  <div className="skeleton-line skeleton-lg"></div>
                  <div className="skeleton-line skeleton-sm"></div>
                </div>
              ))
            ) : (
              statCards.map((card, idx) => (
                <div key={idx} className="db-stat-card">
                  <span className="db-stat-label">{card.label}</span>
                  <span className="db-stat-value" style={{ color: card.accent }}>{card.value}</span>
                  <span className="db-stat-sub" style={{ color: card.subColor }}>{card.sub}</span>
                </div>
              ))
            )}
          </section>

          {/* Middle Layout */}
          <div className="db-mid-row nilai-grid-row">
            {/* Left Card: Rata-rata nilai per mata pelajaran */}
            <div className="db-card nilai-subjects-card">
              <div className="db-card-header">
                <span className="db-card-title">Rata-rata nilai per mata pelajaran</span>
                <span className="db-badge db-badge-blue">Database</span>
              </div>
              {loading ? (
                <div className="db-skeleton-block" style={{ height: '200px' }}></div>
              ) : (
                <div className="db-progress-list nilai-progress-list">
                  {subjects.map((subj) => (
                    <div key={subj.name} className="db-progress-row nilai-progress-row">
                      <span className="db-progress-label nilai-subj-name">{subj.name}</span>
                      <div className="db-progress-track">
                        <div className="db-progress-fill" style={{ width: `${subj.score}%`, background: parseFloat(subj.score) >= 75 ? '#2563eb' : '#ef4444' }} />
                      </div>
                      <span className="db-progress-count nilai-subj-score">{subj.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Cards Stack */}
            <div className="nilai-right-stack">
              {/* Distribusi Nilai */}
              <div className="db-card nilai-dist-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Distribusi nilai</span>
                </div>
                {loading ? (
                  <div className="db-skeleton-block" style={{ height: '120px' }}></div>
                ) : (
                  <div className="nilai-dist-list">
                    {distributions.map((dist, idx) => (
                      <div key={idx} className="nilai-dist-row">
                        <span className="dist-label">{dist.label}</span>
                        <span className="dist-count" style={{ color: dist.color, fontWeight: 600 }}>{dist.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tren Nilai Kelas */}
              <div className="db-card nilai-trend-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Sumber data</span>
                </div>
                <div style={{ padding: '12px 0', fontSize: '13px', color: '#64748b' }}>
                  <p style={{ margin: '0 0 8px' }}>📊 Data diambil dari database PostgreSQL</p>
                  <p style={{ margin: 0 }}>🔄 Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
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
