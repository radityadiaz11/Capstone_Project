const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'pages', 'guru');
const targetFiles = [
    'TambahSiswaGuru_Page.jsx',
    'PrediksiSiswa_Page.jsx',
    'MonitoringKelas_Page.jsx',
    'DetailSiswa_Page.jsx',
    'DataNilai_Page.jsx'
];

targetFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add profile={profile} to <Topbar
    content = content.replace(/<Topbar /g, '<Topbar profile={profile} ');
    
    // Find the main functional component definition (e.g. function DataNilai_Page() {)
    const compName = file.replace('.jsx', '');
    const funcRegex = new RegExp(`(function ${compName}\\(.*?\\)\\s*\\{)`);
    
    if (content.match(funcRegex) && !content.includes('const [profile')) {
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
        content = content.replace(funcRegex, `$1${stateAndEffect}`);
    }

    // Fix missing React import if needed
    if (content.includes('React.useState') && !content.includes('import React')) {
        content = "import React from 'react';\n" + content;
    }
    // Fix missing api import if needed
    if (content.includes('api.get') && !content.includes('import api from')) {
        content = "import api from '../../api/axios';\n" + content;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
});
