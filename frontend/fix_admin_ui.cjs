const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('_Page.jsx'));

for (const file of files) {
    const filePath = path.join(adminDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`Processing ${file}...`);

    // 1. Replace the JSX Profile Info block
    const regexHtml = /<div className="([a-z\-]+)-profile-info">[\s\S]*?<\/div>\s*<\/header>/;
    content = content.replace(regexHtml, (match, prefix) => {
        return `<div className="${prefix}-profile-info">
                        <div className="${prefix}-profile-text">
                            <span className="${prefix}-profile-name">{user.nama || 'Bapak Hartono'}</span>
                            <span className="${prefix}-profile-role">{user.role || (user.role === 'admin' ? 'Administrator' : 'Kepala Sekolah')}</span>
                        </div>
                        <div className="${prefix}-avatar">{user.nama ? user.nama.substring(0, 2).toUpperCase() : 'HT'}</div>
                    </div>
                </header>`;
    });

    // 2. Ensure API logic is present for user fetching
    // If the file does NOT have useEffect for profile, inject it.
    // Dashboard and TambahSiswa already have it.
    
    // First, let's remove the localStorage user hack if it exists
    const hackRegex = /const user = \{\s*nama: localStorage\.getItem\('nama'\) \|\| 'Bapak Hartono',\s*role: localStorage\.getItem\('role'\) === 'admin' \? 'Administrator' : 'Kepala Sekolah'\s*\};\s*/g;
    content = content.replace(hackRegex, '');

    // Now, if it doesn't have `[user, setUser]`, and doesn't have `[profile, setProfile]`, inject it.
    if (!content.includes('[user, setUser]') && !content.includes('[profile, setProfile]')) {
        const stateInjection = `    const [user, setUser] = useState({ nama: 'Bapak Hartono', role: 'Kepala Sekolah' });

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
    }, []);\n\n`;

        content = content.replace(/(const navigate = useNavigate\(\);\n)/, `$1${stateInjection}`);
    }

    // Ensure api is imported if we just injected useEffect that uses api
    if (!content.includes("import api from '../../api/axios'") && content.includes('api.get')) {
        content = `import api from '../../api/axios';\n` + content;
    }

    // Alias profile to user if the file uses profile instead of user
    if (content.includes('[profile, setProfile]') && !content.includes('const user = profile;')) {
        content = content.replace(/return \(/, `const user = profile;\n\n    return (`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
