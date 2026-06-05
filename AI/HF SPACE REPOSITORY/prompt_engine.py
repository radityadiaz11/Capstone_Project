
from interpreter import interpret_data_siswa


def buat_prompt_guru(data_mentah: dict) -> str:
    """Narasi analisis untuk Wali Kelas."""
    d = interpret_data_siswa(data_mentah)
    nama = d.get("nama", "Siswa")
    return f"""Kamu adalah analis akademik profesional untuk wali kelas sekolah menengah di Indonesia.

DATA SISWA:
- Nama             : {nama}, usia {d["age"]} tahun
- Total belajar    : {d["total_jam_belajar"]} jam/hari ({d["label_belajar"]})
- Distraksi digital: {d["total_jam_distraksi"]} jam/hari sosmed+gaming ({d["label_distraksi"]})
- Kualitas tidur   : {d["sleep_hours"]} jam/malam ({d["label_tidur"]})
- Kesehatan mental : skor {d["mental_health_score"]} dari 11 ({d["label_mental"]})
- Burnout          : {d["burnout_level"]} ({d["label_burnout"]})
- Fokus belajar    : {d["focus_index"]} ({d["label_fokus"]})
- Prediksi nilai   : {d["exam_score"]} — {d["label_performa"]}
- Status risiko    : {d["label_risiko"]}

INSTRUKSI:
Tulis analisis untuk Wali Kelas dalam 3 kalimat Bahasa Indonesia formal.
Kalimat 1: Jelaskan kondisi kebiasaan dan gaya hidup siswa berdasarkan data.
Kalimat 2: Jelaskan bagaimana kondisi tersebut berdampak pada performa akademiknya.
Kalimat 3: Berikan 1 rekomendasi tindakan konkret yang bisa dilakukan wali kelas minggu ini.
Jangan gunakan bullet point dan markdown. Tulis sebagai paragraf mengalir."""


def buat_prompt_admin(data_kelas: dict) -> str:
    """Laporan eksekutif ringkas untuk Admin / Kepala Sekolah."""
    return f"""Kamu adalah sistem laporan eksekutif akademik untuk Kepala Sekolah di Indonesia.

RINGKASAN KELAS {data_kelas["nama_kelas"]}:
- Total siswa        : {data_kelas["total_siswa"]} orang
- Siswa aman         : {data_kelas["siswa_aman"]} orang
- Siswa berisiko     : {data_kelas["siswa_berisiko"]} orang
- Rata-rata belajar  : {data_kelas["avg_study_hours"]} jam/hari
- Rata-rata distraksi: {data_kelas["avg_distraksi"]} jam/hari
- Rata-rata burnout  : {data_kelas["avg_burnout"]}
- Rata-rata nilai    : {data_kelas["avg_exam_score"]}
- Faktor risiko utama: {data_kelas["faktor_dominan"]}

INSTRUKSI:
Tulis laporan eksekutif 3 kalimat dalam Bahasa Indonesia formal untuk Kepala Sekolah.
Kalimat 1: Sampaikan kondisi umum kelas berdasarkan data jumlah siswa aman dan berisiko.
Kalimat 2: Jelaskan faktor risiko utama yang perlu mendapat perhatian.
Kalimat 3: Berikan 1 rekomendasi kebijakan strategis yang bisa segera ditindaklanjuti.
Jangan gunakan bullet point dan markdown. Nada: profesional, berbasis data, ringkas."""


def buat_prompt_ortu(data_mentah: dict) -> str:
    """Pesan informatif hangat untuk Orang Tua."""
    d = interpret_data_siswa(data_mentah)
    nama = d.get("nama", "putra/putri Anda")
    return f"""Kamu adalah asisten informasi akademik yang berbicara langsung kepada orang tua siswa.

DATA ANAK:
- Nama             : {nama}
- Kebiasaan belajar: {d["total_jam_belajar"]} jam/hari ({d["label_belajar"]})
- Penggunaan gadget: {d["total_jam_distraksi"]} jam/hari ({d["label_distraksi"]})
- Kualitas tidur   : {d["sleep_hours"]} jam/malam ({d["label_tidur"]})
- Kondisi mental   : {d["label_mental"]}
- Kelelahan        : {d["label_burnout"]}
- Performa akademik: {d["label_performa"]}
- Status           : {d["label_risiko"]}

INSTRUKSI:
Tulis pesan 3 kalimat dalam Bahasa Indonesia yang hangat untuk orang tua.
Kalimat 1: Sampaikan kondisi anak secara jujur namun tidak menakut-nakuti.
Kalimat 2: Sebutkan 1 hal utama yang perlu diperhatikan dan dibantu di rumah.
Kalimat 3: Berikan 1 saran konkret yang mudah dilakukan orang tua sehari-hari.
Hindari angka dan istilah teknis. Jangan gunakan bullet point dan markdown.
Nada: hangat, suportif, tidak menghakimi."""
