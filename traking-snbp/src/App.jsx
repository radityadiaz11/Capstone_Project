import { Routes, Route } from 'react-router-dom';
import DashboardSekolah_Page from './pages/admin/DashboardSekolah_Page';
import RekapKelas_Page from './pages/admin/RekapKelas_Page';
import EksporData_Admin_Page from './pages/admin/EksporData_Page';
import NotifikasiAdmin_Page from './pages/admin/NotifikasiAdmin_Page';
import PengaturanAdmin_Page from './pages/admin/PengaturanAdmin_Page';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/guru/DashboardPage';
import PrediksiSiswa_Page from './pages/guru/PrediksiSiswa_Page';
import DetailSiswa_Page from './pages/guru/DetailSiswa_Page';
import DataNilai_Page from './pages/guru/DataNilai_Page';
import MonitoringKelas_Page from './pages/guru/MonitoringKelas_Page';
import StatistikSNBP_Page from './pages/guru/StatistikSNBP_Page';
import EksporData_Page from './pages/guru/EksporData_Page';
import Notifikasi_Page from './pages/guru/Notifikasi_Page';
import Pengaturan_Page from './pages/guru/Pengaturan_Page';

import DashboardOrtu_Page from './pages/ortu/DashboardOrtu_Page';
import NilaiRapor_Page from './pages/ortu/NilaiRapor_Page';
import PrediksiSnbp_Page from './pages/ortu/PrediksiSnbp_Page';
import NotifikasiOrtu_Page from './pages/ortu/NotifikasiOrtu_Page';
import PengaturanOrtu_Page from './pages/ortu/PengaturanOrtu_Page';
import StatistikAdmin_Page from './pages/admin/StatistikSNBP_Page';

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LoginPage />} />

      {/* Guru Role */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/prediksi-siswa" element={<PrediksiSiswa_Page />} />
      <Route path="/detail-siswa" element={<DetailSiswa_Page />} />
      <Route path="/data-nilai" element={<DataNilai_Page />} />
      <Route path="/monitoring-kelas" element={<MonitoringKelas_Page />} />
      <Route path="/statistik-snbp" element={<StatistikSNBP_Page />} />
      <Route path="/ekspor-data" element={<EksporData_Page />} />
      <Route path="/notifikasi" element={<Notifikasi_Page />} />
      <Route path="/pengaturan" element={<Pengaturan_Page />} />

      {/* Ortu Role */}
      <Route path="/ortu/dashboard" element={<DashboardOrtu_Page />} />
      <Route path="/ortu/nilai" element={<NilaiRapor_Page />} />
      <Route path="/ortu/prediksi-snbp" element={<PrediksiSnbp_Page />} />
      <Route path="/ortu/notifikasi" element={<NotifikasiOrtu_Page />} />
      <Route path="/ortu/pengaturan" element={<PengaturanOrtu_Page />} />

      {/* Admin / Kepsek Role */}
      <Route path="/admin/dashboard" element={<DashboardSekolah_Page />} />
      <Route path="/admin/rekap-kelas" element={<RekapKelas_Page />} />
      <Route path="/admin/ekspor" element={<EksporData_Admin_Page />} />
      <Route path="/admin/notifikasi" element={<NotifikasiAdmin_Page />} />
      <Route path="/admin/pengaturan" element={<PengaturanAdmin_Page />} />
      <Route path="/admin/statistik" element={<StatistikAdmin_Page />} />
    </Routes>
  );
}

export default App;

