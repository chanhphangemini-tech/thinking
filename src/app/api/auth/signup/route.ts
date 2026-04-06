import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { email, password, display_name } = await request.json()

    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: display_name || email.split('@')[0] },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
