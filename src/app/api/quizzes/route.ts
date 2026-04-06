import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const moduleSlug = searchParams.get('module')
    const phase = searchParams.get('phase')

    if (!moduleSlug) {
      return NextResponse.json({ error: 'Module is required' }, { status: 400 })
    }

    let query = supabase
      .from('quizzes')
      .select('*')
      .eq('module_slug', moduleSlug)
      .order('phase_number', { ascending: true })
      .order('sort_order', { ascending: true })

    if (phase) {
      query = query.eq('phase_number', parseInt(phase))
    }

    const { data, error } = await query

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ data: [], seeded: false })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [], seeded: true })
  } catch {
    return NextResponse.json({ data: [], seeded: false })
  }
}
