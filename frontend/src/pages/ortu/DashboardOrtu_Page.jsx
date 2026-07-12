import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardOrtu_Page.css';
import api from '../../api/axios';

function DashboardOrtu_Page() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('beranda');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', { replace: true });
    };

    const [student, setStudent] = useState(null);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/students');
                if (res.data.success && res.data.data.length > 0) {
                    setStudent(res.data.data[0]);
                }
                const resProfile = await api.get('/users/profile');
                if (resProfile.data.success) setProfile(resProfile.data.data);
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const s = student || {};
    const subjectsRaw = [
        { name: 'Matematika', score: s.math_score || 0, color: (s.math_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Bahasa Indonesia', score: s.indo_score || 0, color: (s.indo_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Biologi', score: s.bio_score || 0, color: (s.bio_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Kimia', score: s.chem_score || 0, color: (s.chem_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Fisika', score: s.phy_score || 0, color: (s.phy_score || 0) < 75 ? '#ff9f1c' : '#16a34a' },
        { name: 'Bahasa Inggris', score: s.eng_score || 0, color: (s.eng_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
    ];
    const subjects = subjectsRaw.filter(sub => sub.score > 0);
    const avgRapor = subjects.length > 0 
        ? subjects.reduce((acc, curr) => acc + curr.score, 0) / subjects.length 
        : 0;

    const examScore = s.exam_score ? s.exam_score : avgRapor;
    const avgAttendance = s.attendance_w1 != null
        ? (((s.attendance_w1 || 0) + (s.attendance_w2 || 0) + (s.attendance_w3 || 0) + (s.attendance_w4 || 0)) / 4).toFixed(0)
        : (subjects.length > 0 ? 100 : '—');

    const isWarning = (examScore > 0 && examScore < 75) || (avgAttendance !== '—' && avgAttendance < 85);

    return (
        <div className="db-ortu-container">
            {/* --- MOBILE HEADER & TOGGLE --- */}
            <div className="db-ortu-mobile-header">
                <div className="db-ortu-mobile-brand">
                    <span className="db-ortu-mobile-brand-title">SNBP Monitor</span>
                    <span className="db-ortu-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="db-ortu-mobile-toggle"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`db-ortu-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    {/* Logo Brand */}
                    <div className="db-ortu-brand">
                        <h1 className="db-ortu-brand-title">SNBP Monitor</h1>
                        <p className="db-ortu-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    {/* Role Badge - Teal #0D7A7A */}
                    <div>
                        <div className="db-ortu-role-badge">
                            <span className="db-ortu-role-dot"></span>
                            <span>Orang Tua</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="db-ortu-nav">
                        <span className="db-ortu-nav-label">Menu</span>

                        <button
                            onClick={() => { setActiveTab('beranda'); setIsMobileMenuOpen(false); navigate('/ortu/dashboard'); }}
                            className={`db-ortu-nav-item active`}
                        >
                            <span className="db-ortu-nav-icon">⊞</span>
                            <span>Beranda</span>
                        </button>

                        <button
                            onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
                            className={`db-ortu-nav-item`}
                        >
                            <span className="db-ortu-nav-icon">≡</span>
                            <span>Nilai Rapor</span>
                        </button>

                        <button
                            onClick={() => { navigate('/ortu/prediksi-snbp'); setIsMobileMenuOpen(false); }}
                            className={`db-ortu-nav-item`}
                        >
                            <span className="db-ortu-nav-icon">◎</span>
                            <span>Prediksi SNBP</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom Area */}
                <div className="db-ortu-sidebar-bottom">
                    <button
                        onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
                        className={`db-ortu-nav-item`}
                    >
                        <span className="db-ortu-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        {/* Red Badge #A32D2D */}
                        <span className="db-ortu-notif-badge">2</span>
                    </button>

                    <button
                        onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
                        className={`db-ortu-nav-item`}
                    >
                        <span className="db-ortu-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="db-ortu-nav-item db-ortu-nav-logout"
                    >
                        <span className="db-ortu-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA (RIGHT) --- */}
            <div className="db-ortu-main">
                {/* Sticky Topbar */}
                <header className="db-ortu-topbar">
                    <div className="db-ortu-page-info">
                        <h2 className="db-ortu-page-title">Beranda</h2>
                        <p className="db-ortu-page-sub">Pantau perkembangan akademik {s.nama || 'anak Anda'}</p>
                    </div>

                    {/* User Profile + Avatar */}
                    <div className="db-ortu-profile-info">
                        <div className="db-ortu-profile-text">
                            <span className="db-ortu-profile-name">{profile.nama || 'ORANG TUA'}</span>
                            <span className="db-ortu-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
                        </div>
                        {/* Avatar using blue #185FA5 details */}
                        <div className="db-ortu-avatar">
                            {profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="db-ortu-content">
                    {/* Alert Banner */}
                    <div className="db-ortu-alert-banner" style={!isWarning && examScore > 0 ? { backgroundColor: '#f0fdf4', borderColor: '#dcfce3', color: '#166534' } : {}}>
                        <div className="db-ortu-alert-left">
                            <div className="db-ortu-alert-icon">
                                {!isWarning && examScore > 0 ? '✅' : '⚠️'}
                            </div>
                            <div className="db-ortu-alert-text">
                                <h3 className="db-ortu-alert-title" style={!isWarning && examScore > 0 ? { color: '#166534' } : {}}>
                                    {!isWarning && examScore > 0 ? 'Performa akademik sangat baik' : 'Perhatian diperlukan'} untuk {s.nama || 'anak Anda'}
                                </h3>
                                <p className="db-ortu-alert-desc" style={!isWarning && examScore > 0 ? { color: '#15803d' } : {}}>
                                    Exam Score: {examScore.toFixed(0)} &bull; Kehadiran: {avgAttendance}{avgAttendance !== '—' ? '%' : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/ortu/nilai')}
                            className="db-ortu-alert-btn"
                            style={!isWarning && examScore > 0 ? { color: '#166534', borderColor: '#166534' } : {}}
                        >
                            Lihat Rapor &rarr;
                        </button>
                    </div>

                    {/* 2 Metric Cards */}
                    <div className="db-ortu-stats-grid">
                        {/* Card 1: Rata-rata Nilai */}
                        <div className="db-ortu-stat-card">
                            <span className="db-ortu-stat-label">Exam Score</span>
                            <div className="db-ortu-stat-value">{loading ? '—' : examScore.toFixed(0)}</div>
                            <div className="db-ortu-stat-sub">
                                <span>{examScore < 75 ? '⚠️' : '📊'}</span> {s.exam_score ? 'Data dari database' : 'Estimasi rata-rata rapor'}
                            </div>
                        </div>

                        {/* Card 2: Kehadiran */}
                        <div className="db-ortu-stat-card">
                            <span className="db-ortu-stat-label">Kehadiran rata-rata</span>
                            <div className="db-ortu-stat-value">{loading ? '—' : (avgAttendance !== '—' ? `${avgAttendance}%` : '—')}</div>
                            <div className="db-ortu-stat-sub">
                                {avgAttendance !== '—' && parseInt(avgAttendance) < 85 ? 'Di bawah standar 85%' : 'Memenuhi standar'}
                            </div>
                        </div>
                    </div>

                    {/* 2 Kolom Layout */}
                    <div className="db-ortu-bottom-grid">
                        {/* KOLOM KIRI */}
                        <section className="db-ortu-card">
                            <div className="db-ortu-card-header">
                                <h3 className="db-ortu-card-title">Nilai per mata pelajaran</h3>
                                <span className="db-ortu-semester-badge">Sem. 5</span>
                            </div>

                            <div className="db-ortu-subject-list">
                                {subjects.map((sub, i) => (
                                    <div key={i} className="db-ortu-subject-row">
                                        <span className="db-ortu-subject-name">{sub.name}</span>
                                        <div className="db-ortu-progress-track">
                                            <div
                                                className="db-ortu-progress-fill"
                                                style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                                            />
                                        </div>
                                        <span className="db-ortu-progress-score">{sub.score}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="db-ortu-kkm-note">
                                KKM: 75 &bull; Data dari database
                            </div>
                        </section>

                        {/* KOLOM KANAN */}
                        <div className="db-ortu-right-stack">
                            <section className="db-ortu-card">
                                <h3 className="db-ortu-card-title">Sesi konseling terjadwal</h3>
                                <div className="db-ortu-list-rows">
                                    <div className="db-ortu-list-row">
                                        <span className="db-ortu-list-label">Tanggal</span>
                                        <span className="db-ortu-list-val">5 Mei 2026</span>
                                    </div>
                                    <div className="db-ortu-list-row">
                                        <span className="db-ortu-list-label">Topik</span>
                                        <span className="db-ortu-list-val">Motivasi & kehadiran</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="db-ortu-teal-badge">
                                        Terjadwal
                                    </span>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardOrtu_Page;
