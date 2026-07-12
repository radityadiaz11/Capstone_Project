const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'NotifikasiOrtu_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file currently has literal backslashes before backticks and dollar signs: \` and \$
// I will replace `\\`` with '`' and `\\$` with '$'

content = content.replace(/\\\\`/g, '`');
content = content.replace(/\\\\\$/g, '$');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed backslashes in NotifikasiOrtu_Page.jsx");
