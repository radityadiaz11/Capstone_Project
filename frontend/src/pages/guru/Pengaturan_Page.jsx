import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
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
            { id: 'tambah-siswa', label: 'Tambah Data Siswa', icon: '✚' },
        ],
    },
    {
        group: 'LAPORAN',
        items: [
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

function Topbar({ title = 'Pengaturan', subtitle = 'Kelola profil dan konfigurasi sistem', profile = {} }) {
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

export default function Pengaturan_Page() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ nama: 'Ibu Sari', email: 'sari.rahayu@sman1yk.sch.id', mengampu_kelas: 'XII IPA 1', role: 'guru' });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({});

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
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

    const handleNavigate = (id) => {
        if (id === 'dashboard') navigate('/guru/dashboard');
        if (id === 'prediksi') navigate('/guru/prediksi-siswa');
        if (id === 'nilai') navigate('/guru/data-nilai');
        if (id === 'monitoring') navigate('/guru/monitoring-kelas');
        if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
        if (id === 'ekspor') navigate('/guru/ekspor-data');
        if (id === 'notifikasi-settings') navigate('/guru/notifikasi');
        if (id === 'pengaturan') navigate('/guru/pengaturan');
        if (id === 'keluar') {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="db-shell">
            <Sidebar active="pengaturan" onNavigate={handleNavigate} />

            <div className="db-main">
                <Topbar profile={profile} />

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
                                    <div className="set-avatar-circle">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
                                    <div className="set-profile-meta">
                                        <h2 className="set-profile-name">{profile.nama}</h2>
                                        <span className="set-profile-desc">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'} &middot; Guru Biologi</span>
                                    </div>
                                </div>

                                <div className="set-fields-list">
                                    <div className="set-field-row">
                                        <span className="set-field-label">Email</span>
                                        <span className="set-field-val set-field-link">{profile.email}</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Kelas diampu</span>
                                        <span className="set-field-val font-semibold">{profile.mengampu_kelas || 'XII IPA 1'}</span>
                                    </div>
                                    <div className="set-field-row">
                                        <span className="set-field-label">Role</span>
                                        <span className="set-field-val">
                                            <span className="set-badge set-badge-blue">Guru</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="set-card-footer">
                                    <button className="set-action-btn" type="button" onClick={() => { setEditForm({ ...profile, password: '' }); setIsEditOpen(true); }}>Edit profil</button>
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

            {/* Modal Edit Profil */}
            {isEditOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Edit Profil</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Nama</label>
                                <input type="text" value={editForm.nama || ''} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Email</label>
                                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Password Baru (Opsional)</label>
                                <input type="password" value={editForm.password || ''} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="Kosongkan jika tidak ingin diubah" style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
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
