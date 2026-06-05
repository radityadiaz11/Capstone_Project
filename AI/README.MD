# SNBPredict AI Engine

## 1. Project Overview

### SNBPredict AI Engine

SNBPredict AI Engine merupakan komponen Artificial Intelligence pada sistem **SNBPredict** yang bertugas melakukan prediksi performa akademik siswa serta menghasilkan insight naratif berbasis Generative AI.

Sistem menggabungkan model Deep Learning Multi-Output Regression untuk memprediksi indikator performa akademik siswa dengan layanan Generative AI berbasis Google Gemini untuk menghasilkan interpretasi yang mudah dipahami oleh guru, orang tua, maupun pihak sekolah.

AI Engine dikembangkan sebagai layanan terpisah yang dapat digunakan melalui REST API dan dideploy menggunakan Docker pada Hugging Face Spaces.

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

Diagram di atas menggambarkan alur konseptual sistem AI dari proses prediksi hingga pembentukan insight naratif.

Pada implementasinya, modul prediksi (`predict.py`) dan modul narasi (`narasi.py`) disediakan sebagai layanan API yang terpisah dan diintegrasikan melalui `main.py`.

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
* Hugging Face Model Repository

### Development Environment

* Google Colab
* GitHub

---

## 4. Project Structure

### Model Repository (`snbpredict-model`)

Repository ini menyimpan seluruh artefak hasil pelatihan model yang digunakan pada proses inferensi.

```text
snbpredict-model/
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

Keterangan:

* `student_multi_predictor.keras` : model utama hasil training.
* `best_model.keras` : checkpoint model terbaik selama proses pelatihan.
* `feat_scaler.pkl` : scaler fitur input.
* `tgt_scaler.pkl` : scaler target output.
* `le_gender.pkl` : encoder fitur gender.
* `le_internet.pkl` : encoder fitur kualitas internet.
* `saved_model.pb` dan folder `variables/` : artefak TensorFlow SavedModel untuk deployment.
* `history.json` : riwayat proses training.
* `meta.json` : metadata model dan konfigurasi fitur.
* `training_curves.png` : visualisasi kurva pelatihan.
* `actual_vs_predicted.png` : visualisasi hasil evaluasi model.

### Space Repository (`snbpredict-space`)

Repository ini berisi layanan AI yang dijalankan pada Hugging Face Spaces.

```text
snbpredict-space/
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

Keterangan:

* `main.py` : entry point aplikasi FastAPI.
* `predict.py` : layanan prediksi berbasis Deep Learning.
* `narasi.py` : layanan generasi narasi menggunakan Gemini API.
* `interpreter.py` : modul interpretasi hasil prediksi.
* `prompt_engine.py` : generator prompt untuk berbagai persona pengguna.
* `requirements.txt` : daftar dependensi proyek.
* `Dockerfile` : konfigurasi container deployment.

---

## 5. Deep Learning Model

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

Model menerima 13 fitur input:

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

Model menghasilkan dua nilai prediksi:

* Productivity Score (0–100)
* Exam Score (0–100)

---

## 6. Generative AI Pipeline

### Interpreter Layer

Interpreter berfungsi mengubah data siswa dan hasil prediksi menjadi representasi yang lebih mudah dipahami melalui proses kategorisasi dan pelabelan kondisi siswa.

Beberapa aspek yang diinterpretasikan meliputi:

* Intensitas belajar
* Tingkat distraksi digital
* Kualitas tidur
* Kondisi kesehatan mental
* Tingkat burnout
* Tingkat fokus belajar
* Status performa akademik
* Tingkat risiko akademik

### Prompt Engine

Prompt Engine bertugas membangun prompt terstruktur berdasarkan hasil interpretasi data siswa.

Sistem menyediakan tiga persona utama:

* Guru/Wali Kelas
* Orang Tua
* Admin/Kepala Sekolah

Setiap persona memperoleh prompt yang disesuaikan dengan kebutuhan informasi dan tingkat pengambilan keputusan masing-masing.

### Gemini Integration

Prompt yang telah dibangun kemudian dikirim ke Google Gemini API untuk menghasilkan narasi otomatis dalam bahasa natural yang mudah dipahami oleh pengguna akhir.

---

## 7. Inference Flow

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

## 8. Running Locally

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variable

```bash
export GEMINI_API_KEY="your_api_key"
```

### Run FastAPI Service

```bash
uvicorn main:app --host 0.0.0.0 --port 7860
```

Setelah server berjalan, dokumentasi API dapat diakses melalui:

```text
http://localhost:7860/docs
```

---

## 9. Docker Deployment

### Build Image

```bash
docker build -t snbpredict-ai .
```

### Run Container

```bash
docker run -p 7860:7860 snbpredict-ai
```

---

## 10. Hugging Face Deployment

### Model Repository

Model Repository digunakan untuk menyimpan seluruh artefak hasil pelatihan model, termasuk:

* Deep Learning Model
* Feature Scaler
* Target Scaler
* Label Encoder
* Metadata Model

### Space Repository

Space Repository digunakan untuk menjalankan layanan inferensi dan Generative AI yang terdiri atas:

* FastAPI Service
* Prediction Service
* Narrative Generation Service
* Docker Configuration
* Hugging Face Deployment Configuration

---

## 11. Example Output

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

## 12. AI Engineer Contributions

### RC. Nurul A'la

* Developed the Generative AI pipeline for narrative generation.
* Designed prompt engineering strategies for insight generation.
* Built prediction interpretation logic and narrative workflows.
* Integrated Gemini API for automated explanation and recommendation generation.

### Daniel Fahlevi Bako

* Developed the Deep Learning prediction model.
* Implemented model training and evaluation workflows.
* Built prediction and inference services.
* Integrated Machine Learning and Generative AI components into a unified AI service.
* Managed Docker containerization and Hugging Face deployment.

