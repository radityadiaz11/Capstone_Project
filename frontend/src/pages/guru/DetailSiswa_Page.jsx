import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './DashboardPage.css'; // Premium shell and sidebar styles
import './DetailSiswa_Page.css';
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

function Topbar({ title = 'Detail Siswa', onBack, profile = {} }) {
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
        <div className="db-profile-info">
          <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
          <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
        </div>
        <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
      </div>
    </header>
  );
}

const DetailSiswa_Page = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState({});
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) { }
    };
    fetchProfile();
  }, []);

  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');

  // Data states
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [narasi, setNarasi] = useState(null);
  const [narasiLoading, setNarasiLoading] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get(`/students/${studentId}`);
        if (res.data.success) {
          setStudent(res.data.data);

          // If student has warnings/predictions, use latest
          const data = res.data.data;
          // Gunakan sessionStorage agar persist antar halaman tapi reset saat logout
          const sessionPreds = JSON.parse(sessionStorage.getItem('session_predictions') || '{}');
          if (sessionPreds[studentId]) {
            setPrediction(sessionPreds[studentId]);
          }
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Run AI prediction
  const handlePredict = async () => {
    if (!studentId) return;
    try {
      setPredicting(true);
      const res = await api.post('/predict', { student_id: studentId });
      if (res.data.success) {
        setPrediction(res.data.data);
        const sessionPreds = JSON.parse(sessionStorage.getItem('session_predictions') || '{}');
        sessionPreds[studentId] = res.data.data;
        sessionStorage.setItem('session_predictions', JSON.stringify(sessionPreds));
      }
    } catch (error) {
      console.error('Error predicting:', error);
    } finally {
      setPredicting(false);
    }
  };

  // Fetch AI narasi
  const handleFetchNarasi = async () => {
    if (!studentId) return;
    try {
      setNarasiLoading(true);
      const res = await api.post('/predict/narasi', {
        student_id: studentId,
        role: 'guru'
      });
      if (res.data.success) {
        setNarasi(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching narasi:', error);
    } finally {
      setNarasiLoading(false);
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
      sessionStorage.removeItem('session_predictions');
      navigate('/', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="db-shell">
        <Sidebar active="prediksi" onNavigate={handleNavigate} />
        <div className="db-main">
          <Topbar profile={profile} title="Detail Siswa" onBack={() => navigate('/guru/prediksi-siswa')} />
          <main className="db-content">
            <div className="db-skeleton-block" style={{ height: '120px' }}></div>
            <div className="db-mid-row">
              <div className="db-skeleton-block" style={{ height: '250px' }}></div>
              <div className="db-skeleton-block" style={{ height: '250px' }}></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="db-shell">
        <Sidebar active="prediksi" onNavigate={handleNavigate} />
        <div className="db-main">
          <Topbar profile={profile} title="Detail Siswa" onBack={() => navigate('/guru/prediksi-siswa')} />
          <main className="db-content">
            <div className="db-empty-state" style={{ minHeight: '300px' }}>
              <span style={{ fontSize: '48px' }}>🔍</span>
              <p>Siswa tidak ditemukan</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Prepare display data
  const examScore = student.exam_score || 0;
  const status = examScore < 20 ? 'Berisiko' : examScore < 40 ? 'Perhatian' : 'Siap';
  const avatarInitials = (student.nama || 'XX').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const subjects = [
    { name: 'Matematika', score: student.math_score || 0 },
    { name: 'Bahasa Indonesia', score: student.indo_score || 0 },
    { name: 'Biologi', score: student.bio_score || 0 },
    { name: 'Kimia', score: student.chem_score || 0 },
    { name: 'Fisika', score: student.phy_score || 0 },
    { name: 'Bahasa Inggris', score: student.eng_score || 0 },
  ].filter(s => s.score > 0);

  // Hitung Produktifitas berdasarkan target 120 hari masuk sekolah
  const totalHadir = (student.attendance_w1 || 0) + (student.attendance_w2 || 0) + (student.attendance_w3 || 0) + (student.attendance_w4 || 0);
  let produktifitas = totalHadir > 0 ? Math.min(Math.round((totalHadir / 120) * 100), 100) : 0;

  return (
    <div className="db-shell">
      {/* Unified Sidebar */}
      <Sidebar active="prediksi" onNavigate={handleNavigate} />

      {/* Main Area */}
      <div className="db-main">
        {/* Unified Topbar with Back Navigation */}
        <Topbar profile={profile} title="Detail Siswa" onBack={() => navigate('/guru/prediksi-siswa')} />

        {/* Content Area */}
        <main className="db-content detail-content-wrapper">

          {/* 1. Student Header Card */}
          <div className="student-detail-header-card">
            <div className="sdh-left">
              <div className="sdh-avatar-circle">{avatarInitials}</div>
              <div className="sdh-info">
                <h2>{student.nama || 'Siswa'}</h2>
                <p>ID: {student.student_id} &middot; {student.prodi || 'Prodi belum diisi'}</p>
                <div className="sdh-badges">
                  <span className={`sdh-badge ${status === 'Berisiko' ? 'badge-risk' : status === 'Perhatian' ? 'badge-warning' : 'badge-safe'}`}>
                    {status}
                  </span>
                  <span className="sdh-badge badge-score">Skor: {examScore.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div className="sdh-right">
              <button
                className="predict-batch-btn"
                onClick={handlePredict}
                disabled={predicting || prediction !== null}
                style={{ 
                  fontSize: '13px', 
                  padding: '8px 18px',
                  ...(prediction !== null ? { backgroundColor: '#16a34a', borderColor: '#16a34a', cursor: 'default', opacity: 1 } : {})
                }}
              >
                {predicting ? (
                  <>
                    <span className="predict-spinner"></span>
                    Memproses...
                  </>
                ) : prediction !== null ? (
                  <>✅ Sudah Terprediksi</>
                ) : (
                  <>🤖 Jalankan Prediksi AI</>
                )}
              </button>
            </div>
          </div>

          {/* 2. AI Prediction Panel */}
          {prediction && (
            <div className="db-card ai-prediction-card">
              <div className="db-card-header">
                <span className="db-card-title">
                  ✨ Hasil Prediksi AI
                </span>
                <span className={`pred-source-badge ${prediction.is_simulated ? 'pred-sim' : 'pred-ai'}`}>
                  {prediction.is_simulated ? 'Simulasi' : 'Powered by AI'}
                </span>
              </div>
              <div className="ai-pred-grid">
                <div className="ai-pred-item">
                  <span className="ai-pred-label">Prediksi Nilai</span>
                  <span className="ai-pred-value" style={{ color: '#1d4ed8' }}>
                    {typeof prediction.prediksi_nilai === 'number' ? prediction.prediksi_nilai.toFixed(0) : prediction.prediksi_nilai || '—'}
                  </span>
                </div>
                <div className="ai-pred-item">
                  <span className="ai-pred-label">Level Risiko</span>
                  <span className={`ai-pred-value ai-risk-${prediction.level_risiko || 'rendah'}`}>
                    {prediction.level_risiko ? prediction.level_risiko.charAt(0).toUpperCase() + prediction.level_risiko.slice(1) : '—'}
                  </span>
                </div>
                <div className="ai-pred-item">
                  <span className="ai-pred-label">Tren</span>
                  <span className="ai-pred-value" style={{ color: prediction.tren === 'naik' ? '#16a34a' : prediction.tren === 'turun' ? '#dc2626' : '#64748b' }}>
                    {prediction.tren === 'naik' ? '↑ Naik' : prediction.tren === 'turun' ? '↓ Turun' : '→ Stabil'}
                  </span>
                </div>
                <div className="ai-pred-item">
                  <span className="ai-pred-label">Confidence</span>
                  <span className="ai-pred-value" style={{ color: '#7c3aed' }}>
                    {prediction.confidence != null ? (
                      prediction.confidence >= 0 ? `${(prediction.confidence * 100).toFixed(0)}%` : '—'
                    ) : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Grid for Subject Scores & Stats/Actions */}
          <div className="db-mid-row detail-grid-row">

            {/* Left Card: Nilai per mata pelajaran */}
            <div className="db-card detail-subjects-card">
              <div className="db-card-header">
                <span className="db-card-title">Nilai per mata pelajaran</span>
                <span className="db-badge db-badge-blue">Database</span>
              </div>

              <div className="db-progress-list detail-progress-list">
                {subjects.length > 0 ? subjects.map((subj) => (
                  <div key={subj.name} className="db-progress-row detail-progress-row">
                    <span className="db-progress-label detail-subj-name">{subj.name}</span>
                    <div className="db-progress-track">
                      <div
                        className="db-progress-fill"
                        style={{
                          width: `${subj.score}%`,
                          background: subj.score >= 75 ? '#2563eb' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="db-progress-count detail-subj-score">{subj.score.toFixed(0)}</span>
                  </div>
                )) : (
                  <div className="db-empty-state" style={{ padding: '20px' }}>
                    <p>Belum ada data nilai</p>
                  </div>
                )}
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
                    <span className="ds-label">Exam Score</span>
                    <span className="ds-val" style={{ fontWeight: 600 }}>{examScore.toFixed(0)}</span>
                  </div>
                  <div className="detail-stat-row">
                    <span className="ds-label">Produktifitas</span>
                    <span className="ds-val" style={{ color: produktifitas < 75 ? '#ef4444' : '#16a34a', fontWeight: 600 }}>{produktifitas}%</span>
                  </div>

                  <div className="detail-stat-row" style={{ borderBottom: 'none' }}>
                    <span className="ds-label">Mental Health</span>
                    <span className="ds-val" style={{ color: (student.mental_health_score || 100) < 60 ? '#ef4444' : (student.mental_health_score == 60 ? '#f59e0b' : '#16a34a'), fontWeight: 600 }}>
                      {student.mental_health_score == 100 ? 'Tinggi' : student.mental_health_score == 60 ? 'Sedang' : student.mental_health_score == 30 ? 'Rendah' : 'Tinggi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Narasi AI */}
              <div className="db-card detail-actions-card">
                <div className="db-card-header" style={{ marginBottom: '14px' }}>
                  <span className="db-card-title">✨ Rekomendasi AI</span>
                </div>

                {narasi && (
                  <div className="ai-narasi-content" style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
                      {narasi.narasi}
                    </p>
                    <span className={`pred-source-badge ${narasi.is_ai ? 'pred-ai' : 'pred-sim'}`} style={{ marginTop: '10px', display: 'inline-block' }}>
                      {narasi.is_ai ? '✨ Powered by AI' : 'Fallback'}
                    </span>
                  </div>
                )}
                
                <div className="detail-action-buttons">
                  <button
                    className="teacher-action-btn"
                    type="button"
                    onClick={handleFetchNarasi}
                    disabled={narasiLoading}
                  >
                    <span>{narasiLoading ? 'Memuat narasi...' : (narasi ? 'Perbarui Rekomendasi' : 'Minta Rekomendasi AI')}</span>
                    <span className="tab-arrow">✨</span>
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
