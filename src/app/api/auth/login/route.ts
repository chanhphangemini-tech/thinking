import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Translate common Supabase errors to Vietnamese
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Email hoặc mật khẩu không đúng',
        'Email not confirmed': 'Email chưa được xác nhận. Vui lòng kiểm tra email.',
        'Too many requests': 'Đăng nhập quá nhiều lần. Vui lòng đợi vài phút.',
      }
      const message = errorMessages[error.message] || error.message
      return NextResponse.json({ error: message }, { status: 400 })
    }

    // Record login: update last_login and email in profiles table
    if (data?.session?.user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            last_login: new Date().toISOString(),
            email: email,
          })
          .eq('id', data.session.user.id)
      } catch {
        // Non-critical: don't fail login if profile update fails
      }
    }

    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.errors[0].message,
        validationErrors: error.errors,
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 })
  }
}
