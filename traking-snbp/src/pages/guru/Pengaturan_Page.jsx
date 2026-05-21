import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './Pengaturan_Page.css';

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

function Topbar({ title = 'Pengaturan', subtitle = 'Kelola profil dan konfigurasi sistem' }) {
    return (
        <header className="db-topbar">
            <div className="db-topbar-left">
                <h1 className="db-page-title">{title}</h1>
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

export default function Pengaturan_Page() {
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

    return (
        <div className="db-shell">
            <Sidebar active="pengaturan" onNavigate={handleNavigate} />

            <div className="db-main">
                <Topbar />

                <main className="db-content set-content-wrapper">
                    <div className="set-grid-layout">

                        {/* Left Column */}
                        <div className="set-column">
                            {/* Profile Card */}
                            <div className="db-card set-card">
                                <div className="db-card-header no-border" style={{ marginBottom: '14px' }}>
                                    <span className="db-card-title text-large">Profil pengguna</span>
                                </div>

                                <div className="set-profile-section">
                                    <div className="set-avatar-circle">SR</div>
                                    <div className="set-profile-meta">
                                        <h2 className="set-profile-name">Ibu Sari Rahayu</h2>
                                        <span className="set-profile-desc">Wali Kelas XII IPA 1 &middot; Guru Biologi</span>
                                    </div>
                                </div>

                                <div className="set-fields-list">
                                    <div className="set-field-row">
                                        <span className="set-field-label">Email</span>
                                        <span className="set-field-val set-field-link">sari.rahayu@sman1yk.sch.id</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Kelas diampu</span>
                                        <span className="set-field-val font-semibold">XII IPA 1</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Role</span>
                                        <span className="set-field-val">
                                            <span className="set-badge set-badge-blue">Guru</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="set-card-footer">
                                    <button className="set-action-btn" type="button">Edit profil</button>
                                </div>
                            </div>

                            {/* Notifications Card */}
                            <div className="db-card set-card">
                                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                                    <span className="db-card-title">Notifikasi</span>
                                </div>

                                <div className="set-fields-list">
                                    <div className="set-field-row">
                                        <span className="set-field-label">Notif siswa berisiko</span>
                                        <span className="set-field-val">
                                            <span className="set-badge set-badge-green">Aktif</span>
                                        </span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Notif penurunan nilai</span>
                                        <span className="set-field-val">
                                            <span className="set-badge set-badge-green">Aktif</span>
                                        </span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Laporan mingguan</span>
                                        <span className="set-field-val">
                                            <span className="set-badge set-badge-green">Aktif</span>
                                        </span>
                                    </div>
                                    {/* Email digest harian row has been removed at the user's request */}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="set-column">
                            {/* System Settings Card */}
                            <div className="db-card set-card">
                                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                                    <span className="db-card-title">Pengaturan sistem</span>
                                </div>

                                <div className="set-fields-list">
                                    <div className="set-field-row">
                                        <span className="set-field-label">Tahun ajaran aktif</span>
                                        <span className="set-field-val font-semibold">2025/2026</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">KKM berlaku</span>
                                        <span className="set-field-val font-semibold">75</span>
                                    </div>
                                    {/* Model AI aktif row has been removed at the user's request */}
                                    <div className="set-field-row">
                                        <span className="set-field-label">Update model terakhir</span>
                                        <span className="set-field-val">1 Mei 2026</span>
                                    </div>
                                    {/* Akurasi model row has been removed at the user's request */}
                                </div>
                            </div>

                            {/* About Card */}
                            <div className="db-card set-card">
                                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                                    <span className="db-card-title">Tentang sistem</span>
                                </div>

                                <div className="set-fields-list">
                                    <div className="set-field-row">
                                        <span className="set-field-label">Versi aplikasi</span>
                                        <span className="set-field-val">v1.4.2</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Sekolah</span>
                                        <span className="set-field-val">SMA Negeri 1 Yogyakarta</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Data siswa</span>
                                        <span className="set-field-val">36 siswa</span>
                                    </div>
                                </div>
                                {/* Button 'Pelajari cara kerja AI' has been removed at the user's request */}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
