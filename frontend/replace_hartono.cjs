const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('_Page.jsx'));

for (const file of files) {
    const filePath = path.join(adminDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace default names in state and JSX
    content = content.replace(/'Bapak Hartono'/g, "'ADMIN'");
    content = content.replace(/"Bapak Hartono"/g, '"ADMIN"');
    
    // Replace default avatar HT to AD
    content = content.replace(/:\s*'HT'\s*\}/g, ": 'AD'}");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced Hartono with ADMIN in ${file}`);
}
