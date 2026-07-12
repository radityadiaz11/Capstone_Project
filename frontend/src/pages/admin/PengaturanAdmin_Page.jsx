import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './PengaturanAdmin_Page.css';

function PengaturanAdmin_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({ nama: "ADMIN", email: 'admin@sman1yk.sch.id', role: 'admin' });
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
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
            setIsEditing(false);
            alert('Profil berhasil diperbarui');
        } catch (err) {
            alert('Gagal memperbarui profil');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', {
            replace: true
        });
    };

    const infoSistem = [
        { label: 'Model AI aktif', value: 'Neural Network', valueClass: 'pga-val-bold' },
        { label: 'Update terakhir', value: '1 Mei 2026', valueClass: 'pga-val-bold' },
        { label: 'Versi aplikasi', value: 'v1.4.2', valueClass: 'pga-val-bold' },
        { label: 'Total pengguna aktif', value: '41', valueClass: 'pga-val-bold' },
        { label: 'Sekolah', value: 'SMA Negeri 1 Yogyakarta', valueClass: 'pga-val-bold' },
    ];

    const user = profile;

    return (
        <div className="pga-container">

            {/* --- MOBILE HEADER --- */}
            <div className="dbs-mobile-header">
                <div className="dbs-mobile-brand">
                    <span className="dbs-mobile-brand-title">SNBP Monitor</span>
                    <span className="dbs-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="dbs-mobile-toggle"
                    aria-label="Toggle Menu"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`dbs-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    <div className="dbs-brand">
                        <h1 className="dbs-brand-title">SNBP Monitor</h1>
                        <p className="dbs-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    <div className="dbs-role-badge">
                        <span className="dbs-role-dot"></span>
                        <span>Admin / Kepsek</span>
                    </div>

                    <nav className="dbs-nav">
                        <span className="dbs-nav-label">Menu Utama</span>

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">◎</span>
                            <span>Rekap Per Kelas</span>
                        </button>
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/tambah-siswa'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">✚</span>
                            <span>Tambah Data Siswa</span>
                        </button>
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/tambah-role'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">👥</span>
                            <span>Tambah Role</span>
                        </button>

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/statistik'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>
                        <button className="dbs-nav-item" onClick={() => { navigate('/admin/ekspor'); setIsMobileMenuOpen(false); }}>
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                <div className="dbs-sidebar-bottom">

                    <button className="dbs-nav-item" onClick={() => { navigate('/admin/notifikasi'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>
                    <button className="dbs-nav-item active" onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button onClick={handleLogout} className="dbs-nav-item dbs-nav-logout">
                        <span className="dbs-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="pga-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Pengaturan</h2>
                        <p className="dbs-page-sub">Profil dan konfigurasi sistem</p>
                    </div>
                    <div className="dbs-profile-info">
                        <div className="dbs-profile-text">
                            <span className="dbs-profile-name">{user.nama || 'ADMIN'}</span>
                            <span className="dbs-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="dbs-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                    </div>
                </header>

                {/* Content */}
                <main className="pga-content">
                    <div className="pga-grid">

                        {/* ---- LEFT: Profil Admin ---- */}
                        <section className="pga-card">
                            <h3 className="pga-card-title">Profil Admin</h3>

                            {/* Avatar + Nama */}
                            <div className="pga-profile-head">
                                <div className="pga-avatar-lg">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                                <div>
                                    <p className="pga-profile-name">{profile.nama || 'ADMIN'}</p>
                                    <p className="pga-profile-role">Kepala Sekolah · Administrator</p>
                                </div>
                            </div>

                            {/* Info Rows */}
                            <div className="pga-info-list">
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Email</span>
                                    <span className="pga-info-val pga-val-link">{profile.email || 'admin@sman1yk.sch.id'}</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Level akses</span>
                                    <span className="pga-badge-superadmin">Super Admin</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">Tahun ajaran aktif</span>
                                    <span className="pga-info-val pga-val-bold">2025/2026</span>
                                </div>
                                <div className="pga-info-row">
                                    <span className="pga-info-label">KKM berlaku</span>
                                    <span className="pga-info-val pga-val-bold">75</span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    className="pga-edit-btn"
                                    onClick={() => { setEditForm({ ...profile, password: '' }); setIsEditing(true); }}
                                >
                                    Edit profil
                                </button>
                            </div>
                        </section>

                        {/* ---- RIGHT: Info Sistem ---- */}
                        <section className="pga-card">
                            <h3 className="pga-card-title">Info Sistem</h3>

                            <div className="pga-info-list">
                                {infoSistem.map((item, idx) => (
                                    <div key={idx} className="pga-info-row">
                                        <span className="pga-info-label">{item.label}</span>
                                        <span className={`pga-info-val ${item.valueClass}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            {/* Modal Edit Profil */}
            {isEditing && (
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
                            <button onClick={() => setIsEditing(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                            <button onClick={handleSaveProfile} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PengaturanAdmin_Page;
