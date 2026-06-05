import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotifikasiOrtu_Page.css';

function NotifikasiOrtu_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  // Mock data for parent notifications matching the user's screenshot
  const notifications = [
    {
      id: 1,
      type: 'remedial',
      message: 'Nilai Farhan turun dari 65.3 menjadi 58.1. Perlu perhatian segera.',
      time: 'Hari ini, 09.00',
      icon: '⚠️',
      bold: true,
    },
    {
      id: 3,
      type: 'presence',
      message: 'Kehadiran Farhan bulan ini: 72% — di bawah standar 85%.',
      time: '3 hari lalu',
      icon: '🔴',
      bold: false,
    },
    {
      id: 5,
      type: 'success',
      message: 'Nilai Fisika Farhan naik dari 55 → 65 di ujian tengah semester.',
      time: '1 bulan lalu',
      icon: '✅',
      bold: false,
    },
  ];

  return (
    <div className="no-container">

      {/* --- MOBILE HEADER & TOGGLE --- */}
      <div className="no-mobile-header">
        <div className="no-mobile-brand">
          <span className="no-mobile-brand-title">SNBP Monitor</span>
          <span className="no-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="no-mobile-toggle"
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
      <aside className={`no-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div>
          {/* Logo Brand */}
          <div className="no-brand">
            <h1 className="no-brand-title">SNBP Monitor</h1>
            <p className="no-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
          </div>

          {/* Role Badge */}
          <div className="no-role-badge">
            <span className="no-role-dot"></span>
            <span>Orang Tua</span>
          </div>

          {/* Navigation Menu */}
          <nav className="no-nav">
            <span className="no-nav-label">Menu</span>

            <button
              onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
              className="no-nav-item"
            >
              <span className="no-nav-icon">⊞</span>
              <span>Beranda</span>
            </button>

            <button
              onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
              className="no-nav-item"
            >
              <span className="no-nav-icon">≡</span>
              <span>Nilai Rapor</span>
            </button>

            <button
              onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
              className="no-nav-item"
            >
              <span className="no-nav-icon">🎯</span>
              <span>Prediksi SNBP</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Area */}
        <div className="no-sidebar-bottom">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="no-nav-item active"
          >
            <span className="no-nav-icon">🔔</span>
            <span>Notifikasi</span>
            <span className="no-notif-badge">2</span>
          </button>

          <button
            onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
            className="no-nav-item"
          >
            <span className="no-nav-icon">⚙</span>
            <span>Pengaturan</span>
          </button>

          <button
            onClick={handleLogout}
            className="no-nav-item no-nav-logout"
          >
            <span className="no-nav-icon">⏻</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA (RIGHT) --- */}
      <div className="no-main">

        {/* Sticky Topbar */}
        <header className="no-topbar">
          <div className="no-page-info">
            <h2 className="no-page-title">Notifikasi</h2>
            <p className="no-page-sub">Pemberitahuan terkait perkembangan Farhan</p>
          </div>

          {/* User Profile + Avatar */}
          <div className="no-profile-info">
            <div className="no-profile-text">
              <span className="no-profile-name">Bapak Hidayat</span>
              <span className="no-profile-role">Orang Tua Farhan</span>
            </div>
            <div className="no-avatar">
              HN
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="no-content">
          <div className="no-list">
            {notifications.map((notif) => (
              <div key={notif.id} className={`no-card no-card-${notif.type}`}>
                <div className={`no-icon-wrapper no-icon-wrapper-${notif.type}`}>
                  <span className="no-icon">{notif.icon}</span>
                </div>
                <div className="no-body">
                  <p className={`no-message ${notif.bold ? 'bold' : ''}`}>
                    {notif.message}
                  </p>
                  <span className="no-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
}

export default NotifikasiOrtu_Page;
