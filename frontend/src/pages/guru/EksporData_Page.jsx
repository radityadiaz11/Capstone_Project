import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import './EksporData_Page.css';
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

function Topbar({ title = 'Ekspor Data', subtitle = 'Pilih data yang ingin diekspor', profile = {} }) {
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

function EksporData_Page() {
    const navigate = useNavigate();
    const [loadingItem, setLoadingItem] = useState(null);
    const [profile, setProfile] = useState({ nama: 'Ibu Sari', mengampu_kelas: 'XII IPA 1' });
    const [statsData, setStatsData] = useState([]);
    const [riwayatEkspor, setRiwayatEkspor] = useState([
        { label: 'Laporan Kesiapan April 2026', type: 'PDF', typeClass: 'fmt-pdf' },
        { label: 'Data Nilai Sem. 5 Semua Kelas', type: 'Excel', typeClass: 'fmt-excel' },
        { label: 'Laporan Kesiapan Maret 2026', type: 'PDF', typeClass: 'fmt-pdf' },
    ]);

    useEffect(() => {
        const fetchStatsAndProfile = async () => {
            try {
                const resProfile = await api.get('/users/profile');
                if (resProfile.data.success) {
                    setProfile(resProfile.data.data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
            try {
                const res = await api.get('/dashboard/snbp-stats');
                if (res.data.success && res.data.data.kelasPerforma) {
                    setStatsData(res.data.data.kelasPerforma);
                }
            } catch (error) {
                console.error('Error fetching stats for report:', error);
            }
        };
        fetchStatsAndProfile();
    }, []);

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
        if (id === 'keluar') { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/', { replace: true }); }
    };

    const handleExport = async (type) => {
        setLoadingItem(type);
        
        if (type === 'excel') {
            try {
                const res = await api.get('/students');
                let studentsData = [];
                if (res.data && res.data.data) {
                    studentsData = res.data.data;
                    if (profile.mengampu_kelas) {
                        studentsData = studentsData.filter(s => s.kelas === profile.mengampu_kelas);
                    }
                }

                let tableHtml = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head>
    <meta charset="utf-8">
    <style>
      th { background-color: #4CAF50; color: white; border: 1px solid #ddd; padding: 8px; }
      td { border: 1px solid #ddd; padding: 8px; }
    </style>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          <th>ID Siswa</th>
          <th>Nama Siswa</th>
          <th>Matematika</th>
          <th>B.Indonesia</th>
          <th>Biologi</th>
          <th>Kimia</th>
          <th>Fisika</th>
          <th>B.Inggris</th>
          <th>Skor Ujian</th>
        </tr>
      </thead>
      <tbody>`;

                studentsData.forEach(student => {
                    const nama = student.nama || "Tanpa Nama";
                    tableHtml += `
        <tr>
          <td>${student.student_id}</td>
          <td>${nama}</td>
          <td>${student.math_score || 0}</td>
          <td>${student.indo_score || 0}</td>
          <td>${student.bio_score || 0}</td>
          <td>${student.chem_score || 0}</td>
          <td>${student.phy_score || 0}</td>
          <td>${student.eng_score || 0}</td>
          <td>${student.exam_score || 0}</td>
        </tr>`;
                });

                tableHtml += `
      </tbody>
    </table>
  </body>
</html>`;

                const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "Data_Nilai_Seluruh_Siswa.xls");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 100);

                const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                setRiwayatEkspor(prev => [
                    { label: `Data Nilai (${dateStr} ${timeStr})`, type: 'Excel', typeClass: 'fmt-excel' },
                    ...prev
                ]);
            } catch (err) {
                console.error('Error fetching students for export:', err);
                alert('Gagal mengambil data untuk diekspor.');
            }
            setLoadingItem(null);
        } else if (type === 'pdf') {
            const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setRiwayatEkspor(prev => [
                { label: `Laporan Kesiapan (${dateStr} ${timeStr})`, type: 'PDF', typeClass: 'fmt-pdf' },
                ...prev
            ]);
            setTimeout(() => {
                setLoadingItem(null);
                window.print();
            }, 300);
        }
    };

    return (
        <div className="db-shell">
            <Sidebar active="ekspor" onNavigate={handleNavigate} />

            <div className="db-main">
                <Topbar title="Ekspor Data" subtitle="Pilih data yang ingin diekspor"  profile={profile} />

                <main className="db-content ekspor-content-wrapper">
                    <div className="ekspor-grid-row">

                        {/* ---- LEFT: Ekspor Cards ---- */}
                        <div className="ekspor-options-stack">

                            {/* Card 1: Laporan Kesiapan SNBP */}
                            <div className="db-card ekspor-opt-card">
                                <div className="ekspor-opt-header">
                                    <div>
                                        <h3 className="ekspor-opt-title">Laporan kesiapan SNBP</h3>
                                        <p className="ekspor-opt-desc">
                                            Ringkasan status kesiapan dan rekomendasi per kelas.
                                        </p>
                                    </div>
                                    <span className="ekspor-fmt-badge fmt-pdf">PDF</span>
                                </div>
                                <button
                                    className={`ekspor-action-btn ${loadingItem === 'pdf' ? 'loading' : ''}`}
                                    onClick={() => handleExport('pdf')}
                                    disabled={loadingItem === 'pdf'}
                                >
                                    {loadingItem === 'pdf' ? (
                                        <span>...</span>
                                    ) : (
                                        <>Buat laporan <span className="arrow-icon">↗</span></>
                                    )}
                                </button>
                            </div>

                            {/* Card 2: Data Nilai Seluruh Siswa */}
                            <div className="db-card ekspor-opt-card">
                                <div className="ekspor-opt-header">
                                    <div>
                                        <h3 className="ekspor-opt-title">Data nilai kelas {profile.mengampu_kelas || 'yang diampu'}</h3>
                                        <p className="ekspor-opt-desc">
                                            Semua nilai siswa per mata pelajaran semester 1–5 dalam format spreadsheet.
                                        </p>
                                    </div>
                                    <span className="ekspor-fmt-badge fmt-excel">Excel</span>
                                </div>
                                <button
                                    className={`ekspor-action-btn ${loadingItem === 'excel' ? 'loading' : ''}`}
                                    onClick={() => handleExport('excel')}
                                    disabled={loadingItem === 'excel'}
                                >
                                    {loadingItem === 'excel' ? (
                                        <span>...</span>
                                    ) : (
                                        <>Ekspor Excel <span className="arrow-icon">↗</span></>
                                    )}
                                </button>
                            </div>

                        </div>

                        {/* ---- RIGHT: Riwayat Ekspor ---- */}
                        <div className="db-card ekspor-history-card">
                            <div className="db-card-header" style={{ marginBottom: '14px' }}>
                                <span className="db-card-title">Riwayat ekspor</span>
                            </div>
                            <div className="ekspor-history-list">
                                {riwayatEkspor.map((item, idx) => (
                                    <div key={idx} className="ekspor-history-row">
                                        <span className="ekspor-history-name">{item.label}</span>
                                        <span className={`ekspor-fmt-badge ${item.typeClass}`}>{item.type}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="ekspor-history-footer">
                                Tersimpan secara lokal di perangkat Anda
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* --- PRINTABLE REPORT --- */}
            <div className="print-report-container">
                <div className="print-report-header">
                    <h2>Laporan Kesiapan SNBP</h2>
                    <p>Ringkasan status kesiapan dan rekomendasi kelas {profile.mengampu_kelas}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
                <table className="print-report-table">
                    <thead>
                        <tr>
                            <th>Kelas</th>
                            <th>Wali Kelas</th>
                            <th>Aman</th>
                            <th>Berisiko</th>
                            <th>Rata-rata Kelas (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statsData.length > 0 ? statsData.filter(k => k.kelas === profile.mengampu_kelas).map((k, i) => (
                            <tr key={k.kelas}>
                                <td>{k.kelas}</td>
                                <td>{k.wali || `Wali Kelas ${i + 1}`}</td>
                                <td>{k.aman} Siswa</td>
                                <td>{k.total - k.aman} Siswa</td>
                                <td>{k.pct || 0}%</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Data tidak tersedia</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default EksporData_Page;
