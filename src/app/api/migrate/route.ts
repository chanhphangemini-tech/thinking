import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

// ============================================
// One-time migration API
// Adds email column to profiles, updates trigger, backfills data
//
// USAGE: POST /api/migrate?secret=<your-secret-key>
// ============================================

const MIGRATION_SECRET = process.env.MIGRATION_SECRET || 'thinkingai-migrate-2025'

export async function POST(request: NextRequest) {
  try {
    // Verify secret key
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    if (secret !== MIGRATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()

    // Check if email column already exists by trying to select it
    const { error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: 'Migration đã chạy trước đó rồi (cột email đã tồn tại).',
        alreadyMigrated: true,
      })
    }

    if (!checkError.message?.includes('does not exist')) {
      return NextResponse.json({
        error: 'Lỗi kiểm tra schema: ' + checkError.message,
      }, { status: 500 })
    }

    // Column doesn't exist — run migration
    // We use the Supabase client's RPC to run DDL via a temporary approach
    // Since anon key can't run DDL directly, we use raw PostgreSQL connection

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const dbPassword = process.env.DATABASE_PASSWORD

    if (!supabaseUrl || !dbPassword) {
      return NextResponse.json({
        error: 'Thiếu DATABASE_PASSWORD env var. Vui lòng thêm vào Vercel Settings > Environment Variables.',
        instructions: [
          '1. Mở Supabase Dashboard → Settings → Database',
          '2. Copy "Database password" (hoặc reset nếu quên)',
          '3. Thêm env var DATABASE_PASSWORD trên Vercel với giá trị đó',
          '4. Gọi lại API này',
        ],
        fallback: true,
      })
    }

    // Connect directly to PostgreSQL
    const { Client } = await import('pg')
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0]

    const client = new Client({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      user: 'postgres',
      password: dbPassword,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    })

    await client.connect()

    try {
      // Run migration SQL
      await client.query(`
        -- 1. Add email column
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

        -- 2. Backfill email from auth.users
        UPDATE public.profiles p
        SET email = u.email
        FROM auth.users u
        WHERE p.id = u.id AND p.email IS NULL;

        -- 3. Update trigger function to include email
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

        -- 4. Create index
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
      `)

      // Verify migration
      const { rows } = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email'
      `)

      if (rows.length === 0) {
        throw new Error('Migration verification failed — email column not found after ALTER')
      }

      return NextResponse.json({
        success: true,
        message: 'Migration chạy thành công! Cột email đã được thêm, trigger đã cập nhật, dữ liệu đã backfill.',
        details: {
          emailColumnAdded: true,
          triggerUpdated: true,
          indexCreated: true,
          backfilledCount: '(chạy UPDATE cho tất cả profiles)',
        },
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Lỗi migration: ' + message }, { status: 500 })
  }
}
