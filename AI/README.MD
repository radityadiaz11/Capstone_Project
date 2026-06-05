# SNBPredict AI Engine

## 1. Project Overview

### SNBPredict AI Engine

SNBPredict AI Engine merupakan komponen Artificial Intelligence pada sistem **SNBPredict** yang dirancang untuk membantu proses monitoring dan evaluasi performa akademik siswa.

Sistem memanfaatkan model Deep Learning Multi-Output Regression untuk memprediksi **Productivity Score** dan **Exam Score** berdasarkan kebiasaan belajar, aktivitas digital, kesehatan mental, serta faktor pendukung lainnya.

Selain menghasilkan prediksi numerik, sistem juga mengintegrasikan Generative AI berbasis Google Gemini untuk mengubah hasil prediksi menjadi insight naratif yang mudah dipahami oleh guru, orang tua, dan pihak sekolah. Dengan pendekatan ini, pengguna tidak hanya memperoleh angka prediksi, tetapi juga rekomendasi dan interpretasi yang lebih informatif untuk mendukung pengambilan keputusan akademik.

AI Engine dikembangkan sebagai layanan REST API yang dideploy menggunakan Docker pada Hugging Face Spaces.

### Repository

GitHub Repository:
https://github.com/radityadiaz11/Capstone_Project

Model Repository:
https://huggingface.co/danielfahko/snbpredict-model

Space Repository:
https://huggingface.co/spaces/danielfahko/snbpredict-space

---

## 2. AI Architecture

```text
Input Student Data
        │
        ▼
 Deep Learning Model
   (predict.py)
        │
        ▼
 Prediction Result
        │
        ▼
 Interpretation Layer
 (interpreter.py)
        │
        ▼
  Prompt Engine
(prompt_engine.py)
        │
        ▼
   Gemini API
        │
        ▼
 Narrative Insight
```

Diagram di atas menggambarkan alur konseptual pembentukan insight naratif. Pada implementasinya, layanan prediksi (predict.py) dan layanan generasi narasi (narasi.py) disediakan sebagai endpoint API yang terpisah dan diintegrasikan melalui main.py.

---

## 3. Technologies & Tools

### Deep Learning

* Python 3.10
* TensorFlow
* Keras
* NumPy
* Pandas
* Scikit-Learn
* Joblib

### Generative AI

* Google Gemini API
* Prompt Engineering

### API Development

* FastAPI
* Uvicorn
* Pydantic

### Deployment

* Docker
* Hugging Face Spaces
* Hugging Face Model Hub

### Development Environment

* Google Colab
* GitHub

---

## 4. Environment Setup

Ikuti langkah berikut untuk menyiapkan environment dan menjalankan SNBPredict AI Engine secara lokal.

### 1. Clone Repository

```bash
git clone https://github.com/radityadiaz11/Capstone_Project.git
cd Capstone_Project
cd "AI/HF SPACE REPOSITORY"
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Aktifkan virtual environment:

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Gemini API Key

SNBPredict AI Engine menggunakan Google Gemini API untuk menghasilkan insight naratif. Oleh karena itu, pengguna perlu menyiapkan API Key milik masing-masing sebelum menjalankan aplikasi.

Command Prompt (CMD):

```cmd
set GEMINI_API_KEY=your_api_key
```

PowerShell:

```powershell
$env:GEMINI_API_KEY="your_api_key"
```

### 5. Verify Installation

```bash
pip list
```

---

## 5. Project Structure

Struktur direktori AI pada repository Capstone Project ditunjukkan sebagai berikut:

```text
Capstone_Project/
└── AI/
    ├── HF MODEL REPOSITORY/
    ├── HF SPACE REPOSITORY/
    ├── NOTEBOOK/
    └── README.md
```

### HF MODEL REPOSITORY

Folder ini menyimpan seluruh artefak hasil pelatihan model yang digunakan pada proses inferensi.

```text
HF MODEL REPOSITORY/
│
├── student_multi_predictor.keras
├── best_model.keras
│
├── feat_scaler.pkl
├── tgt_scaler.pkl
├── le_gender.pkl
├── le_internet.pkl
│
├── saved_model.pb
├── fingerprint.pb
│
├── variables/
│   ├── variables.data-00000-of-00001
│   └── variables.index
│
├── history.json
├── meta.json
│
├── training_curves.png
└── actual_vs_predicted.png
```

### HF SPACE REPOSITORY

Folder ini berisi layanan AI yang dijalankan pada Hugging Face Spaces.

```text
HF SPACE REPOSITORY/
│
├── main.py
├── predict.py
├── narasi.py
├── interpreter.py
├── prompt_engine.py
│
├── requirements.txt
└── Dockerfile
```

### NOTEBOOK

Folder notebook berisi proses pengembangan model dan Generative AI.

```text
NOTEBOOK/
│
├── student_performance_predictor.ipynb
└── CapstoneGenAI.ipynb
```

---

## 6. Deep Learning Model

### Objective

Model dirancang untuk memprediksi dua indikator utama performa akademik siswa menggunakan pendekatan Multi-Output Regression:

1. Productivity Score
2. Exam Score

### Model Characteristics

* TensorFlow Model Subclassing
* Multi-Output Regression
* Residual Neural Network Architecture
* Custom Residual Block Layer
* Custom Weighted Multi-Output Loss Function
* Custom Training Loop menggunakan `tf.GradientTape`
* Production-ready SavedModel dan `.keras` artifacts

### Model Architecture

Model menggunakan pendekatan Multi-Output Regression dengan arsitektur shared representation dan task-specific heads. Bagian awal model digunakan untuk mengekstraksi representasi umum dari seluruh fitur input, kemudian dipisahkan menjadi dua cabang untuk memprediksi Productivity Score dan Exam Score.

```text
Input (13 features)
      │
      ▼
  Stem: Dense(256) → BN → GELU
      │
  ResidualBlock(256)  ── shared representation
  ResidualBlock(128)
  ResidualBlock(64)
      │
  ┌───┴───┐
  │       │
Head-P  Head-E          (task-specific branches)
ResBlock(64)  ResBlock(64)
ResBlock(32)  ResBlock(32)
Dense(16)     Dense(16)
  │               │
Dense(1,sigmoid)  Dense(1,sigmoid)
  │               │
productivity_score  exam_score
        └────┬────┘
          Concatenate → Output (2,)
```

Keterangan:

* Shared Trunk digunakan untuk mempelajari representasi umum dari seluruh fitur siswa.
* Head-P bertugas memprediksi Productivity Score.
* Head-E bertugas memprediksi Exam Score.
* Residual Block digunakan untuk menjaga stabilitas proses pelatihan dan meningkatkan kemampuan representasi model.
* Concatenate Layer menggabungkan kedua output menjadi satu tensor keluaran dengan dua target prediksi.

### Dataset Information

| Attribute        | Value                          |
| ---------------- | ------------------------------ |
| Total Records    | 5,100                          |
| Total Features   | 13                             |
| Targets          | Productivity Score, Exam Score |
| Task Type        | Multi-Output Regression        |
| Train Split      | 3,570                          |
| Validation Split | 765                            |
| Test Split       | 765                            |

### Input Features

* Age
* Gender
* Study Hours
* Self Study Hours
* Online Classes Hours
* Social Media Hours
* Gaming Hours
* Sleep Hours
* Screen Time Hours
* Internet Quality
* Mental Health Score
* Focus Index
* Burnout Level

### Output Targets

* Productivity Score (0–100)
* Exam Score (0–100)

---

## 7. Generative AI Pipeline

### Interpreter Layer

Interpreter berfungsi mengubah data siswa dan hasil prediksi menjadi representasi yang lebih mudah dipahami melalui proses kategorisasi dan pelabelan kondisi siswa.

Aspek yang diinterpretasikan meliputi:

* Intensitas belajar
* Tingkat distraksi digital
* Kualitas tidur
* Kondisi kesehatan mental
* Tingkat burnout
* Tingkat fokus belajar
* Status performa akademik
* Tingkat risiko akademik

### Prompt Engine

Prompt Engine membangun prompt terstruktur berdasarkan hasil interpretasi data siswa.

Sistem menyediakan tiga persona utama:

* Guru/Wali Kelas
* Orang Tua
* Admin/Kepala Sekolah

### Gemini Integration

Prompt yang telah dibangun dikirim ke Google Gemini API untuk menghasilkan narasi otomatis dalam bahasa natural yang mudah dipahami pengguna.

---

## 8. Inference Flow

```text
User Input
     │
     ▼
Input Validation
     │
     ▼
Feature Encoding
     │
     ▼
Feature Scaling
     │
     ▼
Deep Learning Prediction
     │
     ▼
Inverse Scaling
     │
     ▼
Prediction Result
     │
     ▼
Interpretation Layer
     │
     ▼
Prompt Construction
     │
     ▼
Gemini Generation
     │
     ▼
Final Narrative
```

---

## 9. API Endpoints

| Method | Endpoint         | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| POST   | `/predict`       | Generate prediction for a single student      |
| POST   | `/predict/batch` | Generate predictions for multiple students    |
| POST   | `/narasi/guru`   | Generate narrative insight for teachers       |
| POST   | `/narasi/admin`  | Generate executive summary for administrators |
| POST   | `/narasi/ortu`   | Generate narrative insight for parents        |
| GET    | `/health`        | Check API and Gemini service health           |

Local API Documentation:

```text
http://localhost:7860/docs
```

---

## 10. Running Locally

Jalankan layanan FastAPI menggunakan perintah berikut:

```bash
uvicorn main:app --host 0.0.0.0 --port 7860
```

Setelah server berjalan:

```text
http://localhost:7860
```

Dokumentasi API:

```text
http://localhost:7860/docs
```

---

## 11. Docker Deployment

### Build Image

```bash
docker build -t snbpredict-ai .
```

### Run Container

```bash
docker run -p 7860:7860 snbpredict-ai
```

---

## 12. Hugging Face Deployment

SNBPredict AI Engine menggunakan dua repository terpisah pada Hugging Face untuk memisahkan artefak model dan layanan inferensi.

### Model Repository

Model dapat diakses melalui:

https://huggingface.co/danielfahko/snbpredict-model

Model dimuat pada layanan inferensi melalui artefak yang tersimpan pada Model Repository dan digunakan oleh modul `predict.py` selama proses prediksi.

Repository ini menyimpan:

* Deep Learning Model
* Feature Scaler
* Target Scaler
* Label Encoder
* Metadata Model
* Training History
* Evaluation Artifacts

### Model Download

Selain tersedia pada Hugging Face Model Repository, model juga dapat diunduh melalui Google Drive berikut:

https://drive.google.com/drive/folders/13kN8e_wE4PgnNHSPTU05gW0NIrMQtPuf?usp=sharing

### Space Repository

Repository layanan:

```text
https://huggingface.co/spaces/danielfahko/snbpredict-space
```

Repository ini menjalankan:

* FastAPI Service
* Prediction Service
* Narrative Generation Service
* Docker Configuration

### Deployment Workflow

```text
User Input
     │
     ▼
 Hugging Face Space
     │
     ▼
 Load Model Repository
     │
     ▼
 Prediction Service
     │
     ▼
 Generative AI Pipeline
     │
     ▼
 Narrative Insight
```

### Public API Access

Base URL:

```text
https://danielfahko-snbpredict-space.hf.space
```

Swagger Documentation:

```text
https://danielfahko-snbpredict-space.hf.space/docs
```

---

## 13. Example Output

### Prediction Output

```json
{
  "productivity_score": 84.27,
  "exam_score": 78.51
}
```

### Narrative Output

```text
Berdasarkan hasil analisis, siswa menunjukkan kebiasaan belajar yang cukup baik dengan tingkat fokus yang relatif stabil. Kondisi tersebut mendukung performa akademik yang positif meskipun masih terdapat beberapa faktor yang perlu diperhatikan, terutama terkait pengelolaan waktu dan distraksi digital. Disarankan untuk mempertahankan konsistensi belajar serta melakukan pemantauan berkala terhadap perkembangan akademik siswa.
```

---

## 14. AI Engineer Contributions

### RC. Nurul A'la

* Mengembangkan pipeline Generative AI untuk menghasilkan insight naratif berdasarkan data dan hasil prediksi siswa.
* Merancang strategi prompt engineering untuk menyesuaikan narasi dengan kebutuhan berbagai pengguna.
* Membangun modul interpretasi hasil prediksi dan alur pembentukan narasi otomatis.
* Mengintegrasikan Google Gemini API untuk menghasilkan penjelasan dan rekomendasi akademik secara otomatis.

### Daniel Fahlevi Bako

* Mengembangkan model Deep Learning untuk prediksi performa akademik siswa.
* Mengimplementasikan proses pelatihan, evaluasi, dan validasi model.
* Membangun layanan prediksi dan inferensi berbasis API.
* Mengintegrasikan komponen Machine Learning dan Generative AI ke dalam satu layanan AI yang terpadu.
* Mengelola containerization menggunakan Docker serta proses deployment pada Hugging Face.
