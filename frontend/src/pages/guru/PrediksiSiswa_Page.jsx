import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import './PrediksiSiswa_Page.css';
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

function Topbar({ title = 'Prediksi Siswa', subtitle = 'Tahun Ajaran 2025/2026', aiStatus, profile = {} }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left">
        <h1 className="db-page-title">{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right">
        {aiStatus && (
          <span className={`ai-status-badge ${aiStatus === 'active' ? 'ai-status-active' : 'ai-status-inactive'}`}>
            <span className={`ai-status-dot ${aiStatus === 'active' ? 'ai-dot-green' : 'ai-dot-red'}`}></span>
            {aiStatus === 'active' ? 'AI Model Aktif' : 'Mode Simulasi'}
          </span>
        )}
        <div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
      </div>
    </header>
  );
}

const PrediksiSiswa_Page = () => {
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
  const [activeFilter, setActiveFilter] = useState('Semua');
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictingId, setPredictingId] = useState(null);
  const [batchPredicting, setBatchPredicting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, aiRes] = await Promise.all([
          api.get('/students'),
          api.get('/predict/model-status').catch(() => ({ data: { success: false } }))
        ]);

        if (studentsRes.data.success) {
          const mapped = studentsRes.data.data.map(s => {
            const history = s.riwayatPrediksi || [];
            // Jangan load dari riwayat agar user harus menekan tombol prediksi
            const latestPred = null;

            const score = s.exam_score || 0;

            let status = 'Siap';
            if (score < 60) status = 'Berisiko';

            return {
              id: s.id,
              student_id: s.student_id,
              name: s.nama || `Siswa ${s.student_id}`,
              prodi: s.prodi || '-',
              score: score,
              prediction: latestPred ? latestPred.prediksi_nilai : null,
              confidence: latestPred ? latestPred.confidence : null,
              is_simulated: latestPred ? latestPred.is_simulated : null,
              status: (s.status && s.status.toLowerCase() !== 'aktif') ? s.status : status,
              tren: latestPred?.tren || null,
              level_risiko: latestPred?.level_risiko || null
            };
          });
          setStudents(mapped);
        }

        if (aiRes.data.success) {
          setAiStatus(aiRes.data.data.status);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePredict = async (studentId) => {
    try {
      setPredictingId(studentId);
      setPredicting(true);
      const res = await api.post('/predict', { student_id: studentId });
      if (res.data.success) {
        setStudents(prev => prev.map(s => {
          if (s.student_id === studentId) {
            return {
              ...s,
              prediction: res.data.data.prediksi_nilai,
              confidence: res.data.data.confidence,
              is_simulated: res.data.data.is_simulated,
              tren: res.data.data.tren,
              level_risiko: res.data.data.level_risiko
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error('Error predicting:', error);
    } finally {
      setPredicting(false);
      setPredictingId(null);
    }
  };

  const handlePredictBatch = async () => {
    try {
      setBatchPredicting(true);
      const res = await api.post('/predict/batch');
      if (res.data.success) {
        const results = res.data.data;
        setStudents(prev => prev.map(s => {
          const pred = results.find(r => r.student_id === s.student_id);
          if (pred) {
            return {
              ...s,
              prediction: pred.prediksi_nilai,
              confidence: pred.confidence,
              is_simulated: pred.is_simulated,
              tren: pred.tren,
              level_risiko: pred.level_risiko
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error('Error batch predicting:', error);
    } finally {
      setBatchPredicting(false);
    }
  };

  const filteredStudents = activeFilter === 'Semua'
    ? students
    : students.filter(s => s.status === activeFilter);

  const totalSiswa = students.length;
  const siapCount = students.filter(s => s.status === 'Siap').length;
  const berisikoCount = students.filter(s => s.status === 'Berisiko').length;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Siap': return 'status-siap';
      case 'Berisiko': return 'status-berisiko';
      default: return '';
    }
  };

  const handleNavigate = (id) => {
    if (id === 'dashboard') navigate('/guru/dashboard');
    if (id === 'prediksi') navigate('/guru/prediksi-siswa');
    if (id === 'nilai') navigate('/guru/data-nilai');
    if (id === 'monitoring') navigate('/guru/monitoring-kelas');
    if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
    if (id === 'statistik') navigate('/guru/statistik-snbp');
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
      <Sidebar active="prediksi" onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar profile={profile} title="Prediksi Siswa" subtitle="Tahun Ajaran 2025/2026" aiStatus={aiStatus} />

        <main className="db-content">
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="db-stat-card">
              <span className="db-stat-label">Total siswa</span>
              <span className="db-stat-value" style={{ color: '#1a56db' }}>
                {loading ? '—' : totalSiswa}
              </span>
              <span className="db-stat-sub" style={{ color: '#555' }}>Data dari database</span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">Aman</span>
              <span className="db-stat-value" style={{ color: '#16a34a' }}>
                {loading ? '—' : siapCount}
              </span>
              <span className="db-stat-sub" style={{ color: '#16a34a' }}>
                {totalSiswa > 0 ? `${Math.round((siapCount / totalSiswa) * 100)}% dari total` : '—'}
              </span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">Berisiko</span>
              <span className="db-stat-value" style={{ color: '#dc2626' }}>
                {loading ? '—' : berisikoCount}
              </span>
              <span className="db-stat-sub" style={{ color: '#dc2626' }}>
                {berisikoCount > 0 ? 'Intervensi diperlukan' : 'Semua aman'}
              </span>
            </div>
          </section>

          <div className="controls-section">
            <div className="filter-buttons">
              {['Semua', 'Siap', 'Berisiko'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              className="predict-batch-btn"
              onClick={handlePredictBatch}
              disabled={batchPredicting || loading}
            >
              {batchPredicting ? (
                <>
                  <span className="predict-spinner"></span>
                  Memproses AI...
                </>
              ) : (
                <>
                  ✨ Prediksi Semua Siswa
                </>
              )}
            </button>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="db-skeleton-block" style={{ height: '300px' }}></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nama siswa</th>
                    <th>Minat prodi</th>
                    <th>Exam Score</th>
                    <th>Prediksi AI</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                        Tidak ada data siswa
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td><span className="student-name">{student.name}</span></td>
                        <td><span className="prodi-info">{student.prodi}</span></td>
                        <td>{student.score?.toFixed(0) || '—'}</td>
                        <td>
                          {student.prediction !== null ? (
                            <div className="prediction-cell">
                              <span className="prediction-value">
                                {typeof student.prediction === 'number' ? student.prediction.toFixed(0) : student.prediction}
                              </span>
                              {student.is_simulated !== null && (
                                <span className={`pred-source-badge ${student.is_simulated ? 'pred-sim' : 'pred-ai'}`}>
                                  {student.is_simulated ? 'Simulasi' : '✨ AI'}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Belum diprediksi</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="action-buttons">
                            <button
                              className="predict-btn"
                              onClick={() => handlePredict(student.student_id)}
                              disabled={predicting && predictingId === student.student_id}
                              title="Jalankan Prediksi AI"
                            >
                              {predicting && predictingId === student.student_id ? (
                                <span className="predict-spinner-sm"></span>
                              ) : (
                                '🤖'
                              )}
                            </button>
                            <button
                              className="detail-btn"
                              onClick={() => navigate(`/guru/detail-siswa?id=${student.student_id}`)}
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrediksiSiswa_Page;
