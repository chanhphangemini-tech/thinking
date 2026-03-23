---
name: thinking-ai-agent
description: >
  Skill tổng hợp cho AI Agent làm việc với dự án Thinking AI (ARGOS / COGNOS / SYSTEMA).
  Kích hoạt khi: viết code mới, sửa lỗi, QA, thêm tính năng, refactor, hay bất kỳ thay đổi
  nào vào codebase. Agent phải đọc skill này TRƯỚC KHI chạm vào bất kỳ file nào.
version: "2.0"
project: thinking/
stack: HTML · CSS · Vanilla JS
---

# THINKING AI — AGENT SKILL

> **Nguyên tắc vàng:** Không bao giờ giả định. Luôn đọc → suy nghĩ → kiểm tra → hành động → ghi nhớ.

---

## 0. KHỞI ĐỘNG BẮT BUỘC (Chạy mỗi phiên)

Trước khi làm bất cứ điều gì, agent phải chạy 3 lệnh sau:

```bash
# 1. Đọc bộ nhớ dài hạn — biết project đang ở trạng thái nào
cat thinking/PLAN.md

# 2. Đọc nhật ký lỗi đã từng gặp — tránh lặp lại sai lầm
cat thinking/SKILL.md   # (file này)

# 3. Snapshot nhanh cấu trúc hiện tại
find thinking/ -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) \
  | grep -v ".git" | sort
```

Nếu thiếu bất kỳ lệnh nào → **DỪNG, không code**, báo lại cho user.

---

## 1. TRÍ NHỚ DÀI HẠN VĨNH VIỄN

### 1.1 Cơ chế hoạt động

Agent **không có RAM giữa các phiên**. Mọi kiến thức đều phải sống trong 2 file:

| File | Mục đích |
|------|----------|
| `thinking/PLAN.md` | Trạng thái dự án, quyết định kiến trúc, việc cần làm |
| `thinking/SKILL.md` | Bài học từ lỗi, pattern hay dùng, quy ước dự án |

### 1.2 Khi nào phải update

Sau **mỗi hành động có kết quả** (dù thành công hay thất bại), agent update ngay:

```
THÀNH CÔNG → Ghi vào PLAN.md: ✅ [task] — xong, lý do, side effect nếu có
LỖI        → Ghi vào SKILL.md phần §7: ❌ [lỗi] — nguyên nhân gốc — cách fix đúng
QUYẾT ĐỊNH → Ghi vào PLAN.md: 🔧 [lý do chọn approach này thay vì X]
```

### 1.3 Format ghi nhớ chuẩn

```markdown
## [YYYY-MM-DD] Phiên làm việc

### Đã làm
- ✅ Thêm dark mode toggle vào navigation.js — dùng CSS custom property --theme

### Lỗi gặp & fix
- ❌ argos.js: querySelector trả null khi DOM chưa load
  Root cause: script chạy trước DOMContentLoaded
  Fix: bọc trong `document.addEventListener('DOMContentLoaded', ...)`
  Lesson: LUÔN kiểm tra DOM ready trước khi query

### Việc tiếp theo
- [ ] QA responsive trên mobile cho systems.html
```

---

## 2. TỰ HỌC — HỆ THỐNG TRÁNH LẶP LỖI

### 2.1 Vòng lặp học tập (mỗi lần fix bug)

```
1. DIAGNOSE  → Xác định chính xác dòng lỗi, không đoán mò
2. ROOT CAUSE → Hỏi "Tại sao xảy ra?" 3 lần (5 Whys rút gọn)
3. FIX        → Fix đúng gốc, không patch triệu chứng
4. VERIFY     → Chạy lại test case gốc + 2 edge case liền kề
5. GENERALIZE → "Lỗi này có thể xuất hiện ở đâu khác không?"
6. RECORD     → Ghi vào §7 của SKILL.md này
```

### 2.2 Pattern nhận biết lỗi hệ thống (dự án này)

Những lỗi từng xảy ra — **KIỂM TRA TRƯỚC khi code tương tự**:

```
[DOM] querySelector → null       → Kiểm tra DOMContentLoaded / element tồn tại không
[CSS] class không apply          → Kiểm tra specificity conflict, typo class name
[JS]  undefined is not a function → Kiểm tra import order, function scope
[NAV] link không hoạt động      → Kiểm tra navigation.js đã load đúng thứ tự chưa
[CSS] mobile layout vỡ          → Kiểm tra viewport meta tag, breakpoint order
```

*(Cập nhật phần này mỗi khi tìm ra lỗi mới)*

### 2.3 Code review tự động (self-review checklist)

Sau khi viết xong code, agent tự hỏi:

```
□ Có side effect nào lên file khác không?
□ Có hard-code giá trị nào nên là variable không?
□ Có lặp lại code đã có ở file khác không? (DRY)
□ Nếu user refresh trang, có còn đúng không?
□ Nếu JS bị tắt, có fallback không?
```

---

## 3. TƯ DUY IF-ELSE ĐA TẦNG — KIỂM TRA TRƯỚC KHI LƯU

### 3.1 Quy trình bắt buộc trước mỗi lần ghi file

```
TẦNG 1 — SYNTAX CHECK
  IF (có lỗi cú pháp) → Fix ngay, KHÔNG lưu
  ELSE → Tiếp tục tầng 2

TẦNG 2 — LOGIC CHECK  
  IF (logic có trường hợp null/undefined chưa handle) → Thêm guard clause
  IF (có vòng lặp vô hạn tiềm ẩn) → Fix
  ELSE → Tiếp tục tầng 3

TẦNG 3 — INTEGRATION CHECK
  IF (thay đổi ảnh hưởng file khác) → Kiểm tra file đó trước
  IF (xóa/đổi tên class CSS) → Tìm kiếm toàn bộ project xem đâu dùng class đó
  ELSE → Tiếp tục tầng 4

TẦNG 4 — REGRESSION CHECK
  IF (feature cũ vẫn hoạt động) → OK, lưu file
  ELSE → Fix regression trước khi lưu
```

### 3.2 Template code có guard clause (dùng cho JS)

```javascript
// ✅ ĐÚNG — luôn check trước khi dùng
function safeInit(selector, callback) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`[SKILL] Element not found: ${selector}`);
    return; // fail gracefully
  }
  if (typeof callback !== 'function') {
    console.error(`[SKILL] callback must be a function`);
    return;
  }
  callback(el);
}

// ❌ SAI — không check
document.querySelector('#btn').addEventListener('click', handler);
```

### 3.3 Error boundary cho async code

```javascript
// Template chuẩn cho mọi fetch/async trong dự án
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error('[THINKING-AI] Fetch failed:', err.message);
    return { ok: false, error: err.message };
  }
}
// Luôn dùng: const { ok, data } = await fetchData(url)
// Không bao giờ dùng: const data = await fetch(url).then(r => r.json())
```

---

## 4. QUY ƯỚC DỰ ÁN (Project Conventions)

### 4.1 Cấu trúc file

```
thinking/
├── index.html          ← Home page
├── PLAN.md             ← Trạng thái & roadmap (AGENT GHI VÀO ĐÂY)
├── SKILL.md            ← Bài học & quy ước (AGENT CẬP NHẬT ĐÂY)
├── css/
│   ├── base.css        ← Reset + CSS variables toàn cục
│   ├── argos.css       ← Styles cho module ARGOS
│   ├── cognos.css      ← Styles cho module COGNOS
│   ├── systems.css     ← Styles cho module SYSTEMA
│   ├── home.css        ← Styles cho trang chủ
│   └── profile.css     ← Styles cho trang profile
├── js/
│   ├── navigation.js   ← LOAD ĐẦU TIÊN — điều hướng chung
│   ├── nexus.js        ← Core logic / state management
│   ├── argos.js        ← Logic ARGOS module
│   ├── cognos.js       ← Logic COGNOS module
│   ├── systems.js      ← Logic SYSTEMA module
│   └── profile.js      ← Logic profile
└── docs-*.html         ← Documentation pages
```

### 4.2 Thứ tự load script (QUAN TRỌNG — không được đổi)

```html
<!-- Thứ tự đúng trong mọi HTML file -->
<link rel="stylesheet" href="css/base.css">      <!-- 1. Base styles trước -->
<link rel="stylesheet" href="css/[module].css">  <!-- 2. Module styles -->
...
<script src="js/navigation.js"></script>         <!-- 3. Nav trước -->
<script src="js/nexus.js"></script>              <!-- 4. Core state -->
<script src="js/[module].js"></script>           <!-- 5. Module logic sau -->
```

### 4.3 CSS naming convention

```css
/* Module prefix để tránh conflict */
.argos-card { }      /* ARGOS components */
.cognos-node { }     /* COGNOS components */
.sys-diagram { }     /* SYSTEMA components */
.nav-item { }        /* Navigation */
.u-hidden { }        /* Utility classes — prefix u- */

/* CSS Custom Properties (sống trong base.css) */
--color-primary: ;
--color-accent: ;
--spacing-md: ;
--font-body: ;
```

### 4.4 Commit message format

```
feat(argos): thêm timeline visualization
fix(nav): sửa active state không highlight đúng
refactor(cognos): tách cognitive-map thành component riêng
docs: cập nhật PLAN.md với thiết kế phase 2
style(base): align spacing variables với design system
```

---

## 5. QUYẾT ĐỊNH THÔNG MINH — KHÔNG HỎI USER NHỮNG GÌ CÓ THỂ SUY RA

### 5.1 Khi nào TỰ quyết định

Agent tự quyết (không hỏi) khi:
- Sửa lỗi rõ ràng (typo, null check thiếu, broken selector)
- Thêm code theo pattern đã có trong project
- Refactor không thay đổi behavior
- Format/indent code

### 5.2 Khi nào PHẢI hỏi user

Agent dừng lại và hỏi khi:
- Thay đổi kiến trúc (thêm/xóa module)
- Đổi design/layout đáng kể
- Xóa tính năng (dù trông có vẻ không dùng)
- Thêm dependency/thư viện mới
- Không chắc chắn về yêu cầu business

### 5.3 Template hỏi nhanh (1 câu, không dài dòng)

```
"[Tên vấn đề]: Tôi thấy [A] hoặc [B]. Bạn muốn hướng nào?"
```

---

## 6. WORKFLOW CODING CHUẨN (Step-by-step)

```
BƯỚC 1 — ĐỌC CONTEXT
  cat thinking/PLAN.md                    # biết project đang ở đâu
  cat thinking/[file-liên-quan]           # đọc file sẽ sửa

BƯỚC 2 — PHÂN TÍCH
  - Xác định chính xác cần làm gì
  - List ra các file sẽ bị ảnh hưởng
  - Kiểm tra §7 (Lỗi đã biết) có pattern nào match không

BƯỚC 3 — CODE
  - Viết code theo convention §4
  - Áp dụng if-else đa tầng §3.1 trong đầu khi viết

BƯỚC 4 — SELF-REVIEW (§2.3 checklist)
  - Chạy qua 5 câu hỏi tự review
  - Nếu fail bất kỳ câu nào → quay về Bước 3

BƯỚC 5 — LƯU VÀ CẬP NHẬT BỘ NHỚ
  - Lưu file code
  - Update PLAN.md: ghi task đã xong
  - Update SKILL.md §7 nếu phát hiện lỗi mới

BƯỚC 6 — BÁO CÁO NGẮN CHO USER
  Format: "✅ Đã [làm gì]. [1 dòng side note nếu cần]."
  Không giải thích dài, không hỏi "bạn có muốn tôi làm thêm không?"
```

---

## 7. NHẬT KÝ LỖI ĐÃ BIẾT (Agent cập nhật liên tục)

> Đây là "bộ nhớ miễn dịch" của dự án. Mỗi lỗi mới = 1 entry mới.

### Template thêm entry

```
### ❌ [Tên lỗi ngắn gọn]
- **File:** [file xảy ra]
- **Triệu chứng:** [user thấy gì / console báo gì]
- **Root cause:** [lý do thực sự]
- **Fix:** [cách fix đúng]
- **Phòng tránh:** [làm gì để không xảy ra lại]
- **Date:** YYYY-MM-DD
```

### ❌ [PLACEHOLDER] Script load order
- **File:** Mọi HTML
- **Triệu chứng:** Function undefined / querySelector null
- **Root cause:** JS chạy trước DOM ready hoặc trước script dependency
- **Fix:** Kiểm tra thứ tự load theo §4.2; bọc code trong DOMContentLoaded
- **Phòng tránh:** Luôn đặt scripts theo đúng thứ tự §4.2
- **Date:** 2026-03-23

### ❌ SVG Text Overflow
- **File:** `docs-argos.html` (và mọi SVG diagram)
- **Triệu chứng:** Văn bản dài tràn ra ngoài khung hoặc bị cắt mất.
- **Root cause:** SVG `<text>` không tự động xuống dòng (word-wrap).
- **Fix:** Dùng `<foreignObject>` kết hợp với HTML `div` và CSS Flexbox/text-align.
- **Phòng tránh:** Ưu tiên `<foreignObject>` cho các khối văn bản có độ dài biến thiên trong SVG.
- **Date:** 2026-03-23

---

## 8. NGUYÊN TẮC VIBE CODING — ĐỂ USER NHÀN HƠN

### 8.1 Proactive, không reactive

- Khi sửa 1 bug → **tự kiểm tra file liên quan** xem có lỗi tương tự không, fix luôn
- Khi thêm feature → **tự viết comment** giải thích intent, không để user phải hỏi
- Khi thấy code smell → **note vào PLAN.md** mục "Tech debt" để xử lý sau

### 8.2 Output ngắn gọn, hành động nhiều

```
❌ "Tôi sẽ phân tích yêu cầu của bạn và đưa ra các phương án..."
✅ [Làm xong, báo 1-2 dòng]
```

### 8.3 Batch changes thông minh

Nếu user bảo "sửa bug X" và agent thấy bug Y gần đó → fix cả hai, báo:
> "✅ Fix X. Thấy Y ở cạnh, fix luôn."

### 8.4 Đừng hỏi những gì có thể đọc

- Trước khi hỏi "file này đang dùng để làm gì?" → **đọc file đó đi**
- Trước khi hỏi "convention là gì?" → **đọc các file hiện có đi**

---

## 9. KIẾN TRÚC DỰ ÁN — BIG PICTURE

```
THINKING AI
├── ARGOS    → Observation layer (thu thập, phân tích dữ liệu)
├── COGNOS   → Cognitive layer  (xử lý, kết nối tri thức)
└── SYSTEMA  → Systems layer    (tư duy hệ thống, mô hình hóa)

Core flow: Input → ARGOS → COGNOS → SYSTEMA → Output/Visualization

Navigation: navigation.js điều phối routing giữa các module
State:      nexus.js giữ shared state toàn app
```

*(Agent cập nhật section này nếu kiến trúc thay đổi)*

---

## 10. KHI GẶP TÌNH HUỐNG KHÔNG BIẾT XỬ LÝ

```
1. DỪNG — không đoán mò
2. Đọc lại §7 (lỗi đã biết) xem có match không
3. Đọc file liên quan để hiểu context
4. Nếu vẫn không chắc → hỏi user 1 câu ngắn gọn (§5.3)
5. Không bao giờ "thử xem sao" với production code
```

---

*Agent đọc xong file này → sẵn sàng làm việc. Update file này sau mỗi phiên.*