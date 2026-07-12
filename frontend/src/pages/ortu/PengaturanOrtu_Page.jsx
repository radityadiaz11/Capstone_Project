import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './PengaturanOrtu_Page.css';

function PengaturanOrtu_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification preferences state to enable toggle interaction
  const [profile, setProfile] = useState({ nama: 'ORANG TUA', email: '', role: 'ortu' });
  const [student, setStudent] = useState(null);
  const s = student || {};
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const resStud = await api.get('/students');
        if (resStud.data.success && resStud.data.data.length > 0) setStudent(resStud.data.data[0]);
        if (res.data.success) setProfile(res.data.data);
      } catch (err) { console.error('Gagal memuat profil', err); }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await api.put('/users/profile', editForm);
      setProfile(editForm);
      setIsEditOpen(false);
      alert('Profil berhasil diperbarui');
    } catch (err) {
      alert('Gagal memperbarui profil');
    }
  };

  const [prefs, setPrefs] = useState({
    nilaiTurun: true,
    kehadiranRendah: true,
    pesanGuru: true,
    laporanMingguan: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('role');
    navigate('/', { replace: true });
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
            onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
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
              <span className="po-profile-name">{profile.nama || 'ORANG TUA'}</span>
              <span className="po-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
            </div>
            <div className="po-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}</div>
          </div>
        </header>

        {/* Content Container */}
        <main className="po-content">
          <div className="po-grid">

            {/* Left Card: Profil Orang Tua */}
            <section className="po-card po-card-profile">
              <h3 className="po-card-title">Profil Orang Tua</h3>

              <div className="po-avatar-section">
                <div className="po-profile-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}</div>
                <div className="po-profile-meta">
                  <h4 className="po-profile-name-full">{profile.nama}</h4>
                  <p className="po-profile-desc">Orang Tua {s.nama || 'Siswa'} · {s.kelas || 'Siswa'}</p>
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
                  <span className="po-detail-value bold">{s.nama || 'Siswa'}</span>
                </div>
              </div>

              <button className="po-edit-btn" onClick={() => { setEditForm({ ...profile, password: '' }); setIsEditOpen(true); }}>Edit profil</button>
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

      {/* Modal Edit Profil */}
      {isEditOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Edit Profil</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Nama Lengkap</label>
                <input type="text" value={editForm.nama || ''} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Email</label>
                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Password Baru</label>
                <input type="password" value={editForm.password || ''} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="Kosongkan jika tak ingin diubah" style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsEditOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
              <button onClick={handleSaveProfile} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PengaturanOrtu_Page;
