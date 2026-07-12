const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'PrediksiSnbp_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldLogic = /const examScore = s\.exam_score \|\| 0;[\s\S]*?\]\.filter\(sub => sub\.score > 0\);/;
const newLogic = `const subjectsRaw = [
        { name: 'Matematika', score: s.math_score || 0, color: (s.math_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Bahasa Indonesia', score: s.indo_score || 0, color: (s.indo_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Biologi', score: s.bio_score || 0, color: (s.bio_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Kimia', score: s.chem_score || 0, color: (s.chem_score || 0) < 75 ? '#A32D2D' : '#16a34a' },
        { name: 'Fisika', score: s.phy_score || 0, color: (s.phy_score || 0) < 75 ? '#ff9f1c' : '#16a34a' },
    ];
    const subjects = subjectsRaw.filter(sub => sub.score > 0);

    const avgRapor = subjects.length > 0 
        ? subjects.reduce((acc, curr) => acc + curr.score, 0) / subjects.length 
        : 0;

    const examScore = s.exam_score ? s.exam_score : avgRapor;
    const avgAttendance = s.attendance_w1 != null
        ? (((s.attendance_w1 || 0) + (s.attendance_w2 || 0) + (s.attendance_w3 || 0) + (s.attendance_w4 || 0)) / 4).toFixed(0)
        : (subjects.length > 0 ? 100 : '—');`;

if (content.match(/const examScore = s\.exam_score \|\| 0;/)) {
    content = content.replace(oldLogic, newLogic);
    console.log('Fixed PrediksiSnbp_Page.jsx examScore logic');
} else {
    console.log('Logic not found in PrediksiSnbp_Page.jsx');
}

fs.writeFileSync(filePath, content, 'utf8');
