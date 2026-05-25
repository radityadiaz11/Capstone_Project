import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PesanGuru_Page.css';

function PesanGuru_Page() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => navigate('/');

  // Data pesan dari guru sesuai screenshot
  const messages = [
    {
      id: 1,
      senderInitial: 'SR',
      senderName: 'Ibu Sari Rahayu',
      senderMeta: 'Wali Kelas XII IPA 1 · 15 Mei 2026',
      badge: 'penting',
      badgeLabel: 'Penting',
      greeting: 'Yth. Bapak/Ibu Orang Tua Farhan,',
      body: 'Nilai dan kehadiran Farhan mengalami penurunan signifikan. Rata-rata nilai 58.1 (di bawah KKM 75) dan kehadiran hanya 72%. Kami mohon dukungan untuk memotivasi Farhan dan memastikan hadir tepat waktu. Sesi konseling telah',
      bodyHighlight: 'dijadwalkan',
      bodySuffix: '5 Mei 2026.',
    },
    {
      id: 2,
      senderInitial: 'SR',
      senderName: 'Ibu Sari Rahayu',
      senderMeta: 'Wali Kelas XII IPA 1 · 2 April 2026',
      badge: 'informasi',
      badgeLabel: 'Informasi',
      greeting: null,
      body: 'Nilai Fisika Farhan berhasil naik dari 55 ke 65 di ujian tengah semester. Mohon terus semangat untuk mata pelajaran lainnya yang masih perlu peningkatan.',
      bodyHighlight: null,
      bodySuffix: null,
    },
    {
      id: 3,
      senderInitial: 'SR',
      senderName: 'Ibu Sari Rahayu',
      senderMeta: 'Wali Kelas XII IPA 1 · 10 Maret 2026',
      badge: 'snbp',
      badgeLabel: 'SNBP',
      greeting: null,
      body: 'Mohon pastikan Farhan telah mendiskusikan pilihan prodi dan PTN untuk SNBP 2026. Farhan mencantumkan',
      bodyHighlight: 'Akuntansi di UPN Yogyakarta',
      bodySuffix: '— diskusikan kembali kesesuaiannya.',
    },
  ];

  return (
    <div className="pg-container">

      {/* --- MOBILE HEADER --- */}
      <div className="pg-mobile-header">
        <div className="pg-mobile-brand">
          <span className="pg-mobile-brand-title">SNBP Monitor</span>
          <span className="pg-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
        </div>
        <button
          className="pg-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(v => !v)}
          aria-label="Toggle Menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            {isMobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`pg-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div>
          <div className="pg-brand">
            <h1 className="pg-brand-title">SNBP Monitor</h1>
            <p className="pg-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
          </div>

          <div className="pg-role-badge">
            <span className="pg-role-dot"></span>
            <span>Orang Tua</span>
          </div>

          <nav className="pg-nav">
            <span className="pg-nav-label">Menu</span>

            <button
              className="pg-nav-item"
              onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
            >
              <span className="pg-nav-icon">⊞</span>
              <span>Beranda</span>
            </button>

            <button
              className="pg-nav-item"
              onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
            >
              <span className="pg-nav-icon">≡</span>
              <span>Nilai Rapor</span>
            </button>

            <button
              className="pg-nav-item"
              onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
            >
              <span className="pg-nav-icon">◎</span>
              <span>Prediksi SNBP</span>
            </button>

            <button
              className="pg-nav-item active"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="pg-nav-icon">✉</span>
              <span>Pesan Guru</span>
            </button>
          </nav>
        </div>

        <div className="pg-sidebar-bottom">
          <button
            className="pg-nav-item"
            onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
          >
            <span className="pg-nav-icon">🔔</span>
            <span>Notifikasi</span>
            <span className="pg-notif-badge">3</span>
          </button>

          <button
            className="pg-nav-item"
            onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
          >
            <span className="pg-nav-icon">⚙</span>
            <span>Pengaturan</span>
          </button>

          <button className="pg-nav-item pg-nav-logout" onClick={handleLogout}>
            <span className="pg-nav-icon">⏻</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="pg-main">

        {/* Sticky Topbar */}
        <header className="pg-topbar">
          <div className="pg-page-info">
            <h2 className="pg-page-title">Pesan Guru</h2>
            <p className="pg-page-sub">Pesan dari wali kelas untuk orang tua</p>
          </div>
          <div className="pg-profile-info">
            <div className="pg-profile-text">
              <span className="pg-profile-name">Bapak Hidayat</span>
              <span className="pg-profile-role">Orang Tua Farhan</span>
            </div>
            <div className="pg-avatar">HN</div>
          </div>
        </header>

        {/* Message List */}
        <main className="pg-content">
          {messages.map((msg) => (
            <div key={msg.id} className="pg-msg-card">

              {/* Top Row: avatar + sender + badge */}
              <div className="pg-msg-top">
                <div className="pg-msg-sender-row">
                  <div className="pg-sender-avatar">{msg.senderInitial}</div>
                  <div className="pg-sender-info">
                    <span className="pg-sender-name">{msg.senderName}</span>
                    <span className="pg-sender-meta">{msg.senderMeta}</span>
                  </div>
                </div>
                <span className={`pg-badge ${msg.badge}`}>{msg.badgeLabel}</span>
              </div>

              {/* Message Body */}
              {msg.greeting && (
                <p className="pg-msg-greeting">{msg.greeting}</p>
              )}

              <p className="pg-msg-body">
                {msg.body}
                {msg.bodyHighlight && (
                  <>
                    {' '}
                    <span className="link">{msg.bodyHighlight}</span>
                    {' '}
                  </>
                )}
                {msg.bodySuffix}
              </p>

            </div>
          ))}
        </main>
      </div>

    </div>
  );
}

export default PesanGuru_Page;
