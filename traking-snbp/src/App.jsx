import { Routes, Route } from 'react-router-dom';
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
import PesanGuru_Page from './pages/ortu/PesanGuru_Page';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/prediksi-siswa" element={<PrediksiSiswa_Page />} />
      <Route path="/detail-siswa" element={<DetailSiswa_Page />} />
      <Route path="/data-nilai" element={<DataNilai_Page />} />
      <Route path="/monitoring-kelas" element={<MonitoringKelas_Page />} />
      <Route path="/statistik-snbp" element={<StatistikSNBP_Page />} />
      <Route path="/ekspor-data" element={<EksporData_Page />} />
      <Route path="/notifikasi" element={<Notifikasi_Page />} />
      <Route path="/pengaturan" element={<Pengaturan_Page />} />
      <Route path="/ortu/dashboard" element={<DashboardOrtu_Page />} />
      <Route path="/ortu/nilai" element={<NilaiRapor_Page />} />
      <Route path="/ortu/prediksi-snbp" element={<PrediksiSnbp_Page />} />
      <Route path="/ortu/pesan-guru" element={<PesanGuru_Page />} />

    </Routes>
  );
}

export default App


