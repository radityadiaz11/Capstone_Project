const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'PengaturanAdmin_Page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace pga-profile-head block
const oldProfileHead = /<div className="pga-profile-head">[\s\S]*?<\/div>\s*<\/div>/;
const newProfileHead = `<div className="pga-profile-head">
                                <div className="pga-avatar-lg">{profile.nama ? profile.nama.substring(0, 2).toUpperCase() : 'AD'}</div>
                                <div>
                                    <p className="pga-profile-name">{profile.nama || 'ADMIN'}</p>
                                    <p className="pga-profile-role">Kepala Sekolah · Administrator</p>
                                </div>
                            </div>`;
content = content.replace(oldProfileHead, newProfileHead);

// Replace Info Rows (Email and Password)
const oldInfoRows = /<div className="pga-info-row" style=\{isEditing \? \{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' \} : \{\}\}>[\s\S]*?<\/div>\s*\}\)/;
const newInfoRows = `<div className="pga-info-row">
                                    <span className="pga-info-label">Email</span>
                                    <span className="pga-info-val pga-val-link">{profile.email || 'admin@sman1yk.sch.id'}</span>
                                </div>`;
content = content.replace(oldInfoRows, newInfoRows);

// Replace Edit Button block
const oldEditButton = /<div style=\{\{ display: 'flex', gap: '8px', marginTop: '16px' \}\}>[\s\S]*?<\/button>\s*\}\)\s*<\/div>/;
const newEditButton = `<div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button
                                    className="pga-edit-btn"
                                    onClick={() => { setEditForm({ ...profile, password: '' }); setIsEditing(true); }}
                                    style={{ flex: 1 }}
                                >
                                    Edit profil
                                </button>
                            </div>`;
content = content.replace(oldEditButton, newEditButton);

// Add Modal block before the final closing div
const modalBlock = `
            {/* Modal Edit Profil */}
            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Edit Profil</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Nama</label>
                                <input type="text" value={editForm.nama || ''} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Email</label>
                                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Password Baru (Opsional)</label>
                                <input type="password" value={editForm.password || ''} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="Kosongkan jika tidak ingin diubah" style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setIsEditing(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                            <button onClick={handleSaveProfile} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}
`;

content = content.replace("        </div>\n    );\n}", `        </div>\n${modalBlock}\n    );\n}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed PengaturanAdmin_Page.jsx modal layout');
