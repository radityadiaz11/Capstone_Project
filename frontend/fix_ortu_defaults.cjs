const fs = require('fs');
const path = require('path');

const ortuDir = path.join(__dirname, 'src', 'pages', 'ortu');
const files = fs.readdirSync(ortuDir).filter(f => f.endsWith('_Page.jsx'));

for (const file of files) {
    const filePath = path.join(ortuDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace 'ADMIN' with 'ORANG TUA'
    content = content.replace(/'ADMIN'/g, "'ORANG TUA'");
    
    // Replace 'AD' with 'OT'
    content = content.replace(/'AD'/g, "'OT'");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated defaults in ${file}`);
}
