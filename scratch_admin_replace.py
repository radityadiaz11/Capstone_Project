import os
import re

admin_dir = r"d:\DICODING\Capstone_Project\frontend\src\pages\admin"

# Regex matches <button ...>...<span>Statistik SNBP</span>...</button> with any whitespace
pattern = re.compile(r'[ \t]*<button[^>]*navigate\([^)]*\'/admin/statistik\'[^)]*\)[^>]*>[\s\S]*?<span>Statistik SNBP</span>[\s\S]*?</button>\r?\n', re.IGNORECASE)

for filename in os.listdir(admin_dir):
    if filename.endswith(".jsx"):
        filepath = os.path.join(admin_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = pattern.sub("", content)
        
        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
