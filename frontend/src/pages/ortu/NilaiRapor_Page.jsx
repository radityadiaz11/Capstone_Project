import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NilaiRapor_Page.css';
import api from '../../api/axios';

function NilaiRapor_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/students');
        if (res.data.success && res.data.data.length > 0) {
          setStudent(res.data.data[0]);
        }
        const resProfile = await api.get('/users/profile');
        if (resProfile.data.success) {
          setProfile(resProfile.data.data);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const s = student || {};
  const gradesRaw = [
    { subject: 'Matematika', score: s.math_score || 0, prevScore: Math.round((s.math_score || 0) * 1.05), status: (s.math_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Bahasa Indonesia', score: s.indo_score || 0, prevScore: Math.round((s.indo_score || 0) * 1.02), status: (s.indo_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Biologi', score: s.bio_score || 0, prevScore: Math.round((s.bio_score || 0) * 0.95), status: (s.bio_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Kimia', score: s.chem_score || 0, prevScore: Math.round((s.chem_score || 0) * 1.1), status: (s.chem_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Fisika', score: s.phy_score || 0, prevScore: Math.round((s.phy_score || 0) * 1.08), status: (s.phy_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Bahasa Inggris', score: s.eng_score || 0, prevScore: Math.round((s.eng_score || 0) * 0.98), status: (s.eng_score || 0) < 75 ? 'Berisiko' : 'Aman' },
  ];
  const grades = gradesRaw.filter(g => g.score > 0);

  const avgRapor = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length 
      : 0;

  const examScore = s.exam_score ? s.exam_score : avgRapor;

  // Rata-rata semester lalu (mock logic based on current score to show trend)
  const prevScore = (examScore * 1.1).toFixed(0);

  const highestGrade = grades.length > 0 ? grades.reduce((max, g) => g.score > max.score ? g : max, grades[0]) : null;
  const lowestGrade = grades.length > 0 ? grades.reduce((min, g) => g.score < min.score ? g : min, grades[0]) : null;

  // Data tren nilai per semester based on exam score
  const trendData = [
    { sem: 'Sem 1', value: Math.min(100, Math.round(examScore * 0.8)) },
    { sem: 'Sem 2', value: Math.min(100, Math.round(examScore * 0.85)) },
    { sem: 'Sem 3', value: Math.min(100, Math.round(examScore * 0.9)) },
    { sem: 'Sem 4', value: Math.min(100, Math.round(examScore * 0.95)) },
    { sem: 'Sem 5', value: Math.round(examScore) },
  ];

  const maxValue = Math.max(...trendData.map(d => d.value), 10);

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
            <p className="nr-page-sub">Riwayat nilai akademik {s.nama || ''}</p>
          </div>

          <div className="nr-profile-info">
            <div className="nr-profile-text">
              <span className="nr-profile-name">{profile.nama || 'ORANG TUA'}</span>
              <span className="nr-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
            </div>
            <div className="nr-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}</div>
          </div>
        </header>

        {/* Content */}
        <main className="nr-content">

          {/* 3 Metric Cards */}
          <div className="nr-stats-grid">

            <div className="nr-stat-card">
              <span className="nr-stat-label">Exam Score Semester ini</span>
              <div className="nr-stat-value">{loading ? '—' : examScore.toFixed(0)}</div>
              <div className="nr-stat-sub">
                <span>{examScore < prevScore ? '↓' : '↑'}</span> dari {prevScore} (sem. lalu)
              </div>
            </div>

            <div className="nr-stat-card">
              <span className="nr-stat-label">Nilai tertinggi</span>
              <div className="nr-stat-value neutral">{highestGrade ? highestGrade.score : '—'}</div>
              <div className="nr-stat-sub neutral">{highestGrade ? highestGrade.subject : '—'}</div>
            </div>

            <div className="nr-stat-card">
              <span className="nr-stat-label">Nilai terendah</span>
              <div className="nr-stat-value">{lowestGrade ? lowestGrade.score : '—'}</div>
              <div className="nr-stat-sub">{lowestGrade ? lowestGrade.subject : '—'}</div>
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
                      <th>Nilai (Sem. 5)</th>
                      <th>Sem. Lalu (Sem. 4)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((item, i) => (
                      <tr key={i}>
                        <td>{item.subject}</td>
                        <td className={`score-val ${item.status.toLowerCase()}`}>{item.score}</td>
                        <td>{item.prevScore}</td>
                        <td>
                          <span className={`nr-status-badge ${item.status.toLowerCase()}`}>
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
                      <div className="nr-bar-container">
                        <div
                          className="nr-bar"
                          style={{ height: `${(item.value / maxValue) * 100}%` }}
                        >
                          {item.value}
                        </div>
                      </div>
                      <span className="nr-bar-label">{item.sem}</span>
                    </div>
                  ))}
                </div>

                <div className="nr-chart-desc">
                  {examScore >= 75 ? 'Tren nilai terus membaik — pertahankan performa' : (examScore < 60 ? 'Tren nilai terus menurun — segera ambil tindakan' : 'Performa stabil/meningkat — pertahankan!')}
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
