# Kế Hoạch Hoàn Chỉnh: Practical Documentation Hub
**Version 2.0 — Revised & Production-Ready**
**Cập nhật:** Dựa trên phân tích logic kế hoạch gốc, áp dụng framework SAC

---

## 1. Mục Tiêu & Phạm Vi

### Mục tiêu cốt lõi
Bổ sung tầng **"Tra cứu & Vận dụng"** vào hệ thống học tập hiện tại. Roadmap dạy người học *hiểu*; Documentation Hub giúp họ *làm ngay* mà không cần đọc lại toàn bộ lộ trình.

### Phạm vi: In scope
- 3 trang tài liệu riêng biệt: `docs-systema.html`, `docs-argos.html`, `docs-cognos.html`
- Mỗi trang dùng framework SAC (Scan – Act – Check)
- Tích hợp vào header của từng module (tab "Docs") — không phải floating button
- Kết nối 1 chiều với NEXUS Tracker: doc mở khoá khi người dùng pass phase tương ứng

### Phạm vi: Out of scope (không làm trong iteration này)
- Search across docs
- User-generated notes trong doc
- Export PDF từ doc page
- Mobile-first layout (desktop trước, mobile sau)

---

## 2. Framework SAC — Cấu Trúc Nội Dung Mỗi Trang

Thay thế framework "3S" bằng **SAC: Scan → Act → Check**

### Section 1: SCAN *(Nắm nhanh — đọc < 2 phút)*
**Mục đích:** Map toàn bộ khái niệm bằng visual. Người đọc không cần nhớ chi tiết — chỉ cần biết có gì ở đây để tìm lại.

Bao gồm:
- Visual cheat sheet (infographic hoặc bảng so sánh)
- Glossary ngắn: 8–12 thuật ngữ cốt lõi, mỗi cái ≤ 1 câu giải thích bằng ngôn ngữ đời thường (áp dụng Feynman: nếu cần tra từ điển để hiểu definition, definition đó phải viết lại)
- Mental model map: quan hệ giữa các khái niệm

**Tiêu chí chất lượng:** Người vừa pass quiz Phase 1 đọc section này phải nắm được framework tổng thể của toàn module mà không cần mở roadmap.

### Section 2: ACT *(Dùng ngay — theo tình huống)*
**Mục đích:** Playbook có thể execute ngay không cần suy nghĩ nhiều.

Cấu trúc mỗi "Play":
```
TÊN TÌNH HUỐNG
├── Trigger: Khi nào dùng play này?
├── Steps: 3–5 bước cụ thể (động từ + object, không vague)
├── Ví dụ thực: 1 case study từ thực tế (không fictional)
└── Pitfall: Lỗi phổ biến nhất cần tránh
```

Áp dụng 70-20-10: 70% content là scenario thực tế → 20% framework context → 10% theory reference. Không viết definition trước, scenario sau.

### Section 3: CHECK *(Kiểm tra output)*
**Mục đích:** Giúp người dùng tự đánh giá kết quả, không hứa "chắc chắn thành công".

Bao gồm:
- Checklist output (5–8 tiêu chí có/không) — được đặt tên chính xác: "Output Quality Checklist", không phải "Done Checklist"
- Anti-pattern gallery: 3–5 ví dụ "trông đúng nhưng sai" phổ biến nhất
- Self-assessment questions: 2–3 câu người dùng tự hỏi trước khi deploy/trình bày/quyết định

---

## 3. Nội Dung Theo Module

### SYSTEMA Documentation
**File:** `docs-systema.html`
**Theme:** Giữ nguyên dark amber aesthetic của SYSTEMA

**SCAN:**
- Cheat sheet: Stock vs Flow bảng phân loại với ví dụ từng loại
- Archetype reference cards: 8 archetypes — mỗi card có tên, 1 câu mô tả, 1 trigger signal ("khi bạn thấy...")
- CLD symbol guide: ký hiệu +/–, R/B loop, delay

**ACT — 4 Plays:**
1. *Chẩn đoán vấn đề lặp lại* (khi cùng 1 vấn đề quay lại > 2 lần)
2. *Map hệ thống mới* (khi gặp tình huống chưa hiểu rõ cơ chế)
3. *Tìm leverage point* (khi muốn can thiệp hiệu quả cao)
4. *Dự đoán unintended consequence* (trước khi ra quyết định lớn)

**CHECK:**
- CLD quality checklist: loops đóng không? delays được đánh dấu? variables đủ cụ thể?
- Anti-patterns: "vẽ flowchart thay vì CLD", "bỏ qua delays", "confuse correlation với causation trong loop"

---

### ARGOS Documentation
**File:** `docs-argos.html`
**Theme:** Giữ nguyên cream/ink editorial aesthetic của ARGOS

**SCAN:**
- Fallacy quick-reference: 12 fallacy phổ biến — tên, 1 ví dụ câu, 1 câu nhận diện
- Toulmin model visual: 6 thành phần với vai trò từng thành phần
- SCQA structure reminder: 4 ô với câu hỏi trigger cho từng ô

**ACT — 4 Plays:**
1. *Phân tích và phản bác 1 lập luận* (debate, meeting, email)
2. *Cấu trúc pitch nhanh* (< 30 phút chuẩn bị, dùng SCQA)
3. *Xử lý objection bất ngờ* (trong live session)
4. *Steel-man trước khi quyết định* (khi sắp ra quyết định lớn có rủi ro)

**CHECK:**
- Pitch quality checklist: có hook? evidence cụ thể? ask rõ ràng? pre-address objection?
- Anti-patterns: "argument ad hominem ẩn", "SCQA thiếu complication", "evidence là anecdote"

---

### COGNOS Documentation
**File:** `docs-cognos.html`
**Theme:** Giữ nguyên dark cyan/neural aesthetic của COGNOS

**SCAN:**
- AI task classification matrix: 2x2 grid (Stakes cao/thấp × AI reliability cao/thấp) → 4 quadrants với action cho mỗi ô
- Prompt component quick-ref: RCTFC với 1 ví dụ xấu và 1 ví dụ tốt cho mỗi thành phần
- 7 AI traps: tên + 1 câu nhận diện dấu hiệu

**ACT — 4 Plays:**
1. *Verify AI output nhanh* (khi nhận output và cần quyết định tin bao nhiêu)
2. *Viết prompt cho task phức tạp* (khi default prompt cho kết quả tệ)
3. *Audit AI workflow hiện tại* (khi muốn review risk)
4. *Evaluate AI tool mới* (trước khi adopt)

**CHECK:**
- AI output checklist: accuracy, completeness, relevance, bias
- Anti-patterns: "tin vì confident tone", "không verify vì deadline", "input sensitive data"

---

## 4. UI/UX Specification

### Access Pattern: Tab trong Header (không floating button)

Mỗi module header thêm tab "Docs" bên cạnh nav links hiện tại:
```
// SYSTEMA header nav hiện tại:
[Lộ Trình] [KPI] [Nguyên Tắc] [Tiến Độ]

// Sau khi thêm:
[Lộ Trình] [KPI] [Nguyên Tắc] [Tiến Độ] | [📋 Docs]
```

Tab "Docs" click → mở panel slide-in từ phải (drawer, width 480px trên desktop).

### Drawer Design Rules
- **Background:** match module (dark surface cho SYSTEMA/COGNOS, cream cho ARGOS)
- **No glassmorphism** — giữ flat design nhất quán với toàn hệ thống
- **Side navigation bên trong drawer:** Scan | Act | Check — 3 tabs con
- **Overlay:** semi-transparent dark overlay (không block scroll background)
- **Close:** click ngoài drawer hoặc nút X góc trên phải

### Lock/Unlock Logic
Doc section bị lock nếu người dùng chưa pass phase tương ứng trong NEXUS:
- SCAN: Unlock sau Phase 1
- ACT: Unlock sau Phase 2
- CHECK: Unlock sau Phase 3

Locked section hiển thị blur + badge "Unlock sau khi pass Phase X". Điều này tạo incentive học theo thứ tự.

---

## 5. Technical Implementation

### File Structure
```
/
├── systema-roadmap.html         (existing)
├── argos-roadmap.html           (existing)
├── cognos-roadmap.html          (existing — mới tạo)
├── nexus-tracker.html           (existing)
├── index.html                   (homepage — existing)
│
├── docs-systema.html            (NEW)
├── docs-argos.html              (NEW)
└── docs-cognos.html             (NEW)
```

### Shared Components (copy-paste, không shared file)
Vì là pure HTML/CSS/JS, dùng pattern copy-paste cho:
- Drawer HTML structure
- Drawer CSS (adapted per module color)
- Lock/unlock logic via localStorage

### localStorage Keys (extend NEXUS pattern)
```javascript
// Đọc từ keys của NEXUS Tracker
'nexus_data_[username]' → .systema.phasesPassed → array of passed phases

// Doc page đọc key này để determine what to unlock
// Nếu user chưa login NEXUS, tất cả sections locked
```

### No new dependencies
Giữ pure HTML/CSS/JS, không thêm framework hay library. Tất cả drawer animation dùng CSS transition.

---

## 6. Workflow Thực Thi (5 Bước, Có Tiêu Chí Rõ Ràng)

### Bước 1: Content First (trước khi code)
**Output:** Google Doc hoặc Notion page với nội dung SAC đầy đủ cho SYSTEMA
**Tiêu chí done:** Mỗi "Play" trong ACT có đủ: Trigger + Steps + Ví dụ thực + Pitfall
**Thời gian ước tính:** 4–6 giờ

### Bước 2: Template code `docs-template.html`
**Output:** File HTML với drawer structure, SAC tabs, lock/unlock logic
**Tiêu chí done:** Drawer mở/đóng mượt, lock logic hoạt động với localStorage mock data
**Thời gian ước tính:** 2–3 giờ

### Bước 3: Pilot — `docs-systema.html`
**Output:** File hoàn chỉnh với đầy đủ nội dung SAC theo SYSTEMA theme
**Tiêu chí done:** File pass user test (xem Bước 4)
**Thời gian ước tính:** 3–4 giờ

### Bước 4: User Test (không bỏ qua)
**Người test:** Người vừa pass Phase 2 của SYSTEMA, chưa từng đọc doc này
**Task giao:** "Dùng doc này để phân tích 1 vấn đề thực trong công việc của bạn"
**Metric:**
- PASS: Hoàn thành task, mở roadmap ≤ 2 lần
- FAIL: Mở roadmap > 2 lần → identify section nào bị thiếu → viết lại
**Thời gian test:** 45–60 phút

### Bước 5: Rollout ARGOS và COGNOS
Chỉ bắt đầu sau khi `docs-systema.html` pass user test. Áp dụng cùng template, điều chỉnh:
- Color theme
- Content theo module
- Specific anti-patterns

---

## 7. Verification Plan (Có Tiêu Chí Đo Được)

### Tiêu chí PASS cho từng section
| Section | Pass nếu | Fail nếu |
|---|---|---|
| SCAN | Người đọc giải thích được framework tổng thể sau 2 phút đọc, không cần mở roadmap | Cần tra glossary trong roadmap để hiểu ≥ 2 thuật ngữ trong SCAN |
| ACT | Người dùng complete 1 play end-to-end mà không stuck ở bước nào > 5 phút | Bất kỳ bước nào vague đến mức người dùng không biết phải làm gì cụ thể |
| CHECK | Người dùng tự identify được ≥ 1 lỗi trong output của mình sau khi dùng checklist | Checklist pass nhưng output vẫn có lỗi rõ ràng (checklist missed something important) |

### Review Cycle
- **Sau launch:** Collect feedback sau 2 tuần dùng thực tế
- **Update trigger:** Nếu ≥ 3 người report cùng 1 điểm confusing → update trong 48h
- **Major revision:** Mỗi khi roadmap update phase content, doc tương ứng cần review

---

## 8. Rủi Ro & Mitigation

| Rủi Ro | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content doc quá dài, người dùng không đọc | Cao | Cao | Hard limit: SCAN ≤ 1 scroll, mỗi Play ≤ 200 chữ |
| Lock logic không đồng bộ với NEXUS (khác browser) | Trung bình | Thấp | Fallback: nếu không tìm thấy NEXUS data → hiện tất cả unlocked (prefer usability over strict gate) |
| Doc nhanh outdated khi roadmap update | Trung bình | Trung bình | Version number trong doc, ghi rõ "Updated: [date]", review trigger khi roadmap thay đổi |
| Drawer UX conflict trên mobile | Trung bình | Thấp | Mobile: full-screen sheet thay vì side drawer; để lại cho iteration 2 |

---

## 9. Thứ Tự Ưu Tiên Tuyệt Đối

Nếu chỉ có thể làm 1 thứ: **Content SYSTEMA-ACT section** — đây là phần có giá trị cao nhất và test được ngay với người học thực.

Nếu có thể làm 2 thứ: Thêm **SYSTEMA-SCAN cheat sheet** (visual, nhanh, high impact).

Nếu có thể làm 3 thứ: Thêm **Template drawer code** để có thể reuse cho ARGOS và COGNOS.

---

*Kế hoạch này sẵn sàng để execute. Bước tiếp theo khuyến nghị: bắt đầu với Bước 1 (content writing) cho SYSTEMA-ACT, không phải code.*