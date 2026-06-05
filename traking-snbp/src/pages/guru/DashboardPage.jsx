import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import api from '../../api/axios';


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

const statCards = [
  {
    id: 'total',
    label: 'Total siswa',
    value: '36',
    sub: 'Kelas XII IPA 1',
    subColor: '#555',
    accent: '#1a56db',
  },
  {
    id: 'prediksi',
    label: 'Prediksi lolos SNBP',
    value: '22',
    sub: '↑ 3 dari bulan lalu',
    subColor: '#16a34a',
    accent: '#16a34a',
  },
  {
    id: 'perhatian',
    label: 'Perlu perhatian',
    value: '9',
    sub: 'Intervensi diperlukan',
    subColor: '#ea580c',
    accent: '#ea580c',
  },
];

const notifications = [
  {
    id: 1,
    icon: '⚠',
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
    title: '5 siswa terdeteksi berisiko tidak lolos SNBP.',
    time: '2 menit yang lalu',
  },
  {
    id: 2,
    icon: '↘',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Farhan Hidayat: nilai turun 65.3 → 58.1.',
    time: '1 jam yang lalu',
  },
  {
    id: 3,
    icon: '●',
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
    title: 'Kehadiran Farhan hanya 72% bulan ini.',
    time: '3 jam yang lalu',
  },
];

const riskStudents = [
  {
    id: 1,
    name: 'Farhan Hidayat',
    avg: 58.1,
    predict: 41,
    attendance: 72,
    status: 'Berisiko',
  },
  {
    id: 2,
    name: 'Muhammad Naufal',
    avg: 62.4,
    predict: 48,
    attendance: 75,
    status: 'Berisiko',
  },
  {
    id: 3,
    name: 'Rizal Kurniawan',
    avg: 72.3,
    predict: 67,
    attendance: 85,
    status: 'Perhatian',
  },
  {
    id: 4,
    name: 'Dewi Pratiwi',
    avg: 67.2,
    predict: 62,
    attendance: 88,
    status: 'Perhatian',
  },
  {
    id: 5,
    name: 'Ahmad Faisal',
    avg: 60.5,
    predict: 45,
    attendance: 70,
    status: 'Berisiko',
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

function Topbar({ title = 'Dashboard', subtitle = 'Tahun Ajaran 2025/2026 • Kelas XII IPA 1' }) {
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

function StatCard({ label, value, sub, subColor, accent }) {
  return (
    <div className="db-stat-card">
      <span className="db-stat-label">{label}</span>
      <span className="db-stat-value" style={{ color: accent }}>
        {value}
      </span>
      <span className="db-stat-sub" style={{ color: subColor }}>
        {sub}
      </span>
    </div>
  );
}

function StatusPanel({ total, siap, perhatian, berisiko }) {
  const pctSiap = total ? Math.round((siap / total) * 100) : 0;
  const pctPerhatian = total ? Math.round((perhatian / total) * 100) : 0;
  const pctBerisiko = total ? Math.round((berisiko / total) * 100) : 0;

  return (
    <div className="db-card db-status-panel">
      <div className="db-card-header">
        <span className="db-card-title">Status kesiapan SNBP</span>
        <span className="db-badge db-badge-blue">{total} siswa</span>
      </div>

      <div className="db-status-buckets">
        <div className="db-bucket db-bucket-green">
          <span className="db-bucket-num">{siap}</span>
          <span className="db-bucket-label">Siap</span>
        </div>
        <div className="db-bucket db-bucket-orange">
          <span className="db-bucket-num">{perhatian}</span>
          <span className="db-bucket-label">Perhatian</span>
        </div>
        <div className="db-bucket db-bucket-red">
          <span className="db-bucket-num">{berisiko}</span>
          <span className="db-bucket-label">Berisiko</span>
        </div>
      </div>

      <div className="db-progress-list">
        {[
          { label: 'Siap', pct: pctSiap, count: siap, color: '#22c55e' },
          { label: 'Perhatian', pct: pctPerhatian, count: perhatian, color: '#f97316' },
          { label: 'Berisiko', pct: pctBerisiko, count: berisiko, color: '#ef4444' },
        ].map((row) => (
          <div key={row.label} className="db-progress-row">
            <span className="db-progress-label">
              {row.label}{' '}
              <span style={{ color: row.color }}>({row.pct}%)</span>
            </span>
            <div className="db-progress-track">
              <div
                className="db-progress-fill"
                style={{ width: `${row.pct}%`, background: row.color }}
              />
            </div>
            <span className="db-progress-count">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifPanel({ notificationsList }) {
  return (
    <div className="db-card db-notif-panel">
      <div className="db-card-header">
        <span className="db-card-title">Notifikasi terbaru</span>
        <span className="db-badge db-badge-red">{notificationsList.length} baru</span>
      </div>

      <div className="db-notif-list">
        {notificationsList.length === 0 ? (
          <p className="db-notif-empty" style={{textAlign: 'center', color: '#999', marginTop: '20px'}}>Tidak ada notifikasi</p>
        ) : notificationsList.map((n) => (
          <div key={n.id} className="db-notif-item">
            <div
              className="db-notif-icon"
              style={{ background: n.iconBg, color: n.iconColor }}
            >
              {n.icon}
            </div>
            <div className="db-notif-content">
              <p className="db-notif-title">{n.title}</p>
              <span className="db-notif-time">{new Date(n.time).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function statusBadge(status) {
  if (status === 'Berisiko')
    return <span className="db-status-badge db-status-berisiko">{status}</span>;
  if (status === 'Perhatian')
    return <span className="db-status-badge db-status-perhatian">{status}</span>;
  return <span className="db-status-badge db-status-siap">{status}</span>;
}

function predictColor(pct) {
  if (pct < 50) return '#ef4444';
  if (pct < 65) return '#f97316';
  return '#22c55e';
}

function RiskTable({ riskList }) {
  return (
    <div className="db-card db-risk-table-card">
      <div className="db-card-header">
        <span className="db-card-title">
          {riskList.length} siswa berisiko &mdash; aksi diperlukan
        </span>
        <span className="db-badge db-badge-red-outline">Prioritas</span>
      </div>

      <div className="db-table-wrapper">
        <table className="db-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Rata-rata nilai</th>
              <th>Prediksi lolos</th>
              <th>Kehadiran (Estimasi)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {riskList.length === 0 ? (
               <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Semua siswa dalam kondisi baik.</td></tr>
            ) : riskList.map((s) => (
              <tr key={s.id}>
                <td className="db-td-name">{s.name}</td>
                <td>{s.avg}</td>
                <td style={{ color: predictColor(s.predict), fontWeight: 600 }}>
                  {s.predict}%
                </td>
                <td>{s.attendance}%</td>
                <td>{statusBadge(s.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();

  const [dbData, setDbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data.success) {
          setDbData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (id) => {
    setActivePage(id);
    if (id === 'prediksi') navigate('/prediksi-siswa');
    if (id === 'dashboard') navigate('/dashboard');
    if (id === 'nilai') navigate('/data-nilai');
    if (id === 'monitoring') navigate('/monitoring-kelas');
    if (id === 'statistik') navigate('/statistik-snbp');
    if (id === 'ekspor') navigate('/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/notifikasi');
    if (id === 'pengaturan') navigate('/pengaturan');
    if (id === 'keluar') navigate('/');
  };

  const totalSiswa = dbData ? dbData.totalSiswa : 36;
  const siap = dbData ? dbData.distribusiRisiko.rendah : 22;
  const perhatian = dbData ? dbData.distribusiRisiko.sedang : 9;
  const berisiko = dbData ? dbData.distribusiRisiko.tinggi : 5;

  const dynamicStatCards = [
    {
      id: 'total', label: 'Total siswa', value: totalSiswa.toString(),
      sub: 'Semua Prodi', subColor: '#555', accent: '#1a56db'
    },
    {
      id: 'prediksi', label: 'Prediksi lolos SNBP', value: siap.toString(),
      sub: 'Status Siap', subColor: '#16a34a', accent: '#16a34a'
    },
    {
      id: 'perhatian', label: 'Perlu perhatian', value: (perhatian + berisiko).toString(),
      sub: 'Intervensi diperlukan', subColor: '#ea580c', accent: '#ea580c'
    }
  ];

  const notificationsList = dbData?.notifications || notifications;
  const riskList = dbData?.riskStudents || riskStudents;

  return (
    <div className="db-shell">
      <Sidebar active={activePage} onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar subtitle="Dashboard Sekolah - Data Riil" />

        <main className="db-content">
          {/* Stat cards */}
          <div className="db-stat-grid">
            {dynamicStatCards.map((c) => (
              <StatCard key={c.id} {...c} />
            ))}
          </div>

          {/* Middle row */}
          <div className="db-mid-row">
            <StatusPanel total={totalSiswa} siap={siap} perhatian={perhatian} berisiko={berisiko} />
            <NotifPanel notificationsList={notificationsList} />
          </div>

          {/* Risk table */}
          <RiskTable riskList={riskList} />
        </main>
      </div>
    </div>
  );
}
