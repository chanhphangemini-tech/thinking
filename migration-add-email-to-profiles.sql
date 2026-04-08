-- ============================================
-- MIGRATION: Thêm email vào profiles + Cập nhật trigger
-- ============================================
-- Chạy trong Supabase Dashboard → SQL Editor → Paste & Run
-- ============================================

-- 1. Thêm cột email vào bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill email cho profiles hiện có từ auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 3. Cập nhật trigger để tự động lưu email khi user mới đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, xp, streak, longest_streak)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    0, 0, 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Tạo index cho email (tìm kiếm nhanh)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 5. (Tùy chọn) Thêm constraint unique cho email nếu muốn
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- ============================================
-- XÁC NHẬN: Kiểm tra kết quả
-- ============================================
-- SELECT id, display_name, email, last_login, created_at FROM public.profiles LIMIT 10;
