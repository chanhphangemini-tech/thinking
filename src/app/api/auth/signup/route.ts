import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { signupSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input with Zod
    const validatedData = signupSchema.parse(body)
    const { email, password, display_name } = validatedData

    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: display_name || email.split('@')[0] },
        emailRedirectTo: undefined,
      },
    })

    if (error) {
      // Translate common Supabase errors to Vietnamese
      const errorMessages: Record<string, string> = {
        'email rate limit exceeded': 'Đăng ký quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.',
        'user already registered': 'Email này đã được đăng ký. Vui lòng đăng nhập.',
        'Invalid email': 'Email không hợp lệ. Vui lòng kiểm tra lại.',
        'Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự.',
        'Signup is disabled': 'Đăng ký hiện không khả dụng.',
      }
      const message = errorMessages[error.message] || error.message
      return NextResponse.json({ error: message }, { status: 400 })
    }

    // If session exists, user can login immediately (email confirmation disabled)
    if (data.session) {
      return NextResponse.json({ 
        data,
        needsConfirmation: false 
      })
    }

    // Email confirmation required
    return NextResponse.json({ 
      data,
      needsConfirmation: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: error.errors[0].message,
        validationErrors: error.errors 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 })
  }
}
