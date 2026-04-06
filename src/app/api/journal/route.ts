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
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: data || [] })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const { userId, title, content, moduleSlug, tags } = await request.json()

    if (!userId || !title) {
      return NextResponse.json({ error: 'userId and title are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title,
        content: content || '',
        module_slug: moduleSlug || null,
        tags: tags || [],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: { id: Date.now().toString(), title, content, fallback: true }, fallback: true })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('id')

    if (!entryId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
