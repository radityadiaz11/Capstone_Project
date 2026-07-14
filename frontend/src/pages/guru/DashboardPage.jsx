import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import api from '../../api/axios';


/* ── Nav Menu ─────────────────────────────────────────────────── */
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

function AiStatusBadge({ status }) {
  if (status === 'loading') {
    return (
      <span className="ai-status-badge ai-status-loading">
        <span className="ai-status-dot ai-dot-pulse"></span>
        Mengecek AI...
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="ai-status-badge ai-status-active">
        <span className="ai-status-dot ai-dot-green"></span>
        AI Model Aktif
      </span>
    );
  }
  return (
    <span className="ai-status-badge ai-status-inactive">
      <span className="ai-status-dot ai-dot-red"></span>
      Mode Simulasi
    </span>
  );
}

function Topbar({ title = 'Dashboard', subtitle = 'Tahun Ajaran 2025/2026', aiStatus, profile = {} }) {
  return (
    <header className="db-topbar">
      <div className="db-topbar-left">
        <h1 className="db-page-title">{title}</h1>
        <span className="db-page-sub">{subtitle}</span>
      </div>
      <div className="db-topbar-right">
        <AiStatusBadge status={aiStatus} />
        <div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>
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

function SkeletonCard() {
  return (
    <div className="db-stat-card db-skeleton">
      <div className="skeleton-line skeleton-sm"></div>
      <div className="skeleton-line skeleton-lg"></div>
      <div className="skeleton-line skeleton-sm"></div>
    </div>
  );
}

function StatusPanel({ data, loading }) {
  if (loading) {
    return (
      <div className="db-card db-status-panel">
        <div className="db-card-header">
          <span className="db-card-title">Status kesiapan SNBP</span>
        </div>
        <div className="db-skeleton-block" style={{ height: '160px' }}></div>
      </div>
    );
  }

  const total = data?.totalSiswa || 0;
  const aman = data?.distribusiRisiko?.rendah || 0;
  const berisiko = (data?.distribusiRisiko?.tinggi || 0) + (data?.distribusiRisiko?.sedang || 0);
  const amanPct = total > 0 ? Math.round((aman / total) * 100) : 0;
  const berisikoPct = total > 0 ? Math.round((berisiko / total) * 100) : 0;

  return (
    <div className="db-card db-status-panel">
      <div className="db-card-header">
        <span className="db-card-title">Status kesiapan SNBP</span>
        <span className="db-badge db-badge-blue">{total} siswa</span>
      </div>

      <div className="db-status-buckets" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="db-bucket db-bucket-green">
          <span className="db-bucket-num">{aman}</span>
          <span className="db-bucket-label">Aman</span>
        </div>
        <div className="db-bucket db-bucket-red">
          <span className="db-bucket-num">{berisiko}</span>
          <span className="db-bucket-label">Berisiko</span>
        </div>
      </div>

      <div className="db-progress-list">
        {[
          { label: 'Aman', pct: amanPct, count: aman, color: '#22c55e' },
          { label: 'Berisiko', pct: berisikoPct, count: berisiko, color: '#ef4444' },
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

function NotifPanel({ notifications, warningCount, loading }) {
  if (loading) {
    return (
      <div className="db-card db-notif-panel">
        <div className="db-card-header">
          <span className="db-card-title">Notifikasi terbaru</span>
        </div>
        <div className="db-skeleton-block" style={{ height: '160px' }}></div>
      </div>
    );
  }

  const notifs = notifications || [];

  return (
    <div className="db-card db-notif-panel">
      <div className="db-card-header">
        <span className="db-card-title">Notifikasi terbaru</span>
        {warningCount > 0 && (
          <span className="db-badge db-badge-red">{warningCount} baru</span>
        )}
      </div>

      <div className="db-notif-list">
        {notifs.length === 0 ? (
          <div className="db-empty-state">
            <span style={{ fontSize: '24px' }}>🔔</span>
            <p>Belum ada notifikasi</p>
          </div>
        ) : (
          notifs.map((n) => (
            <div key={n.id} className="db-notif-item">
              <div
                className="db-notif-icon"
                style={{ background: n.iconBg, color: n.iconColor }}
              >
                {n.icon}
              </div>
              <div className="db-notif-content">
                <p className="db-notif-title">{n.title}</p>
                <span className="db-notif-time">
                  {n.time ? new Date(n.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          ))
        )}
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

function RiskTable({ students, loading }) {
  if (loading) {
    return (
      <div className="db-card db-risk-table-card">
        <div className="db-card-header">
          <span className="db-card-title">Siswa berisiko — aksi diperlukan</span>
        </div>
        <div className="db-skeleton-block" style={{ height: '200px' }}></div>
      </div>
    );
  }

  const riskStudents = students || [];

  return (
    <div className="db-card db-risk-table-card">
      <div className="db-card-header">
        <span className="db-card-title">
          {riskStudents.length} siswa berisiko &mdash; aksi diperlukan
        </span>
        <span className="db-badge db-badge-red-outline">Prioritas</span>
      </div>

      <div className="db-table-wrapper">
        <table className="db-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Rata-rata nilai</th>
              <th>Kehadiran</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {riskStudents.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                  Tidak ada siswa berisiko
                </td>
              </tr>
            ) : (
              riskStudents.map((s) => (
                <tr key={s.id}>
                  <td className="db-td-name">{s.name}</td>
                  <td>{s.avg}</td>
                  <td>{s.attendance}%</td>
                  <td>{statusBadge(s.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function DashboardPage() {
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

  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState('loading');

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard');
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAiStatus = async () => {
      try {
        const response = await api.get('/predict/model-status');
        if (response.data.success) {
          setAiStatus(response.data.data.status);
        }
      } catch {
        setAiStatus('inactive');
      }
    };

    fetchDashboard();
    fetchAiStatus();
  }, []);

  const handleNavigate = (id) => {
    setActivePage(id);
    if (id === 'prediksi') navigate('/guru/prediksi-siswa');
    if (id === 'dashboard') navigate('/guru/dashboard');
    if (id === 'nilai') navigate('/guru/data-nilai');
    if (id === 'monitoring') navigate('/guru/monitoring-kelas');
    if (id === 'tambah-siswa') navigate('/guru/tambah-siswa');
    if (id === 'ekspor') navigate('/guru/ekspor-data');
    if (id === 'notifikasi-settings') navigate('/guru/notifikasi');
    if (id === 'pengaturan') navigate('/guru/pengaturan');
    if (id === 'keluar') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/', {
        replace: true
      });
    }
  };

  // Build stat cards from API data
  const totalSiswa = dashboardData?.totalSiswa || 0;
  const aman = dashboardData?.distribusiRisiko?.rendah || 0;
  const berisiko = (dashboardData?.distribusiRisiko?.tinggi || 0) + (dashboardData?.distribusiRisiko?.sedang || 0);

  const statCards = [
    {
      id: 'total',
      label: 'Total siswa',
      value: loading ? '—' : String(totalSiswa),
      
      subColor: '#555',
      accent: '#1a56db',
    },
    {
      id: 'prediksi',
      label: 'Aman',
      value: loading ? '—' : String(aman),
      sub: `${totalSiswa > 0 ? Math.round((aman / totalSiswa) * 100) : 0}% dari total`,
      subColor: '#16a34a',
      accent: '#16a34a',
    },
    {
      id: 'perhatian',
      label: 'Berisiko',
      value: loading ? '—' : String(berisiko),
      sub: berisiko > 0 ? 'Intervensi diperlukan' : 'Semua aman',
      subColor: berisiko > 0 ? '#dc2626' : '#16a34a',
      accent: '#dc2626',
    },
  ];

  return (
    <div className="db-shell">
      <Sidebar active={activePage} onNavigate={handleNavigate} />

      <div className="db-main">
        <Topbar aiStatus={aiStatus}  profile={profile} />

        <main className="db-content">
          {/* Stat cards */}
          <div className="db-stat-grid">
            {loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : statCards.map((c) => <StatCard key={c.id} {...c} />)
            }
          </div>

          {/* Middle row */}
          <div className="db-mid-row">
            <StatusPanel data={dashboardData} loading={loading} />
            <NotifPanel
              notifications={dashboardData?.notifications}
              warningCount={dashboardData?.warningBelumDibaca}
              loading={loading}
            />
          </div>

          {/* Risk table */}
          <RiskTable students={dashboardData?.riskStudents} loading={loading} />
        </main>
      </div>
    </div>
  );
}
