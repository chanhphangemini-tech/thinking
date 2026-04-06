import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ data: null })
      }
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: null })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase()
    const { userId, displayName } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const updates: Record<string, unknown> = { last_login: new Date().toISOString() }
    if (displayName) updates.display_name = displayName

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: { display_name: displayName }, fallback: true })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
