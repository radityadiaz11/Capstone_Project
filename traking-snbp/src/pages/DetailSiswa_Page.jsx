import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './DetailSiswa_Page.css';

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

function Topbar({ title = 'Detail Siswa', onBack }) {
  return (
    <header className="db-topbar" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="db-topbar-left" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1 className="db-page-title" style={{ margin: 0 }}>{title}</h1>
        {onBack && (
          <button 
            onClick={onBack} 
            className="db-back-link" 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3b82f6', 
              fontSize: '12.5px', 
              padding: 0, 
              cursor: 'pointer', 
              textAlign: 'left', 
              marginTop: '2px', 
              display: 'block',
              fontWeight: 500
            }}
          >
            ← Kembali ke Prediksi Siswa
          </button>
        )}
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

const DetailSiswa_Page = () => {
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

  const student = {
    name: 'Farhan Hidayat',
    class: 'XII IPA 1',
    minat: 'Akuntansi',
    prodi: 'UPN Yogyakarta',
    status: 'Berisiko',
    score: 58.1,
    attendance: '72%',
    extracurricular: '—',
    prediction: '41%',
    avatarInitials: 'FH',
    subjects: [
      { name: 'Matematika', score: 62 },
      { name: 'Bahasa Indonesia', score: 58 },
      { name: 'Biologi', score: 60 },
      { name: 'Kimia', score: 56 },
      { name: 'Fisika', score: 65 },
    ]
  };

  return (
    <div className="db-shell">
      {/* Unified Sidebar */}
      <Sidebar active="prediksi" onNavigate={handleNavigate} />

      {/* Main Area */}
      <div className="db-main">
        {/* Unified Topbar with Back Navigation */}
        <Topbar title="Detail Siswa" onBack={() => navigate('/prediksi-siswa')} />

        {/* Content Area */}
        <main className="db-content detail-content-wrapper">
          
          {/* 1. Student Header Card */}
          <div className="student-detail-header-card">
            <div className="sdh-left">
              <div className="sdh-avatar-circle">{student.avatarInitials}</div>
              <div className="sdh-info">
                <h2>{student.name}</h2>
                <p>{student.class} &middot; Minat: {student.minat} &middot; {student.prodi}</p>
                <div className="sdh-badges">
                  <span className="sdh-badge badge-risk">{student.status}</span>
                  <span className="sdh-badge badge-score">Skor: {student.score}</span>
                </div>
              </div>
            </div>
            <div className="sdh-right">
              <span className="sdh-pred-label">Prediksi lolos</span>
              <span className="sdh-pred-val">{student.prediction}</span>
              <span className="sdh-pred-badge">{student.status}</span>
            </div>
          </div>

          {/* 2. Grid for Subject Scores & Stats/Actions */}
          <div className="db-mid-row detail-grid-row">
            
            {/* Left Card: Nilai per mata pelajaran */}
            <div className="db-card detail-subjects-card">
              <div className="db-card-header">
                <span className="db-card-title">Nilai per mata pelajaran</span>
                <span className="db-badge db-badge-blue">Sem. 5</span>
              </div>

              <div className="db-progress-list detail-progress-list">
                {student.subjects.map((subj) => (
                  <div key={subj.name} className="db-progress-row detail-progress-row">
                    <span className="db-progress-label detail-subj-name">{subj.name}</span>
                    <div className="db-progress-track">
                      <div
                        className="db-progress-fill"
                        style={{ width: `${subj.score}%`, background: '#ef4444' }} // red theme like the screenshot
                      />
                    </div>
                    <span className="db-progress-count detail-subj-score">{subj.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Cards Stack: Statistik & Aksi Guru */}
            <div className="detail-right-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Card 1: Statistik siswa */}
              <div className="db-card detail-stats-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Statistik siswa</span>
                </div>
                
                <div className="detail-stats-list">
                  <div className="detail-stat-row">
                    <span className="ds-label">Rata-rata nilai</span>
                    <span className="ds-val" style={{ fontWeight: 600 }}>{student.score}</span>
                  </div>
                  <div className="detail-stat-row">
                    <span className="ds-label">Kehadiran</span>
                    <span className="ds-val" style={{ color: '#ef4444', fontWeight: 600 }}>{student.attendance}</span>
                  </div>
                  <div className="detail-stat-row">
                    <span className="ds-label">Ekstrakurikuler</span>
                    <span className="ds-val">{student.extracurricular}</span>
                  </div>
                  <div className="detail-stat-row" style={{ borderBottom: 'none' }}>
                    <span className="ds-label">Prediksi lolos</span>
                    <span className="ds-val" style={{ color: '#ef4444', fontWeight: 600 }}>{student.prediction}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Aksi guru */}
              <div className="db-card detail-actions-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">Aksi guru</span>
                </div>
                
                <div className="detail-action-buttons">
                  <button className="teacher-action-btn" type="button">
                    <span>Catat bimbingan</span>
                    <span className="tab-arrow">↗</span>
                  </button>
                  <button className="teacher-action-btn" type="button">
                    <span>Kirim notif orang tua</span>
                    <span className="tab-arrow">↗</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default DetailSiswa_Page;
