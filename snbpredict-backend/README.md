# SNBPredict Backend API

Backend API untuk aplikasi **SNBPredict** yang dibangun menggunakan Node.js, Express, dan Sequelize ORM. API ini mendukung manajemen data siswa, sistem prediksi kelolosan SNBP, visualisasi statistik dashboard, sistem peringatan dini (*early warning*), dan autentikasi berbasis JSON Web Token (JWT).

---

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: Registrasi dan login berbasis JWT dengan pemisahan role pengguna (`admin`, `guru`, `ortu`, `siswa`).
- **Manajemen Data Siswa (CRUD)**: Kelola data profil, nilai rapor, dan rekap kelas siswa secara dinamis.
- **Sistem Prediksi Kelolosan SNBP**: Integrasi ke model AI untuk memprediksi probabilitas kelolosan siswa di universitas tujuan.
- **Early Warning System (EWS)**: Deteksi otomatis siswa yang mengalami penurunan nilai signifikan atau memerlukan bimbingan khusus.
- **Dual-Mode Database**: Menggunakan PostgreSQL untuk penyimpanan persisten, dengan *fallback* otomatis ke **In-Memory Mode** jika database PostgreSQL tidak dikonfigurasi atau tidak aktif.
- **Vercel Serverless Ready**: Konfigurasi siap pakai untuk dideploy ke Vercel.

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Sequelize
- **Database Driver**: PostgreSQL (`pg`, `pg-hstore`)
- **Autentikasi & Keamanan**: `jsonwebtoken`, `bcryptjs`, `cors`
- **HTTP Client**: `axios` (untuk berkomunikasi dengan model AI)
- **Environment Utility**: `dotenv`
- **Development Tool**: `nodemon`

---

## ⚙️ Prasyarat & Persiapan

Sebelum memulai, pastikan Anda telah memasang:
- **Node.js** (Versi 16 atau lebih baru)
- **PostgreSQL** (Opsional, jika ingin menyimpan data secara persisten)

### Langkah Instalasi

1. **Masuk ke direktori backend:**
   ```bash
   cd backend
   ```

2. **Pasang dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`):**
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka berkas `.env` dan sesuaikan nilainya:
   ```env
   PORT=3000
   NODE_ENV=development

   # Konfigurasi Database PostgreSQL
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=snbpredict_db
   DB_USER=postgres
   DB_PASSWORD=isi_password_postgres_kamu

   # JWT Secret Key
   JWT_SECRET=snbpredict_rahasia_super_panjang_2024
   JWT_EXPIRES=7d

   # URL Model AI (dari tim AI Engineer)
   AI_MODEL_URL=http://localhost:5000
   ```

---

## 🗃️ Seeding Database (Data Awal)

API ini menyediakan skrip untuk membuat tabel database secara otomatis beserta data tes awal (users dan data siswa). 

Jalankan perintah berikut untuk mengisi data awal:

1. **Seed Akun Pengguna (Test Users):**
   ```bash
   node seedUsers.js
   ```
   *Skrip ini akan menghasilkan 4 akun pengujian dengan password standard `password123`:*
   - **Guru**: `sari.rahayu@sman1yk.sch.id`
   - **Admin**: `admin@sman1yk.sch.id`
   - **Orang Tua**: `budi.ortu@gmail.com`
   - **Siswa**: `andi.siswa@sman1yk.sch.id`

2. **Seed Data Siswa & Akademik:**
   ```bash
   node seedStudents.js
   ```

---

## 🏃 Menjalankan Aplikasi

### Mode Pengembangan (Development)
Menjalankan server lokal dengan fitur auto-reload menggunakan `nodemon`:
```bash
npm run dev
```
Server akan berjalan di: `http://localhost:3000`

### Mode Produksi (Production)
Menjalankan server tanpa auto-reload:
```bash
npm start
```

---

## 📁 Struktur Direktori

```text
backend/
├── data/                  # Penyimpanan data lokal (opsional/in-memory)
├── src/
│   ├── config/            # Konfigurasi database & data store
│   ├── controllers/       # Logika utama penanganan request (controllers)
│   ├── middleware/        # Middleware Express (autentikasi, error handler)
│   ├── models/            # Skema model Sequelize (User, Student, dll.)
│   └── routes/            # Definisi endpoint API Express
├── index.js               # Titik masuk utama aplikasi (main entrypoint)
├── seedUsers.js           # Seeder untuk data akun pengujian
├── seedStudents.js        # Seeder untuk data siswa
├── vercel.json            # Konfigurasi deployment untuk Vercel Serverless
└── package.json           # Definisi dependensi & script project
```

---

## 🔌 Daftar Endpoint API

Semua endpoint API menggunakan prefix `/api/v1`.

### 1. Autentikasi (`/api/v1/auth`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **POST** | `/register` | Pendaftaran akun pengguna baru | Publik |
| **POST** | `/login` | Login pengguna dan mengembalikan JWT token | Publik |

### 2. Manajemen Siswa (`/api/v1/students`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **GET** | `/` | Mengambil seluruh data siswa | JWT |
| **GET** | `/:id` | Mengambil detail 1 siswa berdasarkan ID | JWT |
| **POST** | `/` | Menambahkan data siswa baru | JWT |
| **PUT** | `/:id` | Memperbarui data siswa | JWT |
| **DELETE** | `/:id` | Menghapus data siswa | JWT |

### 3. Prediksi SNBP (`/api/v1/predict`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **POST** | `/` | Melakukan prediksi kelolosan SNBP siswa ke AI service | JWT |

### 4. Ringkasan & Dashboard (`/api/v1/dashboard`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **GET** | `/` | Mengambil data statistik ringkasan dashboard | JWT |
| **GET** | `/snbp-stats` | Mengambil data statistik visualisasi SNBP | JWT |

### 5. Peringatan Dini / Early Warning (`/api/v1/warnings`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **GET** | `/` | Mengambil daftar peringatan penurunan performa siswa | JWT |
| **PUT** | `/:id/read` | Menandai pesan peringatan tertentu telah dibaca | JWT |

### 6. Akademik & Monitoring (`/api/v1/academic`)
| Metode | Endpoint | Deskripsi | Otorisasi |
|---|---|---|---|
| **GET** | `/scores` | Mengambil data riwayat nilai akademik siswa | JWT |
| **GET** | `/monitoring` | Mengambil data monitoring bimbingan siswa | JWT |

---

## ☁️ Deployment ke Vercel

Backend ini dirancang agar kompatibel dengan **Vercel Serverless Functions**. File konfigurasi `vercel.json` telah disediakan secara otomatis.

Untuk mendeploy secara manual:
1. Pastikan Anda telah menginstal Vercel CLI (`npm i -g vercel`).
2. Jalankan perintah `vercel` di root folder backend.
3. Konfigurasikan Environment Variables yang sesuai di dashboard Vercel Anda (khususnya `DATABASE_URL` atau `DB_*` serta `JWT_SECRET`).
