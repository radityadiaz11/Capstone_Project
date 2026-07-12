const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'DashboardOrtu_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Add profile state and fetch
if (!content.includes('const [profile, setProfile]')) {
    content = content.replace(/const \[student, setStudent\] = useState\(null\);/, `const [student, setStudent] = useState(null);\n    const [profile, setProfile] = useState({});`);
}
if (!content.includes('/users/profile')) {
    content = content.replace(/setStudent\(res\.data\.data\[0\]\);\s*\}/, `setStudent(res.data.data[0]);\n                }\n                const resProfile = await api.get('/users/profile');\n                if (resProfile.data.success) setProfile(resProfile.data.data);`);
}

// Fix 2: Defaults and Navbar Formatting
content = content.replace(/'ADMIN'/g, "'ORANG TUA'");
content = content.replace(/'AD'/g, "'OT'");

// Replace the navbar role line
content = content.replace(/<span className="db-ortu-profile-name">\{profile\.nama\}<\/span>/, `<span className="db-ortu-profile-name">{profile.nama || 'ORANG TUA'}</span>`);
content = content.replace(/<span className="db-ortu-profile-role">Orang Tua \{s\.nama \|\| 'siswa'\}<\/span>/, `<span className="db-ortu-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>`);

// Fix 3: Fix examScore and alert
const oldVariables = /const examScore = s\.exam_score \|\| 0;[\s\S]*?\]\.filter\(sub => sub\.score > 0\);/;
const newVariables = `const subjectsRaw = [
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

    const isWarning = (examScore > 0 && examScore < 75) || (avgAttendance !== '—' && avgAttendance < 85);`;
if (content.match(/const examScore = s\.exam_score \|\| 0;/)) {
    content = content.replace(oldVariables, newVariables);
}

// Fix 4: Fix alert banner HTML
const oldAlert = /{([^}]*)} Alert Banner Merah - #A32D2D {([^}]*)}\s*<div className="db-ortu-alert-banner">[\s\S]*?Lihat Rapor &rarr;\s*<\/button>\s*<\/div>/;
const newAlert = `{/* Alert Banner */}
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
                    </div>`;
if (content.match(oldAlert)) {
    content = content.replace(oldAlert, newAlert);
} else {
    console.log("Could not find alert banner to replace");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed DashboardOrtu_Page.jsx');
