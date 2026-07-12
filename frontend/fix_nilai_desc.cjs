const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'NilaiRapor_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const brokenLine = /{examScore < 60 \? '\{examScore >= 75 \? 'Tren nilai terus membaik — pertahankan performa' : 'Tren nilai terus menurun — segera ambil tindakan'\}' : 'Performa stabil\/meningkat — pertahankan!'}/;
const fixedLine = `{examScore >= 75 ? 'Tren nilai terus membaik — pertahankan performa' : (examScore < 60 ? 'Tren nilai terus menurun — segera ambil tindakan' : 'Performa stabil/meningkat — pertahankan!')}`;

if (content.includes("Tren nilai terus membaik")) {
    // If we can't do exact match due to regex escapes, we can just replace the whole chart desc block
    const chartDescBlock = /<div className="nr-chart-desc">[\s\S]*?<\/div>/;
    const newChartDescBlock = `<div className="nr-chart-desc">
                  {examScore >= 75 ? 'Tren nilai terus membaik — pertahankan performa' : (examScore < 60 ? 'Tren nilai terus menurun — segera ambil tindakan' : 'Performa stabil/meningkat — pertahankan!')}
                </div>`;
    content = content.replace(chartDescBlock, newChartDescBlock);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed chart desc in NilaiRapor_Page.jsx');
