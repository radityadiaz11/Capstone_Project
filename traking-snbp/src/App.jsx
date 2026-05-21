import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrediksiSiswa_Page from './pages/PrediksiSiswa_Page';
import DetailSiswa_Page from './pages/DetailSiswa_Page';
import DataNilai_Page from './pages/DataNilai_Page';
import MonitoringKelas_Page from './pages/MonitoringKelas_Page';
import StatistikSNBP_Page from './pages/StatistikSNBP_Page';
import EksporData_Page from './pages/EksporData_Page';
import Notifikasi_Page from './pages/Notifikasi_Page';
import Pengaturan_Page from './pages/Pengaturan_Page';

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
    </Routes>
  );
}

export default App

