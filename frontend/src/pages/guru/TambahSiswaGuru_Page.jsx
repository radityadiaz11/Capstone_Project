import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TambahSiswaGuru_Page.css';
import api from '../../api/axios';

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
              <button key={item.id} className={`db-nav-item${active === item.id ? ' active' : ''}`} onClick={() => onNavigate(item.id)} type="button">
                <span className="db-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="db-sidebar-bottom">
        <button className={`db-nav-item${active === 'notifikasi-settings' ? ' active' : ''}`} onClick={() => onNavigate('notifikasi-settings')} type="button"><span className="db-nav-icon">🔔</span>Notifikasi</button>
        <button className={`db-nav-item${active === 'pengaturan' ? ' active' : ''}`} onClick={() => onNavigate('pengaturan')} type="button"><span className="db-nav-icon">⚙</span>Pengaturan</button>
        <button className="db-nav-item db-nav-logout" onClick={() => onNavigate('keluar')} type="button"><span className="db-nav-icon">⏻</span>Keluar</button>
      </div>
    </aside>
  );
}

function Topbar({ title = 'Tambah Data Siswa', subtitle = 'Tahun Ajaran 2025/2026', profile = {} }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1 className="db-page-title" style={{ margin: 0 }}>{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
      </div>
    </header>
  );
}

const TambahSiswaGuru_Page = () => {
  const [profile, setProfile] = React.useState({});
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);
  const navigate = useNavigate();
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
      setFormData({ nama: '', student_id: '', prodi: '', math_score: '', indo_score: '', eng_score: '', bio_score: '', chem_score: '', phy_score: '', productivity_score: '', mental_health_score: '' });
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
      fetchData(); // reload
    } catch (err) {
      alert("Gagal menyimpan data siswa: " + (err.response?.data?.message || err.message));
    }
  };

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/guru/dashboard');
    if (id === 'prediksi') navigate('/guru/prediksi-siswa');
    if (id === 'nilai') navigate('/guru/data-nilai');
    if (id === 'monitoring') navigate('/guru/monitoring-kelas');
    if (id === 'ekspor') navigate('/guru/ekspor-data');
    if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
    if (id === 'notifikasi-settings') navigate('/guru/notifikasi');
    if (id === 'pengaturan') navigate('/guru/pengaturan');
    if (id === 'keluar') { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/', { replace: true }); }
  };

  return (
    <div className="db-shell">
      <Sidebar active="tambah-siswa" onNavigate={handleNavigate} />
      <div className="db-main">
        <Topbar profile={profile} title="Tambah Data Siswa" subtitle="Kelola data siswa dan nilai akademik" />
        <main className="rkp-content" style={{ padding: '24px' }}>
          {/* Manajemen Data Siswa */}
          <section className="rkp-card" style={{ marginTop: '0', width: '100%' }}>
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
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Produktivitas</label>
                <input type="number" value={formData.productivity_score || ''} onChange={e => setFormData({ ...formData, productivity_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Mental Health</label>
                <select value={formData.mental_health_score || '100'} onChange={e => setFormData({ ...formData, mental_health_score: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>
                  <option value="100">Tinggi</option>
                  <option value="60">Sedang</option>
                  <option value="30">Rendah</option>
                </select>
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
};

export default TambahSiswaGuru_Page;
