const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'NilaiRapor_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldVariables = /const examScore = s\.exam_score \|\| 0;[\s\S]*?\]\.filter\(g => g\.score > 0\);/;
const newVariables = `const gradesRaw = [
    { subject: 'Matematika', score: s.math_score || 0, prevScore: Math.round((s.math_score || 0) * 1.05), status: (s.math_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Bahasa Indonesia', score: s.indo_score || 0, prevScore: Math.round((s.indo_score || 0) * 1.02), status: (s.indo_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Biologi', score: s.bio_score || 0, prevScore: Math.round((s.bio_score || 0) * 0.95), status: (s.bio_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Kimia', score: s.chem_score || 0, prevScore: Math.round((s.chem_score || 0) * 1.1), status: (s.chem_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Fisika', score: s.phy_score || 0, prevScore: Math.round((s.phy_score || 0) * 1.08), status: (s.phy_score || 0) < 75 ? 'Berisiko' : 'Aman' },
    { subject: 'Bahasa Inggris', score: s.eng_score || 0, prevScore: Math.round((s.eng_score || 0) * 0.98), status: (s.eng_score || 0) < 75 ? 'Berisiko' : 'Aman' },
  ];
  const grades = gradesRaw.filter(g => g.score > 0);

  const avgRapor = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length 
      : 0;

  const examScore = s.exam_score ? s.exam_score : avgRapor;

  // Rata-rata semester lalu (mock logic based on current score to show trend)
  const prevScore = (examScore * 1.1).toFixed(0);`;

if (content.match(/const examScore = s\.exam_score \|\| 0;/)) {
    content = content.replace(oldVariables, newVariables);
}

// Fix trend text
const oldTrend = /Tren nilai terus menurun — segera ambil tindakan/g;
const newTrend = `{examScore >= 75 ? 'Tren nilai terus membaik — pertahankan performa' : 'Tren nilai terus menurun — segera ambil tindakan'}`;
if (content.match(oldTrend)) {
    content = content.replace(oldTrend, newTrend);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed NilaiRapor_Page.jsx');
