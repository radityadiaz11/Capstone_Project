# SNBP Monitor: Sistem Cerdas Kesiapan Siswa

`SNBP Monitor` adalah platform berbasis web (Single Page Application) yang dirancang untuk melacak, memonitor, dan menganalisis kesiapan akademik siswa kelas XII dalam menghadapi Seleksi Nasional Berdasarkan Prestasi (SNBP). Platform ini memfasilitasi kolaborasi antara Admin Sekolah/Kepala Sekolah, Guru/Wali Kelas, dan Orang Tua untuk memastikan siswa mendapatkan bimbingan yang tepat guna memaksimalkan peluang kelulusan.

---

## 🚀 Fitur Utama

Aplikasi ini memiliki sistem otentikasi multi-peran dengan visualisasi dashboard yang responsif dan elegan:

### 1. 🔑 **Otentikasi Multi-Peran (Multi-Role Dashboard)**
* **Admin / Kepala Sekolah (Kepsek)**:
  * **Dashboard Sekolah**: Memantau statistik global kesiapan siswa di sekolah.
  * **Rekap Kelas**: Menganalisis tingkat kesiapan dan rata-rata nilai per kelas secara komprehensif.
  * **Statistik SNBP**: Menyajikan grafik tren sebaran kelulusan dan statistik pendaftaran SNBP sekolah.
  * **Ekspor Data**: Mengunduh rekapitulasi data akademik sekolah.
  * **Pusat Notifikasi & Pengaturan**: Mengelola notifikasi tingkat admin dan pengaturan profil sekolah.
* **Guru (Wali Kelas / BK)**:
  * **Dashboard Kelas**: Ringkasan jumlah siswa, persentase kesiapan, dan notifikasi penting kelas terkelola.
  * **Data Nilai**: Mengelola nilai rapor siswa per semester secara detail.
  * **Prediksi Siswa**: Memantau status kelulusan berdasarkan model prediksi (*On Track* vs *Berisiko*).
  * **Detail Siswa**: Melihat riwayat lengkap, grafik perkembangan nilai rata-rata, dan status kesiapan per individu.
  * **Monitoring Kelas**: Melacak progres nilai dan kehadiran siswa secara berkala.
  * **Statistik SNBP & Ekspor Data**: Menyajikan grafik pencapaian kelas dan mengekspor laporan ke format berkas eksternal.
* **Orang Tua (Ortu)**:
  * **Dashboard Orang Tua**: Ringkasan visual performa akademik anak dan status prediksi SNBP.
  * **Nilai Rapor**: Memantau grafik nilai anak per mata pelajaran tiap semester.
  * **Prediksi SNBP**: Memperoleh gambaran kelayakan anak disertai catatan bimbingan dari Wali Kelas.
  * **Notifikasi**: Menerima peringatan penting secara berkala (misal: jika anak terdeteksi memerlukan intervensi).

### 2. 📊 **Visualisasi Data & Indikator Kesiapan**
* Klasifikasi status kelayakan siswa (*On Track* atau *Berisiko*).
* Progress bar interaktif yang memetakan persentase kesiapan kelas.
* Skema antarmuka modern menggunakan CSS variabel dengan palet warna harmonis (biru profesional, hijau kesuksesan, dan merah peringatan risiko).

### 3. 🔌 **Integrasi API dengan JWT Interceptor**
* Dilengkapi dengan instance Axios kustom yang mendeteksi token JWT di `localStorage` dan secara otomatis menyisipkannya ke header `Authorization` pada setiap permintaan keluar.

---

## 🛠️ Tech Stack

* **Framework Utama**: [React 19](https://react.dev/)
* **Build Tool / Bundler**: [Vite 8](https://vite.dev/)
* **Routing**: [React Router DOM 7](https://reactrouter.com/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Styling**: Custom Vanilla CSS (Mengedepankan efisiensi performa, flexbox/grid layout, dan penggunaan CSS Variables)

---

## 📂 Struktur Folder Proyek

```text
traking-snbp/
├── public/                 # Aset statis publik (seperti favicon)
├── src/
│   ├── api/
│   │   └── axios.js        # Konfigurasi Axios instance & JWT interceptor
│   ├── assets/             # Aset gambar, logo, dan ilustrasi (hero.png, dll)
│   ├── pages/              # Kumpulan halaman berdasarkan peran pengguna
│   │   ├── admin/          # Halaman khusus Admin/Kepsek (Dashboard, Rekap Kelas, Ekspor, dll)
│   │   ├── auth/           # Halaman LoginPage
│   │   ├── guru/           # Halaman khusus Guru/Wali Kelas (Dashboard, Prediksi, Nilai, dll)
│   │   └── ortu/           # Halaman khusus Orang Tua (Dashboard, Nilai Rapor, Prediksi, dll)
│   ├── App.css             # Style umum aplikasi
│   ├── App.jsx             # Definisi rute navigasi utama (React Router DOM)
│   ├── index.css           # Styling dasar global & variabel warna CSS
│   └── main.jsx            # Entry point aplikasi React
├── eslint.config.js        # Konfigurasi Linter ESLint
├── package.json            # Informasi dependensi dan skrip proyek
└── vite.config.js          # Konfigurasi build tool Vite
```

---

## 🏁 Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18+ direkomendasikan) dan **npm** di komputer Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori root `traking-snbp` untuk memasang semua modul pustaka yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Backend URL
Buka berkas `src/api/axios.js` dan sesuaikan parameter `baseURL` dengan URL server backend Anda. Secara default, aplikasi dikonfigurasi ke:
```javascript
const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});
```

### 4. Jalankan Lingkungan Pengembangan (Development Server)
Jalankan perintah berikut untuk memulai server lokal:
```bash
npm run dev
```
Setelah berhasil berjalan, buka browser Anda dan akses tautan yang tertera (biasanya `http://localhost:5173`).

### 5. Build untuk Produksi
Untuk melakukan kompilasi kode siap rilis, jalankan:
```bash
npm run build
```
Hasil kompilasi akan tersimpan di dalam folder `dist/` dan siap dideploy ke server web statis.

---

## 🛡️ Otentikasi & Keamanan

Aplikasi mengamankan akses data dengan menyimpan token JWT di `localStorage` saat pengguna berhasil masuk. Setiap API request akan mengirimkan header berikut secara otomatis:
```text
Authorization: Bearer <token_jwt_anda>
```

---

## 👥 Kontributor

Proyek ini dikembangkan sebagai bagian dari **Capstone Project** untuk menyediakan solusi pemantauan prestasi akademik dan peningkatan kesiapan kelulusan SNBP bagi siswa SMA/sederajat.
