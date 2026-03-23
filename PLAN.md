# THINKING AI — PLAN.md
> Bộ nhớ dài hạn của dự án. Agent đọc file này TRƯỚC KHI làm bất cứ điều gì.
> Format cập nhật: `[YYYY-MM-DD] ✅/🔧/❌ Mô tả`

---

## 🗺️ KIẾN TRÚC TỔNG QUAN

```
THINKING AI — Web App tư duy hệ thống
├── ARGOS    → Quan sát & phân tích (docs-argos.html / js/argos.js)
├── COGNOS   → Xử lý nhận thức     (docs-cognos.html / js/cognos.js)
└── SYSTEMA  → Tư duy hệ thống     (docs-systema.html / js/systems.js)

Entry points:
  index.html        → Trang chủ / landing
  thinkingai.html   → App chính
  pitching.html     → Pitch deck / giới thiệu
  Profile.html      → Trang cá nhân
  systems.html      → SYSTEMA module

Shared:
  js/navigation.js  → Routing & điều hướng (load ĐẦU TIÊN)
  js/nexus.js       → Core state management
  css/base.css      → CSS variables & reset toàn cục
```

---

## 📌 TRẠNG THÁI HIỆN TẠI

**Phase:** 1 — Foundation & Core Modules  
**Status:** 🔄 Đang phát triển  
**Ghi chú gần nhất:** "Docs Final — Completely redesigned ARGOS Phase 1 with new diagrams and structure"

### Files đã có
| File | Trạng thái |
|------|-----------|
| index.html | ✅ Có |
| thinkingai.html | ✅ Có |
| pitching.html | ✅ Có |
| Profile.html | ✅ Có |
| systems.html | ✅ Có |
| docs-argos.html | ✅ Redesigned Phase 1 |
| docs-cognos.html | ✅ Có |
| docs-systema.html | ✅ Có |
| css/base.css | ✅ Có |
| css/argos.css | ✅ Có |
| css/cognos.css | ✅ Có |
| css/systems.css | ✅ Có |
| css/home.css | ✅ Có |
| css/profile.css | ✅ Có |
| js/navigation.js | ✅ Có |
| js/nexus.js | ✅ Có |
| js/argos.js | ✅ Có |
| js/cognos.js | ✅ Có |
| js/systems.js | ✅ Có |
| js/profile.js | ✅ Có |

---

## 🎯 ROADMAP

### Phase 1 — Foundation (hiện tại)
- [x] Thiết kế lại ARGOS docs với diagrams và structure mới
- [x] Fix text overflow in ARGOS Stage 1 diagram 1 & 3
- [x] Fix layout break (stray </div>) in ARGOS docs
- [x] Add "Building Valid and Sound Arguments" guide (Section 5)
- [x] Enhance Phase 2 (Socratic Scenarios & Bias Examples)
- [ ] QA cross-module navigation (navigation.js hoạt động đúng giữa các trang)
- [ ] Responsive QA toàn bộ trên mobile
- [ ] Đồng bộ design system — kiểm tra base.css variables dùng nhất quán chưa

### Phase 2 — Enhancement
- [ ] *(Điền khi Phase 1 xong)*

### Tech Debt (biết là cần làm, chưa làm)
- [ ] tmp/ có 4 script cleanup — kiểm tra đã chạy chưa hay còn cần
- [ ] Kiểm tra có file nào còn hard-code màu sắc thay vì dùng CSS variable không
- **Fix:** Dùng `<foreignObject>` kết hợp với HTML `div` và CSS Flexbox/text-align.
- **Phòng tránh:** Ưu tiên `<foreignObject>` cho các khối văn bản có độ dài biến thiên trong SVG. Sau khi sửa SVG, LUÔN LUÔN check kỹ balance của thẻ `</div>` để tránh vỡ layout toàn trang.
- **Date:** 2026-03-23

---

## 📝 NHẬT KÝ PHIÊN LÀM VIỆC

### [2025-XX-XX] Khởi tạo PLAN.md
- 🔧 Tạo PLAN.md từ snapshot cấu trúc project
- 🔧 Tạo SKILL.md v2.0 với hệ thống trí nhớ dài hạn + if-else đa tầng
- ✅ Fix text overflow in `docs-argos.html` (Mục 1 & 3).
- ✅ Fix broken layout in `docs-argos.html` caused by accidental extra `</div>` nesting.
- ✅ Bổ sung Mục 5: "Quy trình xây dựng Lập luận Valid & Sound".
- ✅ Làm "vivid" Giai đoạn 02: Thêm kịch bản Socratic thực tế, ví dụ đời thực cho Biases và đồng bộ UI Step badges.

---

## ⚠️ QUYẾT ĐỊNH KIẾN TRÚC ĐÃ CHỐT

*(Agent ghi vào đây mỗi khi có quyết định quan trọng về thiết kế)*

| Quyết định | Lý do | Ngày |
|-----------|-------|------|
| navigation.js load trước mọi script | Đảm bảo routing sẵn sàng trước khi module khởi tạo | — |
| CSS per-module (argos/cognos/systems) | Tránh conflict, dễ maintain độc lập | — |

---

*Agent: Sau mỗi phiên, thêm entry vào mục "Nhật ký" và cập nhật "Trạng thái hiện tại" nếu có thay đổi.*