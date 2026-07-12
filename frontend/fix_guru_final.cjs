const fs = require('fs');

const files = [
    'd:/DICODING/Capstone/snbpredict/frontend/src/pages/guru/DataNilai_Page.jsx',
    'd:/DICODING/Capstone/snbpredict/frontend/src/pages/guru/DetailSiswa_Page.jsx',
    'd:/DICODING/Capstone/snbpredict/frontend/src/pages/guru/PrediksiSiswa_Page.jsx',
    'd:/DICODING/Capstone/snbpredict/frontend/src/pages/guru/TambahSiswaGuru_Page.jsx'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        if (!content.includes('const [profile, setProfile] =')) {
            const stateString = `
  const [profile, setProfile] = React.useState({});
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);
`;
            
            // Just insert it right after "const navigate = useNavigate();"
            content = content.replace(/(const navigate = useNavigate\(\);)/, `$1${stateString}`);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed ${file}`);
        } else {
            console.log(`Already fixed ${file}`);
        }
    } catch (err) {
        console.error(err);
    }
});
