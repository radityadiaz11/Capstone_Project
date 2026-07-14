import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardSekolah_Page from './pages/admin/DashboardSekolah_Page';
import RekapKelas_Page from './pages/admin/RekapKelas_Page';
import EksporData_Admin_Page from './pages/admin/EksporData_Page';
import NotifikasiAdmin_Page from './pages/admin/NotifikasiAdmin_Page';
import PengaturanAdmin_Page from './pages/admin/PengaturanAdmin_Page';
import TambahSiswaAdmin_Page from './pages/admin/TambahSiswaAdmin_Page';
import TambahRoleAdmin_Page from './pages/admin/TambahRoleAdmin_Page';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/guru/DashboardPage';
import PrediksiSiswa_Page from './pages/guru/PrediksiSiswa_Page';
import DetailSiswa_Page from './pages/guru/DetailSiswa_Page';
import DataNilai_Page from './pages/guru/DataNilai_Page';
import MonitoringKelas_Page from './pages/guru/MonitoringKelas_Page';
import EksporData_Page from './pages/guru/EksporData_Page';
import Notifikasi_Page from './pages/guru/Notifikasi_Page';
import Pengaturan_Page from './pages/guru/Pengaturan_Page';
import TambahSiswaGuru_Page from './pages/guru/TambahSiswaGuru_Page';

import DashboardOrtu_Page from './pages/ortu/DashboardOrtu_Page';
import NilaiRapor_Page from './pages/ortu/NilaiRapor_Page';
import PrediksiSnbp_Page from './pages/ortu/PrediksiSnbp_Page';
import NotifikasiOrtu_Page from './pages/ortu/NotifikasiOrtu_Page';
import PengaturanOrtu_Page from './pages/ortu/PengaturanOrtu_Page';

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LoginPage />} />

      {/* Guru Role */}
      <Route path="/guru/dashboard" element={<ProtectedRoute requiredRoles={['guru']}><DashboardPage /></ProtectedRoute>} />
      <Route path="/guru/prediksi-siswa" element={<ProtectedRoute requiredRoles={['guru']}><PrediksiSiswa_Page /></ProtectedRoute>} />
      <Route path="/guru/detail-siswa" element={<ProtectedRoute requiredRoles={['guru']}><DetailSiswa_Page /></ProtectedRoute>} />
      <Route path="/guru/data-nilai" element={<ProtectedRoute requiredRoles={['guru']}><DataNilai_Page /></ProtectedRoute>} />
      <Route path="/guru/monitoring-kelas" element={<ProtectedRoute requiredRoles={['guru']}><MonitoringKelas_Page /></ProtectedRoute>} />
      <Route path="/guru/ekspor-data" element={<ProtectedRoute requiredRoles={['guru']}><EksporData_Page /></ProtectedRoute>} />
      <Route path="/guru/notifikasi" element={<ProtectedRoute requiredRoles={['guru']}><Notifikasi_Page /></ProtectedRoute>} />
      <Route path="/guru/pengaturan" element={<ProtectedRoute requiredRoles={['guru']}><Pengaturan_Page /></ProtectedRoute>} />
      <Route path="/guru/tambah-siswa" element={<ProtectedRoute requiredRoles={['guru']}><TambahSiswaGuru_Page /></ProtectedRoute>} />

      {/* Ortu Role */}
      <Route path="/ortu/dashboard" element={<ProtectedRoute requiredRoles={['ortu']}><DashboardOrtu_Page /></ProtectedRoute>} />
      <Route path="/ortu/nilai" element={<ProtectedRoute requiredRoles={['ortu']}><NilaiRapor_Page /></ProtectedRoute>} />
      <Route path="/ortu/prediksi-snbp" element={<ProtectedRoute requiredRoles={['ortu']}><PrediksiSnbp_Page /></ProtectedRoute>} />
      <Route path="/ortu/notifikasi" element={<ProtectedRoute requiredRoles={['ortu']}><NotifikasiOrtu_Page /></ProtectedRoute>} />
      <Route path="/ortu/pengaturan" element={<ProtectedRoute requiredRoles={['ortu']}><PengaturanOrtu_Page /></ProtectedRoute>} />

      {/* Admin / Kepsek Role */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRoles={['admin']}><DashboardSekolah_Page /></ProtectedRoute>} />
      <Route path="/admin/rekap-kelas" element={<ProtectedRoute requiredRoles={['admin']}><RekapKelas_Page /></ProtectedRoute>} />
      <Route path="/admin/ekspor" element={<ProtectedRoute requiredRoles={['admin']}><EksporData_Admin_Page /></ProtectedRoute>} />
      <Route path="/admin/notifikasi" element={<ProtectedRoute requiredRoles={['admin']}><NotifikasiAdmin_Page /></ProtectedRoute>} />
      <Route path="/admin/pengaturan" element={<ProtectedRoute requiredRoles={['admin']}><PengaturanAdmin_Page /></ProtectedRoute>} />
      <Route path="/admin/tambah-siswa" element={<ProtectedRoute requiredRoles={['admin']}><TambahSiswaAdmin_Page /></ProtectedRoute>} />
      <Route path="/admin/tambah-role" element={<ProtectedRoute requiredRoles={['admin']}><TambahRoleAdmin_Page /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

