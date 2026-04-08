-- ============================================
-- THINKING AI - Supabase Database Schema
-- ============================================
-- Instructions: Go to Supabase Dashboard → SQL Editor → Paste & Run this SQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Người học',
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. MODULES TABLE (3 learning modules)
-- ============================================
CREATE TABLE IF NOT EXISTS public.modules (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT '#f5a623',
  bg_color TEXT NOT NULL DEFAULT '#0a0c10',
  border_color TEXT NOT NULL DEFAULT '#f5a623',
  total_phases INTEGER NOT NULL DEFAULT 5,
  estimated_days INTEGER NOT NULL DEFAULT 90,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Seed the 3 modules
INSERT INTO public.modules (slug, name, subtitle, description, icon, color, bg_color, border_color, total_phases, estimated_days, sort_order) VALUES
  ('systema', 'SYSTEMA', 'Tư Duy Hệ Thống', 'Nắm vững Stock & Flow, Feedback Loops, System Archetypes và 12 Đòn Bẩy để hiểu và can thiệp vào bất kỳ hệ thống phức tạp nào.', '⚙️', '#f5a623', '#0a0c10', '#f5a623', 5, 90, 1),
  ('argos', 'ARGOS', 'Tư Duy Phản Biện & Pitching', 'Phát triển khả năng lập luận sắc bén, nhận diện ngụy biện, và nghệ thuật thuyết phục & pitching để tạo ảnh hưởng trong mọi tình huống.', '⚔️', '#C0392B', '#F4EFE6', '#C0392B', 5, 90, 2),
  ('cognos', 'COGNOS', 'Tư Duy Quản Trị AI', 'Hiểu bản chất AI, tránh bẫy tư duy, thiết kế prompt hiệu quả, đánh giá rủi ro và xây dựng chiến lược AI governance.', '🧠', '#00E5FF', '#050913', '#00E5FF', 5, 90, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. PHASES TABLE (phases within each module)
-- ============================================
CREATE TABLE IF NOT EXISTS public.phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_slug TEXT NOT NULL REFERENCES public.modules(slug) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  pass_requirement TEXT NOT NULL DEFAULT '4/5',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(module_slug, phase_number)
);

-- Seed phases for SYSTEMA
INSERT INTO public.phases (module_slug, phase_number, name, title, description, sort_order) VALUES
  ('systema', 1, 'Tư Duy Phi Tuyến Tính & Phản Hồi', 'QUIZ GIAI ĐOẠN 1', 'Hiểu sự khác biệt giữa tư duy tuyến tính và hệ thống, nắm vững khái niệm Stock, Flow và Feedback.', 1),
  ('systema', 2, 'Cấu Trúc Hệ Thống & Archetypes', 'QUIZ GIAI ĐOẠN 2', 'Nhận diện 8 System Archetypes, hiểu R/B loops và delay effects.', 2),
  ('systema', 3, 'Mô Hình Tâm Trí & Đòn Bẩy', 'QUIZ GIAI ĐOẠN 3', 'Tìm ra Mental Models, áp dụng Iceberg Model và 12 Đòn Bẩy của Donella Meadows.', 3),
  ('systema', 4, 'Thiết Kế Hệ Thống & Dự Phòng', 'QUIZ GIAI ĐOẠN 4', 'Thiết kế can thiệp hệ thống, dự phòng rủi ro và monitor feedback.', 4),
  ('systema', 5, 'Tư Duy Hệ Thống Thực Chiến', 'QUIZ TỔNG HỢP', 'Ứng dụng tổng hợp tư duy hệ thống vào thực tế business và life.', 5)
ON CONFLICT (module_slug, phase_number) DO NOTHING;

-- Seed phases for ARGOS
INSERT INTO public.phases (module_slug, phase_number, name, title, description, sort_order) VALUES
  ('argos', 1, 'Tâm Lý Học Thuyết Phục & Sự Thật', 'QUIZ GIAI ĐOẠN 1', 'Hiểu tâm lý đám đông, hiệu ứng Backfire, Ethos/Pathos/Logos và 6 nguyên tắc Cialdini.', 1),
  ('argos', 2, 'Cấu Trúc Lập Luận & Ngụy Biện', 'QUIZ GIAI ĐOẠN 2', 'Nắm vững PREP, nhận diện 10+ ngụy biện phổ biến, phân biệt Argument vs Assertion.', 2),
  ('argos', 3, 'Nghệ Thuật Đặt Câu Hỏi & Lắng Nghe', 'QUIZ GIAI ĐOẠN 3', 'Master câu hỏi mở, Labeling, Active Listening và sức mạnh của im lặng.', 3),
  ('argos', 4, 'Kỹ Thuật Pitching & Storytelling', 'QUIZ GIAI ĐOẠN 4', 'Hero''s Journey, Hook trong 30s, Pyramid Principle và kỹ năng Q&A.', 4),
  ('argos', 5, 'Bậc Thầy Thuyết Phục & Phản Biện', 'QUIZ TỔNG HỢP', 'Tổng hợp mọi kỹ năng thành nghệ thuật thuyết phục và phản biện bậc thầy.', 5)
ON CONFLICT (module_slug, phase_number) DO NOTHING;

-- Seed phases for COGNOS
INSERT INTO public.phases (module_slug, phase_number, name, title, description, sort_order) VALUES
  ('cognos', 1, 'Bản Chất AI', 'QUIZ GIAI ĐOẠN 1', 'Hiểu LLM mechanics, phân biệt Know vs Predict, AI Contract và Hallucination.', 1),
  ('cognos', 2, 'Giới Hạn AI & Bẫy Tư Duy', 'QUIZ GIAI ĐOẠN 2', 'Nhận diện 7 bẫy tư duy AI, Automation Bias, Skill Atrophy và AI Skepticism.', 2),
  ('cognos', 3, 'Prompt Thinking & Workflow Design', 'QUIZ GIAI ĐOẠN 3', 'RCTFC Framework, task classification, AI workflow design và human checkpoints.', 3),
  ('cognos', 4, 'Đánh Giá Output & Quản Lý Rủi Ro', 'QUIZ GIAI ĐOẠN 4', '4-Pillar evaluation, 5 systemic risks, AI Risk Matrix và appropriate reliance.', 4),
  ('cognos', 5, 'Tổng Hợp Tư Duy Quản Trị AI', 'QUIZ TỐT NGHIỆP', 'U.R.C Framework, AI Policy Template, governance plan và mastery checklist.', 5)
ON CONFLICT (module_slug, phase_number) DO NOTHING;

-- ============================================
-- 4. QUIZZES TABLE (quiz questions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_slug TEXT NOT NULL REFERENCES public.modules(slug) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  explanation TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Index for fast quiz queries
CREATE INDEX idx_quizzes_module_phase ON public.quizzes(module_slug, phase_number);

-- ============================================
-- 5. USER PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL REFERENCES public.modules(slug) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  best_score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  first_passed_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_slug, phase_number)
);

CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);

-- ============================================
-- 6. QUIZ ATTEMPTS TABLE (detailed history)
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL REFERENCES public.modules(slug) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL DEFAULT 5,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_module ON public.quiz_attempts(module_slug, phase_number);

-- ============================================
-- 7. JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug TEXT REFERENCES public.modules(slug) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_user ON public.journal_entries(user_id);

-- ============================================
-- 8. ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  module_slug TEXT REFERENCES public.modules(slug) ON DELETE SET NULL,
  details TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON public.activity_log(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Modules: publicly readable
CREATE POLICY "Modules are publicly readable" ON public.modules FOR SELECT USING (true);

-- Phases: publicly readable
CREATE POLICY "Phases are publicly readable" ON public.phases FOR SELECT USING (true);

-- Quizzes: publicly readable
CREATE POLICY "Quizzes are publicly readable" ON public.quizzes FOR SELECT USING (true);

-- User Progress: users can read/write only their own
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Quiz Attempts: users can read/write only their own
CREATE POLICY "Users can read own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal Entries: users can read/write only their own
CREATE POLICY "Users can read own journal" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Activity Log: users can read/write only their own
CREATE POLICY "Users can read own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, xp, streak, longest_streak)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    0, 0, 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER journal_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 9. PRACTICE SESSIONS TABLE (Thực Chiến)
-- ============================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  modules TEXT[] NOT NULL DEFAULT '{}',
  topic TEXT NOT NULL DEFAULT '',
  topic_description TEXT NOT NULL DEFAULT '',
  topic_requirements JSONB NOT NULL DEFAULT '[]',
  topic_hints JSONB NOT NULL DEFAULT '[]',
  topic_module_context TEXT NOT NULL DEFAULT '',
  essay TEXT NOT NULL DEFAULT '',
  score NUMERIC(4,1) NOT NULL DEFAULT 0,
  grade TEXT NOT NULL DEFAULT '',
  criteria JSONB NOT NULL DEFAULT '{}',
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  critical_weakness TEXT NOT NULL DEFAULT '',
  detailed_feedback TEXT NOT NULL DEFAULT '',
  improved_thinking TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_practice_sessions_user ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_created ON public.practice_sessions(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only read/write their own sessions
CREATE POLICY "Users can read own practice sessions" ON public.practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own practice sessions" ON public.practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own practice sessions" ON public.practice_sessions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DONE! ✅
-- ============================================
-- Your database is now ready.
-- The following tables are available:
-- - profiles (auto-created on signup via trigger)
-- - modules (3 modules pre-seeded)
-- - phases (15 phases pre-seeded, 5 per module)
-- - quizzes (empty - will be seeded via API)
-- - user_progress (auto-tracked)
-- - quiz_attempts (history)
-- - journal_entries (user journal)
-- - activity_log (XP tracking)
-- - practice_sessions (thực chiến với AI)
-- ============================================
