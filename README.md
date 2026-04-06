# Thinking AI - Nền Tảng Học Tập Tư Duy

<div align="center">
  <img src="public/logo.svg" alt="Thinking AI Logo" width="120" height="120">
  
  <h3>Nâng cấp tư duy mỗi ngày</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
</div>

---

## 📖 Giới thiệu

**Thinking AI** là nền tảng học tập trực tuyến được thiết kế để phát triển tư duy hệ thống, kỹ năng phản biện và quản trị AI. Với lộ trình 90 ngày, người học sẽ được trải nghiệm 3 module cốt lõi:

### 🧠 Các Module

| Module | Tên | Mô tả |
|--------|-----|-------|
| **SYSTEMA** | Tư Duy Hệ Thống | Stock & Flow, Feedback Loops, System Archetypes, 12 Đòn Bẩy |
| **ARGOS** | Tư Duy Phản Biện & Pitching | Lập luận, nhận diện ngụy biện, nghệ thuật thuyết phục |
| **COGNOS** | Tư Duy Quản Trị AI | Bản chất AI, prompt design, đánh giá rủi ro, AI governance |

### ✨ Tính năng

- 📚 **3 Modules** với **15 Giai đoạn** và **75+ câu hỏi** thực chiến
- 🎯 **Gate 4/5** để qua mỗi giai đoạn - đảm bảo thực sự hiểu
- 📊 **Dashboard cá nhân** theo dõi tiến độ
- 📝 **Journal phản tỉnh** ghi nhận bài học
- 🔥 **XP & Streak** gamification
- 🔐 **Authentication** với Supabase

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Zustand** - State management
- **TanStack Query** - Server state

### Backend
- **Supabase** - Authentication & Database
- **PostgreSQL** với Row Level Security (RLS)
- **Prisma** - ORM (SQLite for local dev)

---

## 📁 Cấu trúc dự án

```
thinking/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── quizzes/       # Quiz APIs
│   │   │   ├── progress/      # Progress tracking
│   │   │   ├── journal/       # Journal entries
│   │   │   └── profile/       # User profile
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page (refactored)
│   │
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── loading.tsx
│   │   ├── landing/          # Landing page
│   │   │   └── landing-view.tsx
│   │   ├── auth/             # Authentication
│   │   │   └── auth-modal.tsx
│   │   ├── quiz/             # Quiz components
│   │   │   ├── quiz-view.tsx
│   │   │   └── roadmap-view.tsx
│   │   ├── profile/          # Profile components
│   │   │   └── profile-view.tsx
│   │   ├── docs/             # Documentation viewer
│   │   │   └── docs-view.tsx
│   │   └── ui/               # shadcn/ui components
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts       # Authentication logic
│   │   ├── use-quiz.ts       # Quiz management
│   │   ├── use-journal.ts    # Journal entries
│   │   ├── use-docs.ts       # Documentation loading
│   │   ├── use-progress.ts   # Progress tracking
│   │   └── index.ts          # Exports
│   │
│   └── lib/                  # Utilities
│       ├── constants/        # App constants
│       │   └── modules.tsx   # Module definitions
│       ├── types.ts          # TypeScript types
│       ├── store.ts          # Zustand store
│       ├── utils.ts          # Helper functions
│       ├── db.ts             # Database client
│       └── supabase/         # Supabase client
│
├── prisma/
│   └── schema.prisma         # Prisma schema
│
├── public/
│   ├── quiz-data.json        # Fallback quiz data
│   ├── docs-content.json     # Documentation content
│   └── logo.svg              # App logo
│
├── supabase-schema.sql       # Supabase database schema
└── README.md
```

---

## 🛠️ Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- Bun (recommended) hoặc npm
- Supabase account

### Bước 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/chanhphangemini-tech/thinking.git
cd thinking

# Install dependencies
bun install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (local SQLite)
DATABASE_URL="file:./dev.db"
```

### Bước 3: Thiết lập Database

1. Mở **Supabase Dashboard** → **SQL Editor**
2. Copy nội dung từ `supabase-schema.sql`
3. Paste và chạy SQL

### Bước 4: Seed dữ liệu Quiz

```bash
# Chạy API seed (sau khi app đã chạy)
curl -X POST http://localhost:3000/api/seed
```

### Bước 5: Chạy ứng dụng

```bash
bun run dev
```

Truy cập: http://localhost:3000

---

## 📊 Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│    profiles     │     │    modules      │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ slug (PK)       │
│ display_name    │     │ name            │
│ xp              │     │ subtitle        │
│ streak          │     │ description     │
│ longest_streak  │     │ icon, color...  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  user_progress  │     │     phases      │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ user_id (FK)    │     │ module_slug(FK) │
│ module_slug(FK) │     │ phase_number    │
│ phase_number    │     │ name, title     │
│ passed          │     └────────┬────────┘
│ best_score      │              │
└─────────────────┘              ▼
                        ┌─────────────────┐
                        │    quizzes      │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ module_slug(FK) │
                        │ phase_number    │
                        │ question        │
                        │ option_a/b/c/d  │
                        │ correct_answer  │
                        │ explanation     │
                        └─────────────────┘
```

---

## 🔒 Security

- **Row Level Security (RLS)** trên tất cả tables
- Users chỉ có thể đọc/ghi data của chính mình
- Auth tokens được lưu trong localStorage (fallback) và Supabase session

---

## 🎯 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/auth/signup` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập |
| `POST` | `/api/auth/logout` | Đăng xuất |
| `GET` | `/api/quizzes` | Lấy câu hỏi quiz |
| `POST` | `/api/progress` | Lưu tiến độ quiz |
| `GET` | `/api/progress` | Lấy tiến độ user |
| `GET` | `/api/profile` | Lấy profile user |
| `GET` | `/api/journal` | Lấy journal entries |
| `POST` | `/api/journal` | Tạo journal entry |
| `POST` | `/api/seed` | Seed quiz data |

---

## 📈 Roadmap

### ✅ Completed
- [x] Core features (auth, quiz, progress, journal)
- [x] Refactored codebase (component-based architecture)
- [x] Custom hooks for business logic
- [x] Responsive design

### 🚧 In Progress
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization

### 📋 Planned
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Offline mode
- [ ] Social login (Google, GitHub)
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] i18n (multiple languages)
- [ ] Badges & achievements

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend as a Service
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<div align="center">
  <p>Built with ❤️ by Thinking AI Team</p>
  <p>© 2025 ThinkingAI. All rights reserved.</p>
</div>
