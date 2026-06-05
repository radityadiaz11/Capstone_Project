import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PengaturanOrtu_Page.css';

function PengaturanOrtu_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification preferences state to enable toggle interaction
  const [prefs, setPrefs] = useState({
    nilaiTurun: true,
    kehadiranRendah: true,
    pesanGuru: true,
    laporanMingguan: false,
  });

  const handleLogout = () => {
    navigate('/');
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="po-container">

      {/* --- MOBILE HEADER & TOGGLE --- */}
      <div className="po-mobile-header">
        <div className="po-mobile-brand">
          <span className="po-mobile-brand-title">SNBP Monitor</span>
          <span className="po-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="po-mobile-toggle"
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
      <aside className={`po-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div>
          {/* Logo Brand */}
          <div className="po-brand">
            <h1 className="po-brand-title">SNBP Monitor</h1>
            <p className="po-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
          </div>

          {/* Role Badge */}
          <div className="po-role-badge">
            <span className="po-role-dot"></span>
            <span>Orang Tua</span>
          </div>

          {/* Navigation Menu */}
          <nav className="po-nav">
            <span className="po-nav-label">Menu</span>

            <button
              onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
              className="po-nav-item"
            >
              <span className="po-nav-icon">⊞</span>
              <span>Beranda</span>
            </button>

            <button
              onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
              className="po-nav-item"
            >
              <span className="po-nav-icon">≡</span>
              <span>Nilai Rapor</span>
            </button>

            <button
              onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
              className="po-nav-item"
            >
              <span className="po-nav-icon">🎯</span>
              <span>Prediksi SNBP</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Area */}
        <div className="po-sidebar-bottom">
          <button
            onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
            className="po-nav-item"
          >
            <span className="po-nav-icon">🔔</span>
            <span>Notifikasi</span>
            <span className="po-notif-badge">2</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="po-nav-item active"
          >
            <span className="po-nav-icon">⚙</span>
            <span>Pengaturan</span>
          </button>

          <button
            onClick={handleLogout}
            className="po-nav-item po-nav-logout"
          >
            <span className="po-nav-icon">⏻</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA (RIGHT) --- */}
      <div className="po-main">

        {/* Sticky Topbar */}
        <header className="po-topbar">
          <div className="po-page-info">
            <h2 className="po-page-title">Pengaturan</h2>
            <p className="po-page-sub">Kelola akun orang tua</p>
          </div>

          {/* User Profile + Avatar */}
          <div className="po-profile-info">
            <div className="po-profile-text">
              <span className="po-profile-name">Bapak Hidayat</span>
              <span className="po-profile-role">Orang Tua Farhan</span>
            </div>
            <div className="po-avatar">
              HN
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="po-content">
          <div className="po-grid">

            {/* Left Card: Profil Orang Tua */}
            <section className="po-card po-card-profile">
              <h3 className="po-card-title">Profil Orang Tua</h3>

              <div className="po-avatar-section">
                <div className="po-profile-avatar">HN</div>
                <div className="po-profile-meta">
                  <h4 className="po-profile-name-full">Bapak Hidayat Nugroho</h4>
                  <p className="po-profile-desc">Orang Tua Farhan Hidayat · XII IPA 1</p>
                </div>
              </div>

              <div className="po-details-list">
                <div className="po-detail-row">
                  <span className="po-detail-label">Email</span>
                  <a href="mailto:hidayat.nugroho@gmail.com" className="po-detail-value po-email-link">
                    hidayat.nugroho@gmail.com
                  </a>
                </div>
                <div className="po-detail-row">
                  <span className="po-detail-label">No. HP</span>
                  <span className="po-detail-value bold">+62 812 3456 7890</span>
                </div>
                <div className="po-detail-row">
                  <span className="po-detail-label">Anak terdaftar</span>
                  <span className="po-detail-value bold">Farhan Hidayat</span>
                </div>
              </div>

              <button className="po-edit-btn">Edit profil</button>
            </section>

            {/* Right Card: Preferensi Notifikasi */}
            <section className="po-card po-card-prefs">
              <h3 className="po-card-title">Preferensi Notifikasi</h3>

              <div className="po-prefs-list">
                <div className="po-pref-row">
                  <span className="po-pref-label">Notif nilai turun</span>
                  <button 
                    onClick={() => togglePref('nilaiTurun')}
                    className={`po-toggle-badge ${prefs.nilaiTurun ? 'active' : 'inactive'}`}
                  >
                    {prefs.nilaiTurun ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                <div className="po-pref-row">
                  <span className="po-pref-label">Notif kehadiran rendah</span>
                  <button 
                    onClick={() => togglePref('kehadiranRendah')}
                    className={`po-toggle-badge ${prefs.kehadiranRendah ? 'active' : 'inactive'}`}
                  >
                    {prefs.kehadiranRendah ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                <div className="po-pref-row">
                  <span className="po-pref-label">Laporan mingguan</span>
                  <button 
                    onClick={() => togglePref('laporanMingguan')}
                    className={`po-toggle-badge ${prefs.laporanMingguan ? 'active' : 'inactive'}`}
                  >
                    {prefs.laporanMingguan ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>

              <div className="po-prefs-footer">
                Versi aplikasi v1.4.2 · SMA Negeri 1 Yogyakarta
              </div>
            </section>

          </div>
        </main>
      </div>

    </div>
  );
}

export default PengaturanOrtu_Page;
