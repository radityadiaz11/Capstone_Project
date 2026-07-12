const fs = require('fs');
const path = require('path');

const content = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './MonitoringKelas_Page.css';
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
              <button key={item.id} className={\`db-nav-item\${active === item.id ? ' active' : ''}\`} onClick={() => onNavigate(item.id)} type="button">
                <span className="db-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="db-sidebar-bottom">
        <button className={\`db-nav-item\${active === 'notifikasi-settings' ? ' active' : ''}\`} onClick={() => onNavigate('notifikasi-settings')} type="button"><span className="db-nav-icon">🔔</span>Notifikasi</button>
        <button className={\`db-nav-item\${active === 'pengaturan' ? ' active' : ''}\`} onClick={() => onNavigate('pengaturan')} type="button"><span className="db-nav-icon">⚙</span>Pengaturan</button>
        <button className="db-nav-item db-nav-logout" onClick={() => onNavigate('keluar')} type="button"><span className="db-nav-icon">⏻</span>Keluar</button>
      </div>
    </aside>
  );
}

function Topbar({ title = 'Monitoring Kelas', subtitle = 'Tahun Ajaran 2025/2026', profile = {} }) {
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

const MonitoringKelas_Page = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academic/monitoring');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching monitoring:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoring();
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

  const overallAtt = data?.overallAttendance || '—';
  const activeStudents = data?.activeStudents || 0;
  const totalStudents = data?.totalStudents || 0;
  const extraCount = data?.extracurricularCount || 0;
  const weekly = data?.weekly || [];
  const lowAttendanceStudents = data?.lowAttendanceStudents || [];

  const statCards = [
    { label: 'Kehadiran rata-rata', value: \`\${overallAtt}%\`, sub: 'Data dari database', subColor: '#16a34a', accent: '#16a34a' },
    { label: 'Siswa aktif', value: String(activeStudents), sub: \`dari \${totalStudents} siswa\`, subColor: '#555', accent: '#2563eb' },
    { label: 'Ekstrakurikuler', value: String(extraCount), sub: 'ikut ekskul aktif', subColor: '#555', accent: '#ea580c' },
  ];

  const weeklyAttendance = weekly.map((val, idx) => ({
    label: \`Minggu \${idx + 1}\`,
    value: parseInt(val),
    color: parseInt(val) >= 90 ? '#16a34a' : parseInt(val) >= 80 ? '#2563eb' : '#ea580c'
  }));

  return (
    <div className="db-shell">
      <Sidebar active="monitoring" onNavigate={handleNavigate} />
      <div className="db-main">
        <Topbar profile={profile} title="Monitoring Kelas" subtitle="Tahun Ajaran 2025/2026" />
        <main className="db-content monitoring-content-wrapper">

          {/* Top 3 Stat Cards */}
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {loading ? (
              [1, 2, 3].map(i => (
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
          <div className="db-mid-row monitoring-grid-row">

            {/* Left Card: Rekap kehadiran per minggu */}
            <div className="db-card attendance-weekly-card">
              <div className="db-card-header">
                <span className="db-card-title">Rekap kehadiran per minggu</span>
                <span className="db-badge db-badge-blue">Database</span>
              </div>
              {loading ? (
                <div className="db-skeleton-block" style={{ height: '180px' }}></div>
              ) : (
                <>
                  <div className="db-progress-list attendance-progress-list">
                    {weeklyAttendance.map((wk) => (
                      <div key={wk.label} className="db-progress-row attendance-progress-row">
                        <span className="db-progress-label attendance-label">{wk.label}</span>
                        <div className="db-progress-track">
                          <div className="db-progress-fill" style={{ width: \`\${wk.value}%\`, background: wk.color }} />
                        </div>
                        <span className="db-progress-count attendance-val">{wk.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="attendance-footer">
                    Rata-rata kehadiran: {overallAtt}% &bull; Target: &ge;90%
                  </div>
                </>
              )}
            </div>

            {/* Right Card: Siswa sering absen */}
            <div className="db-card frequent-absent-card">
              <div className="db-card-header" style={{ marginBottom: '14px' }}>
                <span className="db-card-title">Siswa sering absen</span>
              </div>
              {loading ? (
                <div className="db-skeleton-block" style={{ height: '180px' }}></div>
              ) : (
                <div className="absent-student-list">
                  {lowAttendanceStudents.length === 0 ? (
                    <div className="db-empty-state">
                      <span style={{ fontSize: '24px' }}>✅</span>
                      <p>Semua siswa hadir dengan baik</p>
                    </div>
                  ) : (
                    lowAttendanceStudents.map((stud, idx) => (
                      <div key={idx} className="absent-student-row">
                        <div className="abs-left">
                          <div className="abs-avatar-circle">{stud.initials}</div>
                          <div className="abs-info">
                            <span className="abs-name">{stud.nama}</span>
                            <span className="abs-detail">{stud.days_absent} hari absen bulan ini</span>
                          </div>
                        </div>
                        <div className="abs-badges">
                          <span className={\`abs-badge \${stud.status === 'KRITIS' ? 'badge-kritis' : 'badge-perhatian'}\`}>
                            {stud.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default MonitoringKelas_Page;
`;

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'guru', 'MonitoringKelas_Page.jsx'), content, 'utf8');
console.log('Restored MonitoringKelas_Page.jsx');
