const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'NilaiRapor_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldTrendData = /const trendData = \[\s*\{\s*sem: 'Sem 1', value: Math\.min\(100, Math\.round\(examScore \* 1\.25\)\)\s*\},[\s\S]*?\];/;
const newTrendData = `const trendData = [
    { sem: 'Sem 1', value: Math.min(100, Math.round(examScore * 0.8)) },
    { sem: 'Sem 2', value: Math.min(100, Math.round(examScore * 0.85)) },
    { sem: 'Sem 3', value: Math.min(100, Math.round(examScore * 0.9)) },
    { sem: 'Sem 4', value: Math.min(100, Math.round(examScore * 0.95)) },
    { sem: 'Sem 5', value: Math.round(examScore) },
  ];`;

if (content.match(oldTrendData)) {
    content = content.replace(oldTrendData, newTrendData);
    console.log('Fixed trendData mock logic in NilaiRapor_Page.jsx');
} else {
    console.log('trendData mock logic not found');
}

fs.writeFileSync(filePath, content, 'utf8');
