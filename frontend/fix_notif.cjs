const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ortu', 'NotifikasiOrtu_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix imports
if (!content.includes('import api')) {
    content = content.replace(/import \{ useState \} from 'react';/, `import React, { useState, useEffect } from 'react';`);
    content = content.replace(/import '\.\/NotifikasiOrtu_Page\.css';/, `import './NotifikasiOrtu_Page.css';\nimport api from '../../api/axios';`);
}

// 2. Add state and fetch inside the component, before handleLogout
if (!content.includes('const [profile, setProfile]')) {
    const fetchLogic = `
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState({});
  const s = student || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStud = await api.get('/students');
        if (resStud.data.success && resStud.data.data.length > 0) setStudent(resStud.data.data[0]);
        const resProf = await api.get('/users/profile');
        if (resProf.data.success) setProfile(resProf.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);
`;
    content = content.replace(/const handleLogout = \(\) => \{/, `${fetchLogic}\n  const handleLogout = () => {`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched NotifikasiOrtu_Page.jsx");
