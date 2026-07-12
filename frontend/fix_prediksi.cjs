const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'PrediksiSnbp_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add profile state if missing
if (!content.includes('const [profile, setProfile] = useState({});')) {
    content = content.replace(/const \[student, setStudent\] = useState\(null\);/, `const [student, setStudent] = useState(null);\n    const [profile, setProfile] = useState({});`);
}

// 2. Add profile fetch inside fetchData
if (!content.includes('/users/profile')) {
    content = content.replace(/const res = await api\.get\('\/students'\);/, `const resProfile = await api.get('/users/profile');\n                if (resProfile.data.success) setProfile(resProfile.data.data);\n\n                const res = await api.get('/students');`);
}

// 3. Fix navbar formatting
const oldNavbar = /<div className="ps-profile-text">[\s\S]*?<\/div>\s*<div className="ps-avatar">[\s\S]*?<\/div>/;
const newNavbar = `<div className="ps-profile-text">
                            <span className="ps-profile-name">{profile.nama || 'ORANG TUA'}</span>
                            <span className="ps-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
                        </div>
                        <div className="ps-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'OT'}</div>`;

if (content.match(oldNavbar)) {
    content = content.replace(oldNavbar, newNavbar);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed PrediksiSnbp_Page.jsx');
