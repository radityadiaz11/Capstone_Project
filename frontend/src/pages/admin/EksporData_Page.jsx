import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EksporData_Page.css';
import api from '../../api/axios';

function EksporData_Page() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: 'ADMIN', role: 'Kepala Sekolah' });

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loadingItem, setLoadingItem] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/', { replace: true });
    };

    const [statsData, setStatsData] = useState([]);
    const [riwayatEkspor, setRiwayatEkspor] = useState([
        { label: 'Laporan Kesiapan April 2026', type: 'PDF', typeClass: 'ekd-badge-pdf' },
        { label: 'Data Nilai Sem. 5 Semua Kelas', type: 'Excel', typeClass: 'ekd-badge-excel' },
        { label: 'Laporan Kesiapan Maret 2026', type: 'PDF', typeClass: 'ekd-badge-pdf' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/snbp-stats');
                if (res.data.success && res.data.data.kelasPerforma) {
                    setStatsData(res.data.data.kelasPerforma);
                }
            } catch (error) {
                console.error('Error fetching stats for report:', error);
            }
        };
        fetchStats();
    }, []);

    const handleExport = (type) => {
        setLoadingItem(type);
        setTimeout(() => {
            setLoadingItem(null);
            if (type === 'excel') {
                api.get('/students')
                    .then(res => {
                        let studentsData = [];
                        if (res.data && res.data.data) {
                            studentsData = res.data.data;
                        }

                        let tableHtml = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head>
    <meta charset="utf-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Data Nilai Siswa</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
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
                            { label: `Data Nilai (${dateStr} ${timeStr})`, type: 'Excel', typeClass: 'ekd-badge-excel' },
                            ...prev
                        ]);
                    })
                    .catch(err => {
                        console.error('Error fetching students for export:', err);
                        alert('Gagal mengambil data untuk diekspor.');
                    });
            } else if (type === 'pdf') {
                const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                setRiwayatEkspor(prev => [
                    { label: `Laporan Kesiapan (${dateStr} ${timeStr})`, type: 'PDF', typeClass: 'ekd-badge-pdf' },
                    ...prev
                ]);
                window.print();
            }
        }, 1800);
    };



    return (
        <div className="ekd-container">

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
                    {/* Brand */}
                    <div className="dbs-brand">
                        <h1 className="dbs-brand-title">SNBP Monitor</h1>
                        <p className="dbs-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    {/* Role Badge */}
                    <div className="dbs-role-badge">
                        <span className="dbs-role-dot"></span>
                        <span>Admin / Kepsek</span>
                    </div>

                    {/* Navigation */}
                    <nav className="dbs-nav">
                        <span className="dbs-nav-label">Menu Utama</span>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊞</span>
                            <span>Dashboard Sekolah</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/rekap-kelas'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">◎</span>
                            <span>Rekap Per Kelas</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/tambah-siswa'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">✚</span>
                            <span>Tambah Data Siswa</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/tambah-role'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">👥</span>
                            <span>Tambah Role</span>
                        </button>

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/statistik'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button
                            className="dbs-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="dbs-sidebar-bottom">
                    <button className="dbs-nav-item"
                        onClick={() => { navigate('/admin/notifikasi'); setIsMobileMenuOpen(false); }}>
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>

                    <button className="dbs-nav-item"
                        onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}>
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
            <div className="ekd-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Ekspor Data</h2>
                        <p className="dbs-page-sub">Pilih data yang ingin diekspor</p>
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
                <main className="ekd-content">
                    <div className="ekd-grid">

                        {/* ---- LEFT: Ekspor Cards ---- */}
                        <div className="ekd-left">

                            {/* Card 1: Laporan Kesiapan SNBP */}
                            <div className="ekd-card">
                                <div className="ekd-card-header">
                                    <div>
                                        <h3 className="ekd-card-title">Laporan kesiapan SNBP</h3>
                                        <p className="ekd-card-desc">
                                            Ringkasan status kesiapan dan rekomendasi per kelas.
                                        </p>
                                    </div>
                                    <span className="ekd-badge ekd-badge-pdf">PDF</span>
                                </div>
                                <button
                                    className={`ekd-btn ${loadingItem === 'pdf' ? 'ekd-btn-loading' : ''}`}
                                    onClick={() => handleExport('pdf')}
                                    disabled={loadingItem === 'pdf'}
                                >
                                    {loadingItem === 'pdf' ? (
                                        <span className="ekd-spinner"></span>
                                    ) : (
                                        <>Buat laporan <span className="ekd-btn-arrow">↗</span></>
                                    )}
                                </button>
                            </div>

                            {/* Card 2: Data Nilai Seluruh Siswa */}
                            <div className="ekd-card">
                                <div className="ekd-card-header">
                                    <div>
                                        <h3 className="ekd-card-title">Data nilai seluruh siswa</h3>
                                        <p className="ekd-card-desc">
                                            Semua nilai per mata pelajaran semester 1–5 dalam format spreadsheet.
                                        </p>
                                    </div>
                                    <span className="ekd-badge ekd-badge-excel">Excel</span>
                                </div>
                                <button
                                    className={`ekd-btn ${loadingItem === 'excel' ? 'ekd-btn-loading' : ''}`}
                                    onClick={() => handleExport('excel')}
                                    disabled={loadingItem === 'excel'}
                                >
                                    {loadingItem === 'excel' ? (
                                        <span className="ekd-spinner"></span>
                                    ) : (
                                        <>Ekspor Excel <span className="ekd-btn-arrow">↗</span></>
                                    )}
                                </button>
                            </div>



                        </div>

                        {/* ---- RIGHT: Riwayat Ekspor ---- */}
                        <div className="ekd-right">
                            <div className="ekd-card ekd-riwayat-card">
                                <h3 className="ekd-card-title">Riwayat ekspor</h3>
                                <div className="ekd-riwayat-list">
                                    {riwayatEkspor.map((item, idx) => (
                                        <div key={idx} className="ekd-riwayat-item">
                                            <span className="ekd-riwayat-label">{item.label}</span>
                                            <span className={`ekd-badge ${item.typeClass}`}>{item.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* --- PRINTABLE REPORT (Hidden on screen, shown when printing) --- */}
            <div className="print-report-container">
                <div className="print-report-header">
                    <h2>Laporan Kesiapan SNBP</h2>
                    <p>Ringkasan status kesiapan dan rekomendasi per kelas</p>
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
                        {statsData.length > 0 ? statsData.map((k, i) => (
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
