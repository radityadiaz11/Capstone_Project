const fs = require('fs');
const path = require('path');

const ortuDir = path.join(__dirname, 'src', 'pages', 'ortu');
const files = fs.readdirSync(ortuDir).filter(f => f.endsWith('_Page.jsx'));

for (const file of files) {
    const filePath = path.join(ortuDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace <span className="*-profile-role">Orang Tua {s.nama || 'Siswa'}</span>
    // with <span className="*-profile-role">{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}</span>
    content = content.replace(/(<span className="[a-zA-Z0-9_-]+-profile-role">)Orang Tua \{s\.nama \|\| 'Siswa'\}(<\/span>)/g, "$1{profile.role === 'ortu' ? 'Orang Tua' : (profile.role || 'Orang Tua')}$2");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated role format in ${file}`);
}
