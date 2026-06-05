# SNBPredict: Sistem Cerdas Monitoring dan Prediksi Kesiapan SNBP Siswa

> Proyek ini mengembangkan aplikasi web berbasis data untuk membantu sekolah memantau dan memprediksi performa akademik siswa dalam persiapan SNBP. Sistem menggunakan Deep Learning (ANN) untuk prediksi nilai siswa dan menyajikan hasil analisis melalui dashboard interaktif yang informatif dan mudah dipahami. Solusi ini diharapkan dapat membantu sekolah melakukan pemantauan performa secara lebih akurat, adaptif, dan berbasis data guna mendukung kesiapan siswa menghadapi SNBP.

---

## 👥 Anggota Tim

| Nama | Learning Path | Peran |
|------|--------------|-------|
| Nindya Zahra · Devi Ema Dewiyanti | Data Science | Data Analyst / ML Engineer |
| RC. Nurul A'la · Daniel Fahlevi Bako | Artificial Intelligence | AI Engineer |
| Fadhilah Salsa Billah · Diaz Raditya Suryatama | Fullstack Web | Frontend / Backend Developer |

---

## 📌 Deskripsi Proyek

Proyek ini dikembangkan untuk membantu sekolah memantau performa akademik siswa dalam persiapan SNBP. Sistem bertujuan memprediksi performa siswa menggunakan metode Deep Learning (ANN) serta menyajikan hasil analisis melalui dashboard interaktif. Manfaat yang dihasilkan adalah membantu sekolah melakukan pemantauan, deteksi dini penurunan performa, dan pengambilan keputusan berbasis data secara lebih efektif.

**Studi Kasus / Problem Statement:**
> Pemantauan performa akademik siswa untuk SNBP masih dilakukan secara manual dan tidak terstruktur, sehingga sekolah sulit mendeteksi penurunan kinerja sejak dini. Belum ada sistem prediktif yang akurat untuk mendukung keputusan kelulusan.

---

## 🗂️ Struktur Folder Repositori

```
📦 Capstone_Project/
├── 📁 AI/                          # Artificial Intelligence — model & API inference
├── 📁 ds/                          # Data Science — dataset & analisis (Python)
├── 📁 snbpredict-backend/          # Backend — REST API (Node.js + Express + Sequelize)
├── 📁 traking-snbp/                # Frontend — React + Vite UI
├── package-lock.json
└── README.md                       # Dokumentasi utama (file ini)
```

---

## 📊 Kontribusi: Data Science

**Anggota:** Nindya Zahra · Devi Ema Dewiyanti

### Tools & Library
- Python 3.9+
- Streamlit ≥ 1.30.0
- Pandas ≥ 2.0.0
- NumPy ≥ 1.24.0
- Matplotlib ≥ 3.7.0
- Seaborn ≥ 0.12.0

### Cara Menjalankan

```bash
cd ds

# Buat virtual environment
python -m venv venv
venv\Scripts\activate           # macOS/Linux: source venv/bin/activate

# Install dependensi
pip install streamlit pandas numpy matplotlib seaborn

# Jalankan dashboard
streamlit run dashboard.py
```

Aplikasi akan terbuka otomatis di browser pada `http://localhost:8501`.

### Hasil
- EDA menemukan korelasi positif antara jam belajar dan nilai ujian, serta dampak negatif penggunaan media sosial terhadap performa akademik.
- Dashboard interaktif menampilkan 5 KPI utama (total siswa, rata-rata nilai, jam belajar, jam tidur, burnout risk) beserta 6 visualisasi analitik.
- Sistem klasifikasi risiko otomatis mengidentifikasi siswa **Burnout Risk** (belajar > 8 jam & tidur < 5 jam) dan **Understudy** (belajar < 2 jam).
- Insight otomatis memberikan rekomendasi berdasarkan pola belajar, tidur, dan konsumsi media sosial siswa.

---

# 🤖 Kontribusi: Artificial Intelligence

**Anggota:** RC. Nurul A'la · Daniel Fahlevi Bako

### Overview

SNBPredict AI Engine menggabungkan Deep Learning Multi-Output Regression untuk memprediksi performa akademik siswa dengan Generative AI (Google Gemini) untuk menghasilkan insight naratif yang mudah dipahami oleh guru, orang tua, dan pihak sekolah. Model dikembangkan dan didemonstrasikan dalam bentuk Jupyter Notebook.

### AI Architecture

Input Student Data → Deep Learning Model → Prediction Result → Interpreter → Prompt Engine → Gemini API → Narrative Insight

### Tools & Library

| Kategori                | Tools                                                  |
| ----------------------- | ------------------------------------------------------ |
| Deep Learning           | Python, TensorFlow, Keras, NumPy, Pandas, Scikit-Learn |
| Generative AI           | Google Gemini API, Prompt Engineering                  |
| Development Environment | Jupyter Notebook (.ipynb)                              |
| Model Repository        | Hugging Face                                           |

### Deep Learning Model

**File:** `student_performance_predictor.ipynb`

**Task:** Multi-Output Regression untuk memprediksi **Productivity Score** dan **Exam Score** (0–100).

**Arsitektur:** TensorFlow Model Subclassing dengan Residual Neural Network.

**Dataset:** 5.100 records | 13 fitur | Train: 3.570 | Validation: 765 | Test: 765.

### Generative AI Pipeline

**File:** `CapstoneGenerativeAI.ipynb`

* **Interpreter** — Mengkategorikan kondisi siswa berdasarkan fitur dan hasil prediksi.
* **Prompt Engineering** — Menyusun konteks analisis sesuai kebutuhan pengguna.
* **Gemini Integration** — Menghasilkan narasi otomatis dalam bahasa natural untuk Guru, Orang Tua, dan Admin.

### Model Repository

* Hugging Face: https://huggingface.co/danielfahko/snbpredict-model
* Google Drive: [https://drive.google.com/drive/folders/13kN8e_wE4PgnNHSPTU05gW0NIrMQtPuf?usp=sharing]

### Cara Menjalankan

```bash
cd AI

# Install dependensi yang dibutuhkan
pip install tensorflow pandas numpy scikit-learn jupyter google-generativeai

# Buka Jupyter Notebook
jupyter notebook
```

Buka notebook:

* `student_performance_predictor.ipynb`
* `CapstoneGenerativeAI.ipynb`

**Catatan:** Siapkan dan masukkan `GEMINI_API_KEY` pada notebook Generative AI sebelum menjalankan proses generasi narasi.

### Hasil

**Prediction Output (Contoh)**

```json
{
  "productivity_score": 84.27,
  "exam_score": 78.51
}
```

**Narrative Output**

> Berdasarkan hasil analisis, siswa menunjukkan kebiasaan belajar yang cukup baik dengan tingkat fokus yang relatif stabil. Disarankan untuk mempertahankan konsistensi belajar serta melakukan pemantauan berkala terhadap perkembangan akademik siswa.

### Kontribusi AI Engineer

**RC. Nurul A'la** — Pengembangan pipeline Generative AI, prompt engineering, interpretasi hasil prediksi, dan integrasi Google Gemini API.

**Daniel Fahlevi Bako** — Pengembangan model Deep Learning, proses training dan evaluasi model, pengembangan pipeline inferensi, serta integrasi model prediksi dengan Generative AI.

---

## 🌐 Kontribusi: Fullstack Web

**Anggota:** Fadhilah Salsa Billah · Diaz Raditya Suryatama

### Overview

Aplikasi web fullstack SNBPredict menyediakan antarmuka untuk tiga peran pengguna (Admin, Guru, dan Orang Tua) serta REST API untuk otentikasi, manajemen siswa, prediksi performa, dan early-warning system.

### Tools & Teknologi

| Kategori       | Tools                                              |
|----------------|-----------------------------------------------------|
| Frontend       | React, Vite                                         |
| Backend        | Node.js, Express, Sequelize                         |
| Database       | PostgreSQL                                          |
| Data & ML      | Python (dataset & skrip analisis di folder `ds/`)   |

### Struktur Folder Fullstack

```
Capstone_Project/
├── snbpredict-backend/   # REST API — otentikasi, manajemen siswa, prediksi, early-warning
├── traking-snbp/         # React + Vite UI — dashboard Admin, Guru, Orang Tua
└── ds/                   # Dataset & analisis (Python)
```

### Cara Menjalankan

```bash
# 1. Jalankan Backend
cd snbpredict-backend
npm install
# Buat file .env sesuai petunjuk di snbpredict-backend/README.md
npm run dev

# 2. Jalankan Frontend (buka terminal baru)
cd traking-snbp
npm install
npm run dev
```

> Buka frontend di `http://localhost:5173` dan pastikan backend berjalan di `http://localhost:3000`.

### Hasil
- Frontend dapat diakses di `http://localhost:5173`
- Backend API berjalan di `http://localhost:3000`
- Fitur utama: otentikasi multi-role (Admin, Guru, Orang Tua), dashboard interaktif, manajemen data siswa, prediksi performa akademik, dan early-warning system

### Dokumentasi Lengkap
- Dokumentasi backend: [snbpredict-backend/README.md](snbpredict-backend/README.md)
- Dokumentasi frontend: [traking-snbp/README.md](traking-snbp/README.md)
- Dataset dan skrip analisis: lihat folder `ds/`

---

## 🔗 Demo & Tautan Penting

| Keterangan | Tautan |
|-----------|--------|
| Demo Aplikasi | [link] |
| Slide Presentasi | [https://canva.link/wrdopyllck7l196](https://canva.link/wrdopyllck7l196) |
| Dataset | [Google Drive](https://drive.google.com/drive/folders/1Qtt0uPR-Oa3XQ6uMs_XfsYCP0sNwk7GI?usp=drive_link) |
| Video Demo | [link] |

---

## 📄 Lisensi & Acknowledgement

Proyek ini dibuat untuk keperluan **Dicoding Camp** dan bersifat edukatif.

- [Dicoding](https://www.dicoding.com/) — atas program Dicoding Camp
- [React](https://react.dev/) & [Vite](https://vitejs.dev/) — Frontend framework & build tool
- [Express](https://expressjs.com/) & [Sequelize](https://sequelize.org/) — Backend framework & ORM
- [TensorFlow](https://www.tensorflow.org/) — Deep Learning framework
- [Google Gemini API](https://ai.google.dev/) — Generative AI untuk insight naratif
- [Streamlit](https://streamlit.io/) — Dashboard analitik interaktif
