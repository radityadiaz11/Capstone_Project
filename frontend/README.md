# SNBPredict - Frontend App

Ini adalah antarmuka pengguna (*User Interface*) untuk platform **SNBPredict**, sebuah Sistem Cerdas untuk Kesiapan Siswa dalam seleksi SNBP. 

Aplikasi sisi klien (*Client-side*) ini dibangun menggunakan pustaka modern **React 19** dan alat pembangunan (*build tool*) **Vite** yang sangat cepat. Desainnya menggunakan CSS khusus (*Vanilla CSS*) untuk memberikan tampilan yang premium, mulus, dan responsif tanpa bergantung pada *framework* CSS yang berat.

## 🚀 Fitur Utama
- **Portal Terintegrasi (3-in-1):** Menyediakan 3 tampilan *Dashboard* yang sepenuhnya berbeda sesuai dengan tingkat hak akses pengguna:
  - **Portal Admin (Sekolah):** Untuk mengelola akun guru, orang tua, sinkronisasi data sistem, dan wawasan rekapitulasi level sekolah.
  - **Portal Guru (Wali Kelas):** Memiliki wewenang untuk menambah data siswa, mencatat input nilai semester, melihat prediksi AI, memonitor absensi (Kehadiran), dan mengekspor laporan akhir (ke Format Excel & PDF).
  - **Portal Ortu (Orang Tua):** Tampilan ringkas bagi orang tua untuk melihat ringkasan rapor anak, tren nilai dari waktu ke waktu, dan pesan/peringatan sistem.
- **Sistem *Routing* Dinamis:** Dilengkapi perlindungan rute (*Protected Routes*) memanfaatkan `react-router-dom` agar pengunjung yang belum *login* tidak bisa memaksa masuk.
- **Manajemen State Minimalis:** Menggunakan pendekatan *hooks* modern (`useState`, `useEffect`) yang bersih tanpa pustaka Redux yang berlebihan.
- **Layanan API Terpusat:** Menggunakan `axios` (di dalam `/src/api/axios.js`) yang secara otomatis menyisipkan token Otorisasi (JWT) di tiap panggilan jaringan.

## 🛠 Teknologi yang Digunakan
- **[React.js (v19)](https://react.dev/):** Pustaka antarmuka pengguna berbasis komponen.
- **[Vite](https://vitejs.dev/):** Alat pengembangan (*Dev Server* dan *Bundler*) yang super cepat.
- **[React Router DOM](https://reactrouter.com/):** Penanganan pindah halaman (*Routing*) pada aplikasi *Single Page Application* (SPA).
- **[Axios](https://axios-http.com/):** *HTTP Client* berbasis *Promise* untuk berkomunikasi dengan Backend.

## 📂 Struktur Direktori
\`\`\`text
frontend/
├── src/
│   ├── api/          # Konfigurasi instansi Axios (Interceptors, URL Base)
│   ├── components/   # Komponen React modular yang bisa dipakai berulang
│   ├── hooks/        # Custom Hooks (misal: useAuth untuk autentikasi)
│   ├── pages/        # Komponen utama dari halaman-halaman aplikasi
│   │   ├── admin/    # Layar dan halaman khusus untuk akun Admin/Kepala Sekolah
│   │   ├── auth/     # Layar autentikasi (Halaman Login Utama)
│   │   ├── guru/     # Layar dan halaman khusus untuk akun Guru/Wali Kelas
│   │   └── ortu/     # Layar dan halaman khusus untuk akun Orang Tua/Wali Murid
│   ├── App.jsx       # Susunan kerangka Routing (Route Provider)
│   └── main.jsx      # Titik masuk utama aplikasi (Root Render)
├── index.html        # Kerangka dokumen HTML utama
├── package.json      # Daftar dependensi frontend
└── vite.config.js    # Konfigurasi plugin Vite
\`\`\`

## ⚙️ Cara Menjalankan Secara Lokal (*Local Development*)

1. **Instalasi Dependensi**
   Buka terminal di dalam folder \`frontend\` dan jalankan:
   \`\`\`bash
   npm install
   \`\`\`

2. **Menyambungkan ke Backend**
   Jika menjalankan Frontend secara lokal, pastikan URL dasar (*Base URL*) API mengarah ke peladen Backend lokal Anda. Anda dapat mengubahnya di berkas:
   \`src/api/axios.js\` -> \`baseURL: 'http://localhost:3000/api/v1'\` (Jika Backend berjalan di *port* 3000).

3. **Jalankan *Development Server***
   \`\`\`bash
   npm run dev
   \`\`\`
   Aplikasi akan tersedia secara langsung di peramban Anda (biasanya di \`http://localhost:5173\`).

## 🌐 Proses Deployment (Vercel)
Aplikasi ini sudah dioptimasi untuk berjalan dengan mulus di platform **Vercel**. 
1. Saat mendeploy, pastikan Anda menautkannya ke dalam _Root Directory_ \`frontend\`.
2. Jangan lupa untuk mengatur *Rewrite* di Vercel agar rute halaman (*React Router*) tidak mengalami *Error 404* saat dimuat ulang (*refresh*), meskipun Vite dan Vercel seringkali sudah menanganinya secara otomatis.
3. Ubah \`baseURL\` di \`axios.js\` menjadi URL publik dari server Backend produksi Anda sebelum me-*merge* atau mem-*push* pembaruan kode terakhir!
