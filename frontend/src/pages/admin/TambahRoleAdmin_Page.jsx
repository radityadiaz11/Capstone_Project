import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TambahRoleAdmin_Page.css';
import api from '../../api/axios';

function TambahRoleAdmin_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profile, setProfile] = useState({});

    const [usersList, setUsersList] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userForm, setUserForm] = useState({});
    const [isEditUser, setIsEditUser] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resProfile = await api.get('/users/profile');
                if (resProfile.data.success) {
                    setProfile(resProfile.data.data);
                }
                const resUsers = await api.get('/users');
                if (resUsers.data.success) {
                    setUsersList(resUsers.data.data);
                }
            } catch (err) {
                console.error("Gagal memuat data", err);
            }
        };
        fetchData();
    }, []);

    const handleOpenUserModal = (user = null) => {
        if (user) {
            setIsEditUser(true);
            setUserForm({ ...user, password: '' });
        } else {
            setIsEditUser(false);
            setUserForm({ nama: '', email: '', role: 'guru', mengampu_kelas: '', password: '' });
        }
        setIsUserModalOpen(true);
    };

    const handleSaveUser = async () => {
        try {
            if (!isEditUser && !userForm.password) {
                alert("Password tidak boleh kosong untuk pengguna baru.");
                return;
            }
            if (isEditUser) {
                await api.put(`/users/${userForm.id}`, userForm);
            } else {
                await api.post('/users', userForm);
            }
            setIsUserModalOpen(false);
            const resUsers = await api.get('/users');
            if (resUsers.data.success) setUsersList(resUsers.data.data);
        } catch (err) {
            alert("Gagal menyimpan pengguna");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
        try {
            await api.delete(`/users/${id}`);
            const resUsers = await api.get('/users');
            if (resUsers.data.success) setUsersList(resUsers.data.data);
        } catch (err) {
            alert('Gagal menghapus');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', {
            replace: true
        });
    };

    const user = profile;

    return (
        <div className="dbs-container">

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
                        <button className="dbs-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
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
                    <button className="dbs-nav-item" onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}>
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
            <div className="dbs-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Tambah Role</h2>
                        <p className="dbs-page-sub">Manajemen Pengguna Aplikasi (Guru & Ortu)</p>
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
                    {/* Manajemen Pengguna Section */}
                    <div>
                        <section className="pga-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 className="pga-card-title" style={{ margin: 0 }}>Manajemen Role (Guru & Ortu)</h3>
                                <button onClick={() => handleOpenUserModal()} style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Tambah Pengguna</button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: 'auto', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>Nama</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>Email</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>Role</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>Kelas</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersList.map(u => (
                                            <tr key={u.id}>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#334155' }}>{u.nama}</td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{u.email}</td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                                    <span className={`set-badge ${u.role === 'admin' ? 'set-badge-red' : u.role === 'guru' ? 'set-badge-blue' : 'set-badge-green'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                                                    {u.role === 'guru' ? (u.mengampu_kelas || '-') : '-'}
                                                </td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                                    <button onClick={() => handleOpenUserModal(u)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '11px', fontWeight: 600, color: '#334155' }}>Edit</button>
                                                    <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Modal Tambah/Edit Pengguna */}
            {isUserModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>{isEditUser ? 'Edit Role' : 'Tambah Role Baru'}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Nama Lengkap</label>
                                <input type="text" value={userForm.nama} onChange={e => setUserForm({ ...userForm, nama: e.target.value })} className="pga-input-edit" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Email</label>
                                <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} className="pga-input-edit" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Role</label>
                                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} className="pga-input-edit" style={{ background: '#fff' }}>
                                    <option value="guru">Guru / Wali Kelas</option>
                                    <option value="ortu">Orang Tua</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {userForm.role === 'guru' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Mengampu Kelas</label>
                                    <select value={userForm.mengampu_kelas || ''} onChange={e => setUserForm({ ...userForm, mengampu_kelas: e.target.value })} className="pga-input-edit" style={{ background: '#fff' }}>
                                        <option value="">-- Pilih Kelas --</option>
                                        <option value="XII IPA 1">XII IPA 1</option>
                                        <option value="XII IPA 2">XII IPA 2</option>
                                        <option value="XII IPA 3">XII IPA 3</option>
                                        <option value="XII IPA 4">XII IPA 4</option>
                                        <option value="XII IPS 1">XII IPS 1</option>
                                        <option value="XII IPS 2">XII IPS 2</option>
                                        <option value="XII IPS 3">XII IPS 3</option>
                                        <option value="XII IPS 4">XII IPS 4</option>
                                        <option value="XII Bahasa 1">XII Bahasa 1</option>
                                        <option value="XII Bahasa 2">XII Bahasa 2</option>
                                        <option value="XII Bahasa 3">XII Bahasa 3</option>
                                        <option value="XII Bahasa 4">XII Bahasa 4</option>
                                    </select>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Password {isEditUser && '(Kosongkan jika tidak diubah)'}</label>
                                <input type="password" value={userForm.password || ''} onChange={e => setUserForm({ ...userForm, password: e.target.value })} className="pga-input-edit" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setIsUserModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                            <button onClick={handleSaveUser} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default TambahRoleAdmin_Page;
