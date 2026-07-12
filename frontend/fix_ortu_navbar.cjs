const fs = require('fs');
const path = require('path');

const ortuDir = path.join(__dirname, 'src', 'pages', 'ortu');
const files = fs.readdirSync(ortuDir).filter(f => f.endsWith('_Page.jsx'));

for (const file of files) {
    const filePath = path.join(ortuDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Ensure `s` is defined if `student` exists.
    if (content.includes('const [student') && !content.includes('const s = student')) {
        content = content.replace(/return \(/, `const s = student || {};\n  return (`);
    }

    // 2. What if student doesn't exist? (PengaturanOrtu_Page doesn't fetch student).
    // Let's inject student state and fetch into PengaturanOrtu_Page.
    if (file === 'PengaturanOrtu_Page.jsx' && !content.includes('const [student')) {
        content = content.replace(/const \[profile, setProfile\] = useState\(\{.*\}\);/, `const [profile, setProfile] = useState({ nama: 'Bapak Hidayat', email: 'hidayat.nugroho@gmail.com', role: 'ortu' });\n  const [student, setStudent] = useState(null);\n  const s = student || {};`);
        
        // Add student fetch
        content = content.replace(/const res = await api\.get\('\/users\/profile'\);/, `const res = await api.get('/users/profile');\n        const resStud = await api.get('/students');\n        if (resStud.data.success && resStud.data.data.length > 0) setStudent(resStud.data.data[0]);`);
    }

    // 3. Fix the HTML. Replace {s.nama || 'siswa'} or {s.nama || ''} safely
    // Or just let it be, since we defined `s`.
    // Let's ensure avatar uses profile.nama
    // Replace hardcoded "OT" or "HN" or {profile.nama ? ... : 'OT'} with our standard.
    
    // Using a regex to fix avatar
    const prefixMatch = content.match(/className="(db-ortu|nr|no|po|ps)-avatar"/);
    if (prefixMatch) {
        const prefix = prefixMatch[1];
        const htmlRegex = new RegExp(`<div className="${prefix}-profile-text">[\\s\\S]*?<\\/div>\\s*<div className="${prefix}-avatar">[\\s\\S]*?<\\/div>`, 'g');
        
        content = content.replace(htmlRegex, `<div className="${prefix}-profile-text">
              <span className="${prefix}-profile-name">{profile.nama || 'ADMIN'}</span>
              <span className="${prefix}-profile-role">Orang Tua {s.nama || 'Siswa'}</span>
            </div>
            <div className="${prefix}-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'AD'}</div>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Standardized navbar for ${file}`);
}
