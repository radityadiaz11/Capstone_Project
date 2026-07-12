const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'NotifikasiAdmin_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import api from')) {
    content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';\nimport api from '../../api/axios';");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed NotifikasiAdmin_Page.jsx imports');
