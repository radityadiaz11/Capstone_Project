# 📊 Analisis Performa Siswa - SNBP

## 📌 Deskripsi Proyek

Proyek ini merupakan **analisis data performa siswa** dalam konteks persiapan SNBP (Seleksi Nasional Berdasarkan Prestasi). Tujuan utama proyek adalah mengeksplorasi faktor-faktor yang memengaruhi nilai ujian siswa — seperti jam belajar, jam tidur, penggunaan media sosial, dan produktivitas — serta menguji signifikansi pengaruhnya secara statistik melalui A/B Testing.

Proyek ini mencakup proses end-to-end berikut:

- **Data Cleaning & Data Wrangling** — pembersihan dan transformasi data mentah
- **Exploratory Data Analysis (EDA)** — eksplorasi distribusi, korelasi, dan pola data
- **A/B Testing** — pengujian hipotesis untuk menentukan faktor signifikan terhadap performa siswa
- **Visualisasi Data** — grafik dan insight berbasis data
- **Dashboard Interaktif** — aplikasi Streamlit untuk monitoring performa siswa secara real-time

---

## 🎯 Tujuan Proyek

1. Membersihkan dan mempersiapkan data untuk analisis.
2. Melakukan eksplorasi data guna memahami karakteristik dataset.
3. Membagi data ke dalam kelompok A dan B.
4. Menguji hipotesis menggunakan metode statistik.
5. Menentukan apakah terdapat perbedaan signifikan antara kedua kelompok.
6. Menyajikan hasil analisis melalui dashboard interaktif.

---

## 📂 Struktur Proyek

```
ds/
│
├── Dashboard/
│   └── dashboard.py              # Dashboard interaktif (Streamlit)
│
├── Data/
│   ├── dataset.csv               # Dataset mentah
│   └── cleaned_data.csv          # Dataset yang telah dibersihkan
│
├── ab_testing.ipynb              # Notebook A/B Testing & EDA
├── Data_Dictionary.xlsx          # Dokumentasi variabel dataset
├── Laporan teknis komprehensif.pdf  # Laporan lengkap proyek
└── README.md                     # Dokumentasi proyek
```

### Penjelasan File & Folder

| File / Folder | Deskripsi |
|---------------|-----------|
| `Dashboard/dashboard.py` | Aplikasi dashboard interaktif berbasis Streamlit |
| `Data/dataset.csv` | Dataset mentah sebelum pembersihan |
| `Data/cleaned_data.csv` | Dataset yang telah melalui proses cleaning & wrangling |
| `ab_testing.ipynb` | Jupyter Notebook utama berisi proses EDA, A/B Testing, dan visualisasi |
| `Data_Dictionary.xlsx` | Dokumentasi atribut dan variabel dataset |
| `Laporan teknis komprehensif.pdf` | Laporan teknis komprehensif proyek |
| `README.md` | Dokumentasi proyek ini |

---

## 🛠️ Teknologi yang Digunakan

- Python
- Pandas
- NumPy
- SciPy
- Matplotlib
- Seaborn
- Streamlit
- Jupyter Notebook

---

## 📦 Instalasi

Clone repository:

```bash
git clone https://github.com/username/ab_testing.git
```

Masuk ke folder proyek:

```bash
cd ab_testing
```

Install dependencies:

```bash
pip install pandas numpy scipy matplotlib seaborn streamlit
```

---

## 🚀 Menjalankan Notebook

Buka Google Colab:

```
https://colab.research.google.com/
```

Kemudian jalankan notebook:

```
ab_testing.ipynb
```

---

## 📊 Dashboard Interaktif

Aplikasi dashboard interaktif berbasis Streamlit untuk menganalisis performa akademik siswa, jam belajar, waktu tidur, dan pengaruhnya terhadap nilai ujian. Project ini dibuat untuk memenuhi tugas Capstone Project.

Data yang dianalisis dalam dashboard ini diambil langsung dari repositori GitHub publik agar mempermudah proses deployment dan pengujian secara real-time.

## Fitur Utama

- **Ringkasan Data (KPI)**: Menampilkan total siswa, rata-rata nilai ujian, rata-rata jam belajar, jam tidur, serta jumlah siswa yang berisiko mengalami *burnout*.
- **Grafik Analisis**:
  - Distribusi nilai ujian siswa.
  - Pengaruh jam belajar terhadap nilai (dikelompokkan berdasarkan gender).
  - Hubungan waktu tidur vs nilai ujian (tren regresi).
  - Pengaruh durasi bermain media sosial vs nilai ujian.
  - Deteksi risiko akademik (*Normal*, *Understudy*, *Burnout Risk*).
- **Insight Otomatis**: Rekomendasi atau kesimpulan singkat berdasarkan rata-rata statistik siswa.
- **Tabel Data**: Pratinjau data mentah yang dapat difilter secara langsung melalui sidebar.

## 📈 Menjalankan Dashboard

Jalankan perintah berikut:

```bash
streamlit run Dashboard/dashboard.py
```

Dashboard akan tersedia pada:

```
http://localhost:8501
```

## Panduan Deploy ke Streamlit Share

Jika ingin meng-online-kan dashboard ini secara gratis:
1. Push seluruh folder project ini ke akun GitHub Anda.
2. Masuk ke [share.streamlit.io](https://share.streamlit.io) menggunakan akun GitHub Anda.
3. Klik **New app**, lalu isi form sebagai berikut:
   - **Repository**: Nama repositori GitHub Anda.
   - **Branch**: `main` atau `master`.
   - **Main file path**: `Dashboard/dashboard.py`.
4. Klik **Deploy!** dan tunggu beberapa menit hingga aplikasi selesai di-build.

---

## 🧪 Metode A/B Testing

Tahapan yang dilakukan:

### 1. Menentukan Hipotesis

**Hipotesis Nol (H₀)**

Tidak terdapat perbedaan signifikan antara kelompok A dan kelompok B.

**Hipotesis Alternatif (H₁)**

Terdapat perbedaan signifikan antara kelompok A dan kelompok B.

### 2. Menentukan Tingkat Signifikansi

```text
α = 0.05
```

### 3. Menghitung Statistik Uji

Pengujian dilakukan menggunakan:

- Independent Sample T-Test
atau
- Two-Proportion Z-Test

sesuai karakteristik data.

### 4. Menghitung P-Value

Kriteria keputusan:

- Jika p-value ≤ 0.05 → Tolak H₀
- Jika p-value > 0.05 → Gagal menolak H₀

---

## 📊 Hasil Analisis

Berdasarkan hasil A/B Testing yang dilakukan:

| Test | Temuan |
|------|--------|
| **#1 Jam Belajar** | Siswa dengan jam belajar ≥ median memiliki exam_score **signifikan lebih tinggi** |
| **#2 Productivity Score** | Siswa dengan produktivitas tinggi memiliki exam_score **signifikan lebih tinggi** |
| **#3 Sleep Hours** | Pengaruh tidur cukup terhadap exam_score perlu diperiksa dari hasil test |
| **#4 Social Media** | Siswa dengan screen time social media rendah cenderung memiliki exam_score lebih tinggi |

**Rekomendasi:**
1. **Tingkatkan waktu belajar** — terbukti secara statistik berpengaruh signifikan
2. **Jaga produktivitas** — indikator terkuat dalam capstone project ini
3. **Batasi penggunaan social media** — berkorelasi negatif dengan performa
4. **Perhatikan kualitas tidur** — meskipun tidak selalu signifikan, mendukung wellbeing secara keseluruhan

---

## 📖 Dataset

Dataset yang digunakan berisi informasi terkait performa siswa, termasuk faktor-faktor yang berpotensi memengaruhi hasil akademik.

Detail setiap variabel dapat dilihat pada file:

```
Data_Dictionary.xlsx
```

---

## 📄 Dokumentasi

Dokumentasi lengkap proyek tersedia pada:

```
Laporan teknis komprehensif.pdf
```
