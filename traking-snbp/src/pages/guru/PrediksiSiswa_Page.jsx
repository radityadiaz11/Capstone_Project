import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Share the premium layout and sidebar style
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

function Topbar({ title = 'Prediksi Siswa', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII IPA 1' }) {
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

const PrediksiSiswa_Page = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loadingPredict, setLoadingPredict] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePredict = async (id) => {
    setLoadingPredict(id);
    try {
      await api.post('/predict', { student_id: id });
      await fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Gagal memanggil AI');
    } finally {
      setLoadingPredict(null);
    }
  };

  const mappedStudents = students.map(s => {
    const riwayat = s.riwayatPrediksi || [];
    const prediksi = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;

    let statusText = 'Belum';
    let predictionText = '-';

    if (prediksi) {
      predictionText = prediksi.prediksi_nilai || '-';
      const risk = (prediksi.level_risiko || '').toLowerCase();
      if (risk === 'rendah') statusText = 'Siap';
      else if (risk === 'sedang') statusText = 'Perhatian';
      else if (risk === 'tinggi') statusText = 'Berisiko';
      else statusText = prediksi.level_risiko;
    }

    return {
      id: s.student_id,
      name: s.nama || `Siswa ${s.student_id}`,
      prodi: s.prodi || '-',
      score: s.exam_score || '-',
      prediction: predictionText,
      status: statusText
    };
  });

  const filteredStudents = activeFilter === 'Semua'
    ? mappedStudents
    : mappedStudents.filter(s => s.status === activeFilter);

  // Kalkulasi statistik riil
  const totalPrediksiSelesai = mappedStudents.filter(s => s.prediction !== '-').length;
  const countLolos = mappedStudents.filter(s => s.status === 'Siap').length;
  const countTidakLolos = mappedStudents.filter(s => s.status === 'Berisiko').length;
  
  let sumPrediksi = 0;
  mappedStudents.forEach(s => {
      if (s.prediction !== '-') sumPrediksi += parseFloat(s.prediction);
  });
  const avgPrediksi = totalPrediksiSelesai > 0 ? Math.round(sumPrediksi / totalPrediksiSelesai) : 0;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Siap': return 'status-siap';
      case 'Perhatian': return 'status-perhatian';
      case 'Berisiko': return 'status-berisiko';
      default: return '';
    }
  };

  const getPredictionClass = (val) => {
    if (val === '-') return 'prediction-val';
    const num = parseFloat(val);
    if (num >= 80) return 'prediction-val high';
    if (num >= 60) return 'prediction-val medium';
    return 'prediction-val low';
  };

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
      {/* Unified Sidebar */}
      <Sidebar active="prediksi" onNavigate={handleNavigate} />

      {/* Main Area */}
      <div className="db-main">
        {/* Unified Topbar */}
        <Topbar title="Prediksi Siswa" subtitle="Tahun Ajaran 2025/2026 • Kelas XII IPA 1" />

        {/* Content Area */}
        <main className="db-content">
          {/* Summary Grid with matching premium design */}
          <section className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="db-stat-card">
              <span className="db-stat-label">Prediksi lolos</span>
              <span className="db-stat-value" style={{ color: '#16a34a' }}>{countLolos}</span>
              <span className="db-stat-sub" style={{ color: '#16a34a' }}>Status Siap</span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">Tidak lolos</span>
              <span className="db-stat-value" style={{ color: '#ef4444' }}>{countTidakLolos}</span>
              <span className="db-stat-sub" style={{ color: '#ef4444' }}>Status Berisiko</span>
            </div>
            <div className="db-stat-card">
              <span className="db-stat-label">Rata-rata prediksi</span>
              <span className="db-stat-value" style={{ color: '#1a56db' }}>{avgPrediksi}%</span>
              <span className="db-stat-sub" style={{ color: '#555' }}>dari yang sudah diprediksi</span>
            </div>
          </section>

          {/* Controls */}
          <div className="controls-section">
            <div className="filter-buttons">
              {['Semua', 'Siap', 'Perhatian', 'Berisiko'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama siswa</th>
                  <th>Minat prodi</th>
                  <th>Rata-rata nilai</th>
                  <th>Prediksi lolos</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td><span className="student-name">{student.name}</span></td>
                    <td><span className="prodi-info">{student.prodi}</span></td>
                    <td>{student.score}</td>
                    <td>
                      <span className={getPredictionClass(student.prediction)}>
                        {student.prediction}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {student.status === 'Belum' ? (
                        <button 
                          className="filter-btn active" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handlePredict(student.id)}
                          disabled={loadingPredict === student.id}
                        >
                          {loadingPredict === student.id ? 'Loading...' : 'Prediksi'}
                        </button>
                      ) : (
                        <button className="detail-btn" onClick={() => navigate('/detail-siswa')}>Detail</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrediksiSiswa_Page;
