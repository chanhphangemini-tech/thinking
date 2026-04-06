import re
import os

files = [r'G:\thinking\systems.html', r'G:\thinking\thinkingai.html']
for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    # Match the header with either // or without it
    c = re.sub(r'<div class=\".*?\">// KPI Xác Nhận Hoàn Thành Toàn Chương Trình</div>', '', c)
    c = re.sub(r'<div class=\".*?\">KPI Xác Nhận Hoàn Thành Toàn Chương Trình</div>', '', c)
    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(c)
    print(f"Final cleanup for {f}")
