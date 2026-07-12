const fs = require('fs');

const path = 'src/pages/admin/PengaturanAdmin_Page.jsx';
let content = fs.readFileSync(path, 'utf8');

// The file currently starts with "    };\n\n    const handleLogout = () => {"
// Let's replace the first line.
const toPrepend = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './PengaturanAdmin_Page.css';

function PengaturanAdmin_Page() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({ nama: "ADMIN", email: 'admin@sman1yk.sch.id', role: 'admin' });
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.success) setProfile(res.data.data);
            } catch (err) { console.error('Gagal memuat profil', err); }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        try {
            await api.put('/users/profile', editForm);
            setProfile(editForm);
            setIsEditing(false);
            alert('Profil berhasil diperbarui');
        } catch (err) {
            alert('Gagal memperbarui profil');
        }
`;

content = content.replace(/^\s*\};\s*/, toPrepend);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed PengaturanAdmin_Page.jsx");
