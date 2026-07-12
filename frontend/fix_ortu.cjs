const fs = require('fs');
const path = require('path');

const ortuDir = path.join(__dirname, 'src', 'pages', 'ortu');
const files = fs.readdirSync(ortuDir).filter(f => f.endsWith('_Page.jsx') && f !== 'PengaturanOrtu_Page.jsx' && f !== 'DashboardOrtu_Page.jsx');

for (const file of files) {
    const filePath = path.join(ortuDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Inject profile state
    if (!content.includes('const [profile, setProfile] = useState({});')) {
        content = content.replace(/const \[student, setStudent\] = useState\(null\);/, `const [student, setStudent] = useState(null);\n  const [profile, setProfile] = useState({});`);
    }

    // Inject profile fetch if missing
    if (!content.includes('/users/profile')) {
        content = content.replace(/setStudent\(res\.data\.data\[0\]\);\s*\}/, `setStudent(res.data.data[0]);\n        }\n        const resProfile = await api.get('/users/profile');\n        if (resProfile.data.success) {\n          setProfile(resProfile.data.data);\n        }`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
