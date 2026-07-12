const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'pages', 'guru');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Only process if it uses profile={profile} but doesn't have the state
    if (content.includes('profile={profile}') && !content.includes('const [profile, setProfile] =')) {
        // Find the main component function or const
        const compName = file.replace('.jsx', '');
        let targetRegex;
        if (content.includes(`const ${compName} = () => {`)) {
            targetRegex = new RegExp(`(const ${compName} = \\(\\) => \\{\n)`);
        } else if (content.includes(`function ${compName}() {`)) {
            targetRegex = new RegExp(`(function ${compName}\\(\\) \\{\n)`);
        } else if (content.includes(`export default function ${compName}() {`)) {
            targetRegex = new RegExp(`(export default function ${compName}\\(\\) \\{\n)`);
        } else {
            console.log(`Could not find signature for ${file}`);
            return;
        }

        const stateAndEffect = `  const [profile, setProfile] = React.useState({});
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);\n`;

        content = content.replace(targetRegex, `$1${stateAndEffect}`);

        if (content.includes('React.useState') && !content.includes('import React')) {
            content = "import React from 'react';\n" + content;
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed state in ${file}`);
    }
});
