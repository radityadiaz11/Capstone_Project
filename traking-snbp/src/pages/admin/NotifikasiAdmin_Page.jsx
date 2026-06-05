import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotifikasiAdmin_Page.css';

const notifikasiData = [
    {
        id: 1,
        icon: '⚠',
        iconClass: 'nka-icon-warn',
        pesan: '31 siswa di seluruh sekolah terdeteksi berisiko tidak lolos SNBP.',
        waktu: 'Hari ini, 08.30',
        isUnread: true,
    },
    {
        id: 3,
        icon: '⏰',
        iconClass: 'nka-icon-deadline',
        pesan: 'Deadline input nilai rapor semester 5: 25 Mei 2026. 2 kelas belum selesai.',
        waktu: '2 hari lalu',
        isUnread: false,
    },
];

function NotifikasiAdmin_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="nka-container">

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

                        <span className="dbs-nav-label" style={{ marginTop: '16px' }}>Laporan</span>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/statistik-snbp'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">⊟</span>
                            <span>Statistik SNBP</span>
                        </button>

                        <button
                            className="dbs-nav-item"
                            onClick={() => { navigate('/admin/ekspor-data'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="dbs-nav-icon">↓</span>
                            <span>Ekspor Data</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                <div className="dbs-sidebar-bottom">
                    {/* Notifikasi — ACTIVE */}
                    <button
                        className="dbs-nav-item active"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span className="dbs-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="dbs-notif-badge">1</span>
                    </button>

                    <button
                        className="dbs-nav-item"
                        onClick={() => { navigate('/admin/pengaturan'); setIsMobileMenuOpen(false); }}
                    >
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
            <div className="nka-main">

                {/* Topbar */}
                <header className="dbs-topbar">
                    <div className="dbs-page-info">
                        <h2 className="dbs-page-title">Notifikasi</h2>
                        <p className="dbs-page-sub">Notifikasi tingkat sekolah</p>
                    </div>
                    <div className="dbs-profile-info">
                        <div className="dbs-profile-text">
                            <span className="dbs-profile-name">Bapak Hartono</span>
                            <span className="dbs-profile-role">Kepala Sekolah</span>
                        </div>
                        <div className="dbs-avatar">HT</div>
                    </div>
                </header>

                {/* Content */}
                <main className="nka-content">
                    <div className="nka-list">
                        {notifikasiData.map((item) => (
                            <div
                                key={item.id}
                                className={`nka-item ${item.isUnread ? 'nka-item-unread' : ''}`}
                            >
                                <div className={`nka-icon ${item.iconClass}`}>
                                    {item.icon}
                                </div>
                                <div className="nka-body">
                                    <p className="nka-pesan">{item.pesan}</p>
                                    <span className="nka-waktu">{item.waktu}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

        </div>
    );
}

export default NotifikasiAdmin_Page;
