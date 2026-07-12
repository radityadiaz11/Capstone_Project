# SNBPredict - Backend API

Ini adalah kode sumber (*source code*) untuk sisi Backend (API) dari sistem **SNBPredict**, sebuah Sistem Cerdas untuk Kesiapan Siswa dalam seleksi SNBP. 

Aplikasi backend ini dibangun menggunakan **Node.js** dan **Express.js**, serta memanfaatkan **PostgreSQL** (melalui ORM **Sequelize**) sebagai sistem manajemen basis datanya.

## 🚀 Fitur Utama
- **Autentikasi & Otorisasi:** Sistem Login berbasis JWT (*JSON Web Token*) yang membedakan 3 peran (*role*) pengguna: `Admin` (Sekolah), `Guru` (Wali Kelas), dan `Ortu` (Orang Tua).
- **Manajemen Data Siswa:** CRUD data akademik siswa, termasuk nilai per mata pelajaran dan jumlah ketidakhadiran (absensi).
- **Dashboard & Statistik:** Endpoint untuk menghitung statistik kesiapan kelas, tren nilai, laporan akademik, serta klasifikasi peringatan dini (Aman, Perhatian, Kritis).
- **Integrasi Keamanan:** Mengamankan sandi menggunakan pustaka enkripsi `bcryptjs`.

## 🛠 Teknologi yang Digunakan
- **[Node.js](https://nodejs.org/):** Lingkungan eksekusi (*Runtime*) JavaScript.
- **[Express.js](https://expressjs.com/):** Kerangka kerja (*Framework*) web minimalis untuk membangun RESTful API.
- **[Sequelize](https://sequelize.org/):** ORM berbasis janji (*Promise-based*) untuk PostgreSQL.
- **[PostgreSQL](https://www.postgresql.org/):** Basis data relasional (*Relational Database*).
- **[JWT (jsonwebtoken) & bcryptjs](https://www.npmjs.com/):** Pustaka standar untuk autentikasi dan pengamanan *password*.

## 📂 Struktur Direktori (*Berdasarkan Standar MVC*)
\`\`\`text
backend/
├── src/
│   ├── config/       # Konfigurasi database (koneksi PostgreSQL/Sequelize)
│   ├── controllers/  # Logika bisnis dan pemrosesan dari tiap Endpoint API
│   ├── middleware/   # Fungsi middleware (seperti otentikasi JWT & verifikasi peran)
│   ├── models/       # Definisi skema tabel database (Model Sequelize)
│   └── routes/       # Definisi semua URL Endpoint REST API
├── index.js          # File utama (Entry point) dari server
├── package.json      # Daftar dependensi dan script aplikasi
└── .env.example      # Contoh berkas konfigurasi variabel lingkungan
\`\`\`

## ⚙️ Cara Menjalankan Secara Lokal (*Local Development*)

1. **Instalasi Dependensi**
   Buka terminal di dalam folder \`backend\` dan jalankan:
   \`\`\`bash
   npm install
   \`\`\`

2. **Konfigurasi Lingkungan (*Environment Variables*)**
   Buat sebuah file bernama \`.env\` di _root_ folder \`backend\`, lalu isi dengan format seperti ini:
   \`\`\`env
   PORT=3000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=password_database_anda
   DB_NAME=snbpredict
   JWT_SECRET=rahasia_jwt_anda
   \`\`\`
   *(Ubah nilai-nilai di atas sesuai dengan konfigurasi server PostgreSQL di komputer Anda).*

3. **Jalankan Server**
   Untuk masa pengembangan (*development*), gunakan perintah ini agar server otomatis *restart* ketika ada perubahan file:
   \`\`\`bash
   npm run dev
   \`\`\`
   Server akan berjalan secara bawaan di \`http://localhost:3000\`.

## 🌐 Proses Deployment (Vercel)
Aplikasi ini sudah dipersiapkan untuk berjalan di lingkungan tanpa peladen (*serverless*) seperti **Vercel**. Pastikan Anda mengatur konfigurasi **Root Directory** ke folder \`backend\` di pengaturan GitHub pada proyek Vercel Anda, serta mengisi seluruh daftar *Environment Variables* di *Dashboard* Vercel (khususnya informasi koneksi *Database* produksi).