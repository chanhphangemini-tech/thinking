import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { changePasswordSchema } from '@/lib/validations'
import { ZodError } from 'zod'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)
    const { currentPassword, newPassword, accessToken } = validatedData

    // Step 1: Verify current password by signing in
    // We need the user's email - decode from JWT or get from body
    const verifyClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: userData, error: getUserError } = await verifyClient.auth.getUser(accessToken)

    if (getUserError || !userData.user) {
      return NextResponse.json(
        { error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' },
        { status: 401 }
      )
    }

    const email = userData.user.email!
    if (!email) {
      return NextResponse.json(
        { error: 'Không tìm thấy email tài khoản.' },
        { status: 400 }
      )
    }

    // Step 2: Verify current password
    const { error: signInError } = await verifyClient.auth.signInWithPassword({
      email,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Mật khẩu hiện tại không đúng.' },
        { status: 400 }
      )
    }

    // Sign out the temporary session
    await verifyClient.auth.signOut()

    // Step 3: Update password using the original access token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    })

    const { error: updateError } = await userClient.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      const errorMessages: Record<string, string> = {
        'Password should be at least 6 characters': 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        'New password should be different from the old password': 'Mật khẩu mới phải khác mật khẩu cũ.',
      }
      const message = errorMessages[updateError.message] || updateError.message
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message, validationErrors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 })
  }
}
