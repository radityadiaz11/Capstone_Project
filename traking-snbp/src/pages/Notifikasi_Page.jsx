import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './Notifikasi_Page.css';

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

function Topbar({ title = 'Notifikasi', subtitle = 'Sistem otomatis memantau perubahan akademik' }) {
  return (
    <header className="db-topbar notif-topbar">
      <div className="db-topbar-left notif-topbar-left">
        <div className="notif-title-row">
          <h1 className="db-page-title">{title}</h1>
          <span className="notif-badge">3 baru</span>
        </div>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right">
        <div className="db-profile-info">
          <span className="db-profile-name">Ibu Sari</span>
          <span className="db-profile-role">Wali Kelas XII IPA 1</span>
        </div>
        <div className="db-avatar">SR</div>
      </div>
    </header>
  );
}

export default function Notifikasi_Page() {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'prediksi') navigate('/prediksi-siswa');
    if (id === 'nilai') navigate('/data-nilai');
    if (id === 'monitoring') navigate('/monitoring-kelas');
    if (id === 'statistik') navigate('/statistik-snbp');
    if (id === 'ekspor') navigate('/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/notifikasi');
    if (id === 'keluar') navigate('/');
  };

  const notificationItems = [
    {
      id: 1,
      type: 'warning',
      message: '5 siswa terdeteksi berisiko tidak lolos SNBP. Perlu tindakan segera.',
      meta: '2 menit yang lalu · Klik untuk lihat prediksi',
      icon: '⚠',
      link: '/prediksi-siswa'
    },
    {
      id: 2,
      type: 'danger-alt',
      message: 'Farhan Hidayat mengalami penurunan nilai dari 65.3 → 58.1. Periksa kondisi siswa.',
      meta: '1 jam yang lalu · Klik untuk lihat detail',
      icon: '📉',
      link: '/detail-siswa'
    },
    {
      id: 3,
      type: 'danger',
      message: 'Kehadiran Farhan Hidayat bulan ini hanya 72%. Di bawah batas minimum 85%.',
      meta: '3 jam yang lalu',
      icon: '🔴',
      link: null
    },
    // Notification item 4 was "Update model prediksi berhasil dijalankan." and has been removed at the user's request.
    {
      id: 5,
      type: 'info',
      message: 'Input nilai rapor semester 5 sudah 100% lengkap untuk kelas XII IPA 1.',
      meta: 'Kemarin, 10.00',
      icon: '📋',
      link: '/data-nilai'
    },
    {
      id: 6,
      type: 'success-alt',
      message: 'Anisa Wahyu berhasil raih nilai tertinggi semester ini: 95.2. Selamat!',
      meta: '2 hari lalu',
      icon: '🏆',
      link: null
    }
  ];

  return (
    <div className="db-shell">
      <Sidebar active="notifikasi-settings" onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar />

        <main className="db-content notif-content-wrapper">
          <div className="notif-list-container">
            {notificationItems.map((item) => (
              <div 
                key={item.id} 
                className={`notif-card notif-card-${item.type} ${item.link ? 'clickable' : ''}`}
                onClick={() => item.link && navigate(item.link)}
              >
                <div className={`notif-circle-icon icon-${item.type}`}>
                  {item.icon}
                </div>
                <div className="notif-card-body">
                  <p className="notif-card-msg">{item.message}</p>
                  <span className="notif-card-meta">{item.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
