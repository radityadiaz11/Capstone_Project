import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrediksiSnbp_Page.css';
import api from '../../api/axios';

function PrediksiSnbp_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => navigate('/');

    const [student, setStudent] = useState(null);
    const [profile, setProfile] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [narasi, setNarasi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resProfile = await api.get('/users/profile');
                if (resProfile.data.success) setProfile(resProfile.data.data);

                const res = await api.get('/students');
                if (res.data.success && res.data.data.length > 0) {
                    setStudent(res.data.data[0]);
                    // Auto predict
                    try {
                        const predRes = await api.post('/predict', { student_id: res.data.data[0].student_id });
                        if (predRes.data.success) setPrediction(predRes.data.data);
                    } catch (e) { console.log('Predict error:', e); }
                    try {
                        const narasiRes = await api.post('/predict/narasi', { student_id: res.data.data[0].student_id, role: 'ortu' });
                        if (narasiRes.data.success) setNarasi(narasiRes.data.data);
                    } catch (e) { console.log('Narasi error:', e); }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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
    ];
    const subjects = subjectsRaw.filter(sub => sub.score > 0);

    const avgRapor = subjects.length > 0 
        ? subjects.reduce((acc, curr) => acc + curr.score, 0) / subjects.length 
        : 0;

    const examScore = s.exam_score ? s.exam_score : avgRapor;
    const avgAttendance = s.attendance_w1 != null
        ? (((s.attendance_w1 || 0) + (s.attendance_w2 || 0) + (s.attendance_w3 || 0) + (s.attendance_w4 || 0)) / 4).toFixed(0)
        : (subjects.length > 0 ? 100 : '—');

    // Rekomendasi from AI narasi or fallback
    const actions = narasi ? [
        { dot: 'blue', label: narasi.narasi, sub: narasi.is_ai ? 'Dari AI' : 'Rekomendasi Umum', subType: narasi.is_ai ? 'info' : 'warn' }
    ] : [
        { dot: 'blue', label: 'Tingkatkan kehadiran — target minimal 90% bulan depan', sub: 'Segera', subType: 'urgent' },
        { dot: 'orange', label: 'Bimbel Matematika & Kimia — nilai perlu naik di atas KKM 75', sub: 'Minggu ini', subType: 'warn' },
        { dot: 'teal', label: 'Daftar ekstrakurikuler — menambah poin non-akademik', sub: 'Bulan ini', subType: 'info' },
    ];

    // Prediction percentage - use prediction from AI or calculate from score
    const pct = prediction ? Math.min(Math.round(prediction.prediksi_nilai || 0), 100) : Math.round(examScore * 1.1);
    const CIRC = 289;
    const offset = CIRC * (1 - pct / 100);
    const riskStatus = prediction?.level_risiko || (examScore < 20 ? 'tinggi' : examScore < 40 ? 'sedang' : 'rendah');
    const statusLabel = riskStatus === 'tinggi' ? 'Berisiko' : riskStatus === 'sedang' ? 'Perhatian' : 'Aman';

    return (
        <div className="ps-container">

            {/* --- MOBILE HEADER --- */}
            <div className="ps-mobile-header">
                <div className="ps-mobile-brand">
                    <span className="ps-mobile-brand-title">SNBP Monitor</span>
                    <span className="ps-mobile-brand-sub">Sistem Cerdas Kesiapan Siswa</span>
                </div>
                <button
                    className="ps-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(v => !v)}
                    aria-label="Toggle Menu"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        {isMobileMenuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <aside className={`ps-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div>
                    <div className="ps-brand">
                        <h1 className="ps-brand-title">SNBP Monitor</h1>
                        <p className="ps-brand-sub">Sistem Cerdas Kesiapan Siswa</p>
                    </div>

                    <div className="ps-role-badge">
                        <span className="ps-role-dot"></span>
                        <span>Orang Tua</span>
                    </div>

                    <nav className="ps-nav">
                        <span className="ps-nav-label">Menu</span>

                        <button
                            className="ps-nav-item"
                            onClick={() => { navigate('/ortu/dashboard'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="ps-nav-icon">⊞</span>
                            <span>Beranda</span>
                        </button>

                        <button
                            className="ps-nav-item"
                            onClick={() => { navigate('/ortu/nilai'); setIsMobileMenuOpen(false); }}
                        >
                            <span className="ps-nav-icon">≡</span>
                            <span>Nilai Rapor</span>
                        </button>

                        <button
                            className="ps-nav-item active"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="ps-nav-icon">◎</span>
                            <span>Prediksi SNBP</span>
                        </button>
                    </nav>
                </div>

                <div className="ps-sidebar-bottom">
                    <button
                        className="ps-nav-item"
                        onClick={() => { navigate('/ortu/notifikasi'); setIsMobileMenuOpen(false); }}
                    >
                        <span className="ps-nav-icon">🔔</span>
                        <span>Notifikasi</span>
                        <span className="ps-notif-badge">2</span>
                    </button>

                    <button
                        className="ps-nav-item"
                        onClick={() => { navigate('/ortu/pengaturan'); setIsMobileMenuOpen(false); }}
                    >
                        <span className="ps-nav-icon">⚙</span>
                        <span>Pengaturan</span>
                    </button>

                    <button className="ps-nav-item ps-nav-logout" onClick={handleLogout}>
                        <span className="ps-nav-icon">⏻</span>
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="ps-main">

                {/* Sticky Topbar */}
                <header className="ps-topbar">
                    <div className="ps-page-info">
                        <h2 className="ps-page-title">Prediksi SNBP</h2>
                        <p className="ps-page-sub">Estimasi peluang lolos SNBP {s.nama || ''}</p>
                    </div>
                    <div className="ps-profile-info">
                        <div className="ps-profile-text">
                            <span className="ps-profile-name">{profile.nama || 'ORANG TUA'}</span>
                            <span className="ps-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
                        </div>
                        <div className="ps-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}</div>
                    </div>
                </header>

                {/* Content */}
                <main className="ps-content">
                    <div className="ps-grid">

                        {/* ===== KIRI: Kolom Prediksi & Performa ===== */}
                        <div className="ps-left-col">

                            {/* Card 1: Prediksi & Evaluasi */}
                            <section className="ps-card">

                                {/* Gauge + Status */}
                                <div className="ps-gauge-row">

                                    {/* SVG Donut */}
                                    <div className="ps-donut-wrap">
                                        <svg className="ps-donut-svg" viewBox="0 0 120 120">
                                            <circle className="ps-donut-bg" cx="60" cy="60" r="46" />
                                            <circle
                                                className="ps-donut-fill"
                                                cx="60" cy="60" r="46"
                                                strokeDasharray={CIRC}
                                                strokeDashoffset={offset}
                                            />
                                        </svg>
                                        <div className="ps-donut-label">
                                            <span className="ps-donut-pct">{pct}%</span>
                                            <span className="ps-donut-text">peluang lolos</span>
                                        </div>
                                    </div>

                                    {/* Status Text */}
                                    <div className="ps-status-block">
                                        <h3 className="ps-status-title">Status: {statusLabel}</h3>
                                        <p className="ps-status-desc">
                                            {prediction && !prediction.is_simulated
                                                ? 'Prediksi AI berdasarkan data dari database dan model machine learning.'
                                                : 'Estimasi berdasarkan data akademik dari database.'}
                                        </p>
                                        <div className="ps-status-tags">
                                            {prediction && !prediction.is_simulated && (
                                                <span className="ps-tag" style={{ background: '#eff6ff', color: '#1d4ed8' }}>✨ Powered by AI</span>
                                            )}
                                            {examScore < 40 && <span className="ps-tag red">Nilai rendah</span>}
                                            {parseInt(avgAttendance) < 85 && <span className="ps-tag red">Kehadiran rendah</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="ps-divider"></div>

                                {/* Faktor Performa Evaluasi */}
                                <div className="ps-factors-section">
                                    <h4 className="ps-factors-title">Faktor Evaluasi Performa</h4>
                                    <div className="ps-factor-list">
                                        <div className="ps-factor-row">
                                            <span className="ps-factor-name">Exam Score</span>
                                            <span className={`ps-factor-val ${examScore < 40 ? 'red' : ''}`}>{examScore.toFixed(0)}</span>
                                        </div>
                                        <div className="ps-factor-row">
                                            <span className="ps-factor-name">Kehadiran Kelas</span>
                                            <span className={`ps-factor-val ${parseInt(avgAttendance) < 85 ? 'red' : ''}`}>{avgAttendance}%</span>
                                        </div>
                                        <div className="ps-factor-row">
                                            <span className="ps-factor-name">Jam Belajar</span>
                                            <span className="ps-factor-val">{s.study_hours || '—'} jam/hari</span>
                                        </div>
                                        <div className="ps-factor-row">
                                            <span className="ps-factor-name">Pilihan Prodi</span>
                                            <span className="ps-factor-val">{s.prodi || '—'}</span>
                                        </div>
                                    </div>
                                </div>

                            </section>

                            {/* Card 2: Detail Nilai Rapor */}
                            <section className="ps-card">
                                <div className="ps-card-header">
                                    <h3 className="ps-card-title">Nilai Rapor per Mata Pelajaran</h3>
                                    <span className="ps-semester-badge">Semester 5</span>
                                </div>

                                <div className="ps-subject-list">
                                    {subjects.map((sub) => (
                                        <div key={sub.name} className="ps-subject-row">
                                            <span className="ps-subject-name">{sub.name}</span>
                                            <div className="ps-progress-track">
                                                <div
                                                    className="ps-progress-fill"
                                                    style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                                                />
                                            </div>
                                            <span className="ps-progress-score">{sub.score}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="ps-kkm-note">
                                    * Catatan: Status berisiko ditentukan dari penurunan nilai dibandingkan dengan semester sebelumnya (Semester 4), bukan berdasarkan KKM.
                                </div>
                            </section>
                        </div>

                        {/* ===== KANAN: Aksi Card ===== */}
                        <section className="ps-card">
                            <div className="ps-action-title">Yang bisa dilakukan sekarang</div>
                            <div className="ps-action-list">
                                {actions.map((a, i) => (
                                    <div key={i} className="ps-action-item">
                                        <span className={`ps-action-dot ${a.dot}`}></span>
                                        <div className="ps-action-body">
                                            <span className="ps-action-label">{a.label}</span>
                                            <span className={`ps-action-sub ${a.subType}`}>{a.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </main>
            </div>

        </div>
    );
}

export default PrediksiSnbp_Page;
