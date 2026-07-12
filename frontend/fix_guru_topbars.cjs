const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'pages', 'guru');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Add profile = {} to Topbar arguments if not present
    if (content.includes('function Topbar({')) {
        const topbarRegex = /function Topbar\(\{\s*(.*?)\s*\}\)/;
        const match = content.match(topbarRegex);
        if (match && !match[1].includes('profile')) {
            const newArgs = match[1] + ', profile = {}';
            content = content.replace(topbarRegex, `function Topbar({ ${newArgs} })`);
        }
    }

    // 2. Replace hardcoded profile block in Topbar
    const hardcodedBlockRegex = /<div className="db-profile-info"[\s\S]*?<\/div>\s*<div className="db-avatar">.*?<\/div>/;
    const dynamicBlock = `<div className="db-profile-info">
                    <span className="db-profile-name">{profile.nama || 'Ibu Sari'}</span>
                    <span className="db-profile-role">Wali Kelas {profile.mengampu_kelas || 'XII IPA 1'}</span>
                </div>
                <div className="db-avatar">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'SR'}</div>`;
    content = content.replace(hardcodedBlockRegex, dynamicBlock);

    // 3. Ensure profile state exists in the main component
    // First, find the main component name
    let mainCompMatch = content.match(/export default function ([A-Za-z0-9_]+)/);
    if (!mainCompMatch) {
        mainCompMatch = content.match(/function ([A-Za-z0-9_]+_Page)/);
    }
    if (!mainCompMatch) {
        mainCompMatch = content.match(/function DashboardPage/);
    }

    if (mainCompMatch) {
        const compName = mainCompMatch[1];
        
        // Add profile state and fetch effect if not present
        if (!content.includes('const [profile, setProfile] =')) {
            const compStartRegex = new RegExp(`(function ${compName}\\(.*?\\)\\s*\\{)`);
            const stateAndEffect = `\n    const [profile, setProfile] = React.useState({});
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.success) setProfile(res.data.data);
            } catch (err) {}
        };
        fetchProfile();
    }, []);\n`;
            content = content.replace(compStartRegex, `$1${stateAndEffect}`);
        }

        // Add profile={profile} to <Topbar
        const topbarCallRegex = /<Topbar([\s\S]*?)\/>/g;
        content = content.replace(topbarCallRegex, (match, p1) => {
            if (!p1.includes('profile={')) {
                return `<Topbar${p1} profile={profile} />`;
            }
            return match;
        });
    }

    // Fix imports if 'api' is missing but we just added a fetch
    if (content.includes('api.get(\'/users/profile\')') && !content.includes('import api from')) {
        content = content.replace("import React", "import React from 'react';\nimport api from '../../api/axios';\nimport ");
    }
    // Simple fix if React isn't imported but we used React.useState
    if (content.includes('React.useState') && !content.includes('import React')) {
        content = "import React from 'react';\n" + content;
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
