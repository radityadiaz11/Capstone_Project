import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Share the premium layout and sidebar style
import './StatistikSNBP_Page.css';
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

function Topbar({ title = 'Statistik SNBP', subtitle = 'Tahun Ajaran 2025/2026', profile = {} }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left">
        <h1 className="db-page-title">{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right">
        <div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
      </div>
    </header>
  );
}

export default function StatistikSNBP_Page() {
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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/snbp-stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching SNBP stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/guru/dashboard');
    if (id === 'prediksi') navigate('/guru/prediksi-siswa');
    if (id === 'nilai') navigate('/guru/data-nilai');
    if (id === 'monitoring') navigate('/guru/monitoring-kelas');
    if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
    if (id === 'statistik') navigate('/guru/statistik-snbp');
    if (id === 'ekspor') navigate('/guru/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/guru/notifikasi');
    if (id === 'pengaturan') navigate('/guru/pengaturan');
    if (id === 'keluar') { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/', { replace: true }); }
  };

  const totalSiswa = data?.totalSiswa || 0;
  const amanCount = data?.distribusiRisiko?.rendah || 0;
  const amanPct = totalSiswa > 0 ? Math.round((amanCount / totalSiswa) * 100) : 0;
  const kelasPerforma = data?.kelasPerforma || [];

  // Build stat cards
  const topProdi = kelasPerforma.length > 0 ? kelasPerforma[0].kelas : '—';
  const topProdiCount = kelasPerforma.length > 0 ? `${kelasPerforma[0].total} siswa` : '';

  const statCards = [
    { title: 'Aman', value: String(amanCount), subtext: `dari ${totalSiswa} siswa (${amanPct}%)`, valueColor: '#16a34a' },
    { title: 'Prodi paling diminati', value: topProdi.split(' - ')[0] || topProdi, subtext: topProdiCount, valueColor: '#1e293b' },
    { title: 'Total siswa', value: String(totalSiswa), subtext: 'Data dari database', valueColor: '#1e293b' },
  ];

  return (
    <div className="db-shell">
      <Sidebar active="statistik" onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar  profile={profile} />

        <main className="db-content">
          {/* Upper 3 Stat Cards */}
          <div className="db-stat-grid stat-three-columns">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="db-stat-card db-skeleton">
                  <div className="skeleton-line skeleton-sm"></div>
                  <div className="skeleton-line skeleton-lg"></div>
                  <div className="skeleton-line skeleton-sm"></div>
                </div>
              ))
            ) : (
              statCards.map((card, index) => (
                <div key={index} className="db-stat-card">
                  <span className="db-stat-label">{card.title}</span>
                  <span className="db-stat-value" style={{ color: card.valueColor }}>{card.value}</span>
                  <span className="db-stat-sub" style={{ color: card.subColor || '#64748b' }}>{card.subtext}</span>
                </div>
              ))
            )}
          </div>

          {/* Middle Row Layout */}
          <div className="db-mid-row stat-mid-layout">

            {/* Left Card: Performa per Prodi */}
            <div className="db-card stat-prodi-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Performa per Program Studi</span>
              </div>
              {loading ? (
                <div className="db-skeleton-block" style={{ height: '250px' }}></div>
              ) : (
                <div className="stat-prodi-list">
                  {kelasPerforma.length === 0 ? (
                    <div className="db-empty-state"><p>Belum ada data prodi</p></div>
                  ) : (
                    kelasPerforma.map((prodi, idx) => (
                      <div key={idx} className="stat-prodi-item">
                        <div className="stat-prodi-header">
                          <span className="stat-prodi-name">{prodi.kelas}</span>
                          <span className="stat-prodi-count">{prodi.aman !== undefined ? prodi.aman : 0}/{prodi.total} aman (Avg: {prodi.pct})</span>
                        </div>
                        <div className="stat-prodi-track">
                          <div className="stat-prodi-fill" style={{ width: `${prodi.pct}%`, backgroundColor: prodi.pct >= 60 ? '#1a56db' : prodi.pct >= 40 ? '#2563eb' : '#cbd5e1' }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Card: Distribusi Risiko */}
            <div className="db-card stat-lolos-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Distribusi Risiko</span>
              </div>
              {loading ? (
                <div className="db-skeleton-block" style={{ height: '200px' }}></div>
              ) : (
                <div className="stat-chart-container">
                  <div className="stat-chart-bars" style={{ minHeight: '200px', height: '100%' }}>
                    {[
                      { label: 'Tinggi', count: data?.distribusiRisiko?.tinggi || 0, color: '#22c55e' },
                      { label: 'Sedang', count: data?.distribusiRisiko?.sedang || 0, color: '#f97316' },
                      { label: 'Rendah', count: data?.distribusiRisiko?.rendah || 0, color: '#ef4444' },
                    ].map((item, idx) => {
                      const totalRisiko = (data?.distribusiRisiko?.tinggi || 0) + (data?.distribusiRisiko?.sedang || 0) + (data?.distribusiRisiko?.rendah || 0);
                      const pct = totalRisiko > 0 ? Math.round((item.count / totalRisiko) * 100) : 0;
                      return (
                        <div key={idx} className="stat-chart-bar-wrapper" style={{ height: '100%', justifyContent: 'flex-end' }}>
                          <div className="stat-chart-bar" style={{
                            height: `${pct}%`,
                            background: item.color,
                            minHeight: pct > 0 ? '28px' : '6px',
                            alignItems: pct > 0 ? 'flex-start' : 'center',
                            paddingTop: pct > 0 ? '6px' : '0px',
                            position: 'relative'
                          }}>
                            {pct > 0 ? (
                              <span className="stat-bar-val" style={{ color: 'white', fontSize: '13px' }}>{pct}%</span>
                            ) : (
                              <span className="stat-bar-val" style={{ color: item.color, fontSize: '13px', position: 'absolute', top: '-22px' }}>0%</span>
                            )}
                          </div>
                          <span className="stat-bar-label">{item.label} ({item.count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
