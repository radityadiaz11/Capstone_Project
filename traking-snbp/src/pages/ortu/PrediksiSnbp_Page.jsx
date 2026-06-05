import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './PrediksiSnbp_Page.css';

function PrediksiSnbp_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => navigate('/');

    const [studentData, setStudentData] = useState(null);
    const [predictData, setPredictData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Hardcode ID 1 untuk sementara
                const [resStudent, resPredict] = await Promise.all([
                    api.get('/students/1'),
                    api.post('/predict', { student_id: 1 })
                ]);
                
                if (resStudent.data.success) {
                    setStudentData(resStudent.data.data);
                }
                if (resPredict.data.success) {
                    setPredictData(resPredict.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudentData();
    }, []);

    const st = studentData || {};
    const pd = predictData || { prediksi_nilai: 41, level_risiko: 'tinggi' };

    // Rekomendasi aksi dinamis berdasarkan data siswa
    const actions = [];
    if (st.sleep_hours < 7) {
        actions.push({ dot: 'blue', label: 'Perbaiki jam tidur, target minimal 7 jam per hari', sub: 'Kesehatan', subType: 'info' });
    }
    if (st.screen_time_hours > 8) {
        actions.push({ dot: 'orange', label: 'Kurangi durasi menatap layar untuk menjaga fokus belajar', sub: 'Fokus', subType: 'warn' });
    }
    if (st.mental_health_score < 70) {
        actions.push({ dot: 'red', label: 'Pertimbangkan sesi konseling atau refreshing sejenak', sub: 'Mental', subType: 'urgent' });
    }
    if (st.gaming_hours > 3) {
        actions.push({ dot: 'grey', label: 'Batasi bermain game maksimal 2 jam di hari sekolah', sub: 'Kedisiplinan', subType: 'neutral' });
    }
    if (actions.length === 0) {
        actions.push({ dot: 'teal', label: 'Pertahankan kebiasaan belajar dan pola hidup yang sudah baik', sub: 'Bagus', subType: 'info' });
    }

    const CIRC = 289;
    const pct = pd.prediksi_nilai ? Math.min(Math.round(pd.prediksi_nilai), 100) : 41;
    const offset = CIRC * (1 - pct / 100);

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
                        <p className="ps-page-sub">Estimasi peluang lolos SNBP Farhan Hidayat</p>
                    </div>
                    <div className="ps-profile-info">
                        <div className="ps-profile-text">
                            <span className="ps-profile-name">Bapak Hidayat</span>
                            <span className="ps-profile-role">Orang Tua Farhan</span>
                        </div>
                        <div className="ps-avatar">HN</div>
                    </div>
                </header>

                {/* Content */}
                <main className="ps-content">
                    <div className="ps-grid">

                        {/* ===== KIRI: Prediksi Card ===== */}
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
                                    <h3 className="ps-status-title">
                                        Status: {pd.level_risiko === 'tinggi' ? 'Sangat Berisiko' : pd.level_risiko === 'sedang' ? 'Perlu Perhatian' : 'Siap Lolos'}
                                    </h3>
                                    <p className="ps-status-desc">
                                        Prediksi AI berdasarkan nilai rapor semester 1–5, kehadiran, dan faktor akademik lainnya.
                                    </p>
                                    <div className="ps-status-tags">
                                        <span className={`ps-tag ${pd.level_risiko === 'rendah' ? 'green' : 'red'}`}>
                                            Risiko {pd.level_risiko}
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </section>

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
