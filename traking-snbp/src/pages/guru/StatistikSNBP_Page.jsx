import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './DashboardPage.css'; // Share the premium layout and sidebar style
import './StatistikSNBP_Page.css';

/* ── Mock data ─────────────────────────────────────────────────── */
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

/* ── Sub-components ────────────────────────────────────────────── */
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

function Topbar({ title = 'Statistik SNBP', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII' }) {
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

/* ── Main page ─────────────────────────────────────────────────── */
export default function StatistikSNBP_Page() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dbData, setDbData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/dashboard/snbp-stats');
        if (response.data.success) {
          setDbData(response.data.data);
        } else {
          setError('Gagal memuat statistik SNBP');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // ── Transform Backend Data ──
  const totalSiswa = dbData?.totalSiswa || 0;
  const siap = dbData?.distribusiRisiko?.rendah || 0;
  const pctSiap = totalSiswa ? Math.round((siap / totalSiswa) * 100) : 0;

  // Aggregate Prodi and PTN from kelasPerforma (which contains 'Prodi - PTN')
  const prodiMap = {};
  const ptnMap = {};
  
  if (dbData?.kelasPerforma) {
    dbData.kelasPerforma.forEach(item => {
      const parts = item.kelas.split(' - ');
      const prodi = parts[0] ? parts[0].trim() : 'Lainnya';
      const ptn = parts[1] ? parts[1].trim() : 'Lainnya';
      
      prodiMap[prodi] = (prodiMap[prodi] || 0) + item.total;
      ptnMap[ptn] = (ptnMap[ptn] || 0) + item.total;
    });
  }

  // Find top Prodi
  let topProdiName = '-';
  let topProdiCount = 0;
  for (let prodi in prodiMap) {
    if (prodiMap[prodi] > topProdiCount && prodi !== 'Lainnya' && !prodi.startsWith('Prodi')) {
      topProdiCount = prodiMap[prodi];
      topProdiName = prodi;
    }
  }
  // Fallback for mock data (prodi 1, prodi 2 etc)
  if (topProdiName === '-' && Object.keys(prodiMap).length > 0) {
    const keys = Object.keys(prodiMap);
    topProdiName = keys[0];
    topProdiCount = prodiMap[keys[0]];
  }

  // Find top PTN
  let topPtnName = '-';
  let topPtnCount = 0;
  for (let ptn in ptnMap) {
    if (ptnMap[ptn] > topPtnCount && ptn !== 'Lainnya') {
      topPtnCount = ptnMap[ptn];
      topPtnName = ptn;
    }
  }

  const statCards = [
    {
      title: 'On track',
      value: `${siap}`,
      subtext: `dari ${totalSiswa} siswa (${pctSiap}%)`,
      valueColor: '#16a34a',
    },
    {
      title: 'Prodi paling diminati',
      value: topProdiName,
      subtext: `${topProdiCount} siswa minat`,
      valueColor: '#1e293b',
    },
    {
      title: 'PTN paling diminati',
      value: topPtnName,
      subtext: `${topPtnCount} siswa pilih`,
      valueColor: '#1e293b',
    },
  ];

  // Prepare top 5 for Peminatan prodi chart
  const prodiArr = Object.keys(prodiMap).map(name => ({
    name,
    count: prodiMap[name],
    pct: Math.round((prodiMap[name] / totalSiswa) * 100)
  })).sort((a, b) => b.count - a.count);

  const colors = ['#1a56db', '#1e40af', '#2563eb', '#3b82f6', '#cbd5e1'];
  const peminatanProdi = prodiArr.slice(0, 5).map((p, idx) => ({
    ...p,
    color: colors[idx % colors.length]
  }));

  return (
    <div className="db-shell">
      <Sidebar active="statistik" onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar />

        <main className="db-content">
          {loading ? (
            <div className="db-loading-state">
              <div className="spinner"></div>
              <p>Memuat statistik SNBP...</p>
            </div>
          ) : error ? (
            <div className="db-error-state">{error}</div>
          ) : (
            <>
          {/* Upper 3 Stat Cards */}
          <div className="db-stat-grid stat-three-columns">
            {statCards.map((card, index) => (
              <div key={index} className="db-stat-card">
                <span className="db-stat-label">{card.title}</span>
                <span className="db-stat-value" style={{ color: card.valueColor }}>
                  {card.value}
                </span>
                <span className="db-stat-sub" style={{ color: card.subColor || '#64748b' }}>
                  {card.subtext}
                </span>
              </div>
            ))}
          </div>

          {/* Middle Row Layout */}
          <div className="db-mid-row stat-mid-layout">
            
            {/* Left Card: Peminatan prodi siswa */}
            <div className="db-card stat-prodi-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Peminatan prodi siswa</span>
              </div>

              <div className="stat-prodi-list">
                {peminatanProdi.map((prodi, idx) => (
                  <div key={idx} className="stat-prodi-item">
                    <div className="stat-prodi-header">
                      <span className="stat-prodi-name">{prodi.name}</span>
                      <span className="stat-prodi-count">{prodi.count} siswa</span>
                    </div>
                    <div className="stat-prodi-track">
                      <div
                        className="stat-prodi-fill"
                        style={{ width: `${prodi.pct}%`, backgroundColor: prodi.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Perbandingan lolos SNBP */}
            <div className="db-card stat-lolos-card">
              <div className="db-card-header no-border">
                <span className="db-card-title text-large">Perbandingan lolos SNBP</span>
              </div>

              <div className="stat-chart-container">
                <div className="stat-chart-bars">
                  
                  {/* Bar 1 */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2023">
                      <span className="stat-bar-val">50%</span>
                    </div>
                    <span className="stat-bar-label">2023/2024</span>
                  </div>

                  {/* Bar 2 */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2024">
                      <span className="stat-bar-val">56%</span>
                    </div>
                    <span className="stat-bar-label">2024/2025</span>
                  </div>

                  {/* Bar 3 (Highlight Green) */}
                  <div className="stat-chart-bar-wrapper">
                    <div className="stat-chart-bar bar-2025 highlighted" style={{ height: `${pctSiap}%` }}>
                      <span className="stat-bar-val text-white font-bold">{pctSiap}%</span>
                    </div>
                    <span className="stat-bar-label font-medium text-dark">2025/2026</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
