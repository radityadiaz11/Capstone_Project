
def interpret_data_siswa(raw: dict) -> dict:
    hasil = raw.copy()

    # 1. Total jam belajar (study + self_study + online)
    total_belajar = (
        raw["study_hours"] +
        raw["self_study_hours"] +
        raw["online_classes_hours"]
    )
    hasil["total_jam_belajar"] = round(total_belajar, 2)

    if total_belajar >= 10:
        hasil["label_belajar"] = "sangat tinggi"
    elif total_belajar >= 7:
        hasil["label_belajar"] = "cukup baik"
    elif total_belajar >= 4:
        hasil["label_belajar"] = "rendah"
    else:
        hasil["label_belajar"] = "sangat rendah dan mengkhawatirkan"

    # 2. Distraksi digital (sosmed + gaming)
    total_distraksi = raw["social_media_hours"] + raw["gaming_hours"]
    hasil["total_jam_distraksi"] = round(total_distraksi, 2)

    if total_distraksi >= 7:
        hasil["label_distraksi"] = "sangat tinggi"
    elif total_distraksi >= 5:
        hasil["label_distraksi"] = "tinggi"
    elif total_distraksi >= 3:
        hasil["label_distraksi"] = "sedang"
    else:
        hasil["label_distraksi"] = "rendah dan terkontrol"

    # 3. Kualitas tidur
    if raw["sleep_hours"] >= 8:
        hasil["label_tidur"] = "ideal"
    elif raw["sleep_hours"] >= 6:
        hasil["label_tidur"] = "cukup"
    else:
        hasil["label_tidur"] = "kurang dan berisiko"

    # 4. Kesehatan mental (range 0-11, mean=4.97)
    if raw["mental_health_score"] >= 8:
        hasil["label_mental"] = "baik"
    elif raw["mental_health_score"] >= 4:
        hasil["label_mental"] = "cukup"
    else:
        hasil["label_mental"] = "memerlukan perhatian serius"

    # 5. Burnout (range 0-77, mean=13.28)
    if raw["burnout_level"] >= 40:
        hasil["label_burnout"] = "tinggi"
    elif raw["burnout_level"] >= 15:
        hasil["label_burnout"] = "sedang"
    else:
        hasil["label_burnout"] = "rendah"

    # 6. Focus index (range 0-60, mean=14.53)
    if raw["focus_index"] >= 30:
        hasil["label_fokus"] = "tinggi"
    elif raw["focus_index"] >= 10:
        hasil["label_fokus"] = "sedang"
    else:
        hasil["label_fokus"] = "rendah"

    # 7. Performa & risiko dari exam_score (range 0-100, mean=36)
    score = raw["exam_score"]
    if score >= 65:
        hasil["label_performa"] = "baik"
        hasil["label_risiko"]   = "aman"
    elif score >= 35:
        hasil["label_performa"] = "cukup"
        hasil["label_risiko"]   = "perlu perhatian"
    else:
        hasil["label_performa"] = "memerlukan intervensi segera"
        hasil["label_risiko"]   = "berisiko"

    return hasil
