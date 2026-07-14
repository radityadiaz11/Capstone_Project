const fs = require('fs');
const path = require('path');

const adminDir = 'd:/DICODING/Capstone_Project/frontend/src/pages/admin';
const files = fs.readdirSync(adminDir);

const regex = /[ \t]*<button[^>]*navigate\('\/admin\/statistik'\)[^>]*>[\s\S]*?<\/button>\r?\n/g;

for (const file of files) {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(adminDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = content.replace(regex, '');
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', file);
        }
    }
}
