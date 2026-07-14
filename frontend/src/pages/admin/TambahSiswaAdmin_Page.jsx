import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TambahSiswaAdmin_Page.css';
import api from '../../api/axios';

function TambahSiswaAdmin_Page() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: 'ADMIN', role: 'Kepala Sekolah' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.success) {
                    setUser({ nama: res.data.data.nama, role: res.data.data.role === 'admin' ? 'Administrator' : 'Kepala Sekolah' });
                }
            } catch (err) {}
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', {
            replace: true
        });
    };

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalStudentId, setOriginalStudentId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const resStudents = await api.get('/students');
            if (resStudents.data.success) setStudents(resStudents.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (student = null) => {
        if (student) {
            setIsEditMode(true);
            setFormData(student);
            setOriginalStudentId(student.student_id);
        } else {
            setIsEditMode(false);
            setFormData({ nama: '', student_id: '', prodi: '', math_score: '', indo_score: '', eng_score: '', bio_score: '', chem_score: '', phy_score: '' });
            setOriginalStudentId(null);
        }
        setIsModalOpen(true);
    };

    const handleSaveStudent = async () => {
        try {
            const payload = { ...formData };
            let totalScore = 0;
            let validSubjects = 0;

            ['math_score', 'indo_score', 'eng_score', 'bio_score', 'chem_score', 'phy_score'].forEach(key => {
                const val = payload[key];
                if (val === '' || val === null || val === undefined) {
                    payload[key] = null;
                } else {
                    totalScore += parseFloat(val);
                    validSubjects++;
                }
            });

            payload.exam_score = validSubjects > 0 ? (totalScore / validSubjects) : 0;

            if (isEditMode) {
                await api.put(`/students/${originalStudentId}`, payload);
            } else {
                await api.post('/students', payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Gagal menyimpan data siswa: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="dbs-container">

            {/* ── MOBILE HEADER ── */}
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
                        <button className="dbs-nav-item active" onClick={() => setIsMobileMenuOpen(false)}>
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

            {/* ── MAIN CONTENT ── */}
            <div className="dbs-main">
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Tambah Data Siswa</h2>
                        <p className="dbs-page-sub">Kelola data siswa dan nilai akademik</p>
                    </div>
                    <div className="dbs-profile-info">
                        <div className="dbs-profile-text">
                            <span className="dbs-profile-name">{user.nama || 'ADMIN'}</span>
                            <span className="dbs-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="dbs-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                    </div>
                </header>

                <main className="rkp-content">
                    {/* Manajemen Data Siswa */}
                    <section className="rkp-card" style={{ marginTop: '20px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 className="rkp-chart-title" style={{ margin: 0 }}>Manajemen Data Siswa & Nilai</h3>
                            <button
                                onClick={() => handleOpenModal()}
                                style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                + Tambah Siswa
                            </button>
                        </div>
                        <div className="rkp-table-wrapper">
                            <table className="rkp-table">
                                <thead>
                                    <tr>
                                        <th>NISN</th>
                                        <th>Nama</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Matematika</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>B. Indo</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>B. Inggris</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Biologi</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Kimia</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Fisika</th>
                                        <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
                                    ) : students.length === 0 ? (
                                        <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Tidak ada data siswa.</td></tr>
                                    ) : (
                                        students.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.student_id}</td>
                                                <td style={{ fontWeight: 600 }}>{s.nama}</td>
                                                <td style={{ textAlign: 'center' }}>{s.math_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{s.indo_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{s.eng_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{s.bio_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{s.chem_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>{s.phy_score || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleOpenModal(s)}
                                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#334155' }}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>{isEditMode ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Nama Siswa</label>
                                <input type="text" value={formData.nama || ''} onChange={e => setFormData({ ...formData, nama: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>NISN</label>
                                <input type="text" value={formData.student_id || ''} onChange={e => setFormData({ ...formData, student_id: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Program Studi Tujuan</label>
                                <input type="text" value={formData.prodi || ''} onChange={e => setFormData({ ...formData, prodi: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Matematika</label>
                                <input type="number" value={formData.math_score || ''} onChange={e => setFormData({ ...formData, math_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Bahasa Indonesia</label>
                                <input type="number" value={formData.indo_score || ''} onChange={e => setFormData({ ...formData, indo_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Bahasa Inggris</label>
                                <input type="number" value={formData.eng_score || ''} onChange={e => setFormData({ ...formData, eng_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Biologi</label>
                                <input type="number" value={formData.bio_score || ''} onChange={e => setFormData({ ...formData, bio_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Kimia</label>
                                <input type="number" value={formData.chem_score || ''} onChange={e => setFormData({ ...formData, chem_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Fisika</label>
                                <input type="number" value={formData.phy_score || ''} onChange={e => setFormData({ ...formData, phy_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                            <button onClick={handleSaveStudent} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TambahSiswaAdmin_Page;
