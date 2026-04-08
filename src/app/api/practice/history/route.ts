import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

// GET /api/practice/history?userId=xxx — List practice sessions for user
export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[PRACTICE HISTORY] GET error:', error.message)
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('[PRACTICE HISTORY] GET catch:', error)
    return NextResponse.json({ data: [] })
  }
}

// POST /api/practice/history — Save a completed practice session
export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()

    const {
      userId,
      modules,
      topic,
      topicDescription,
      topicRequirements,
      topicHints,
      topicModuleContext,
      essay,
      score,
      grade,
      criteria,
      strengths,
      weaknesses,
      criticalWeakness,
      detailedFeedback,
      improvedThinking,
    } = body

    if (!userId || !topic) {
      return NextResponse.json({ error: 'userId and topic are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({
        user_id: userId,
        modules: modules || [],
        topic,
        topic_description: topicDescription || '',
        topic_requirements: topicRequirements || [],
        topic_hints: topicHints || [],
        topic_module_context: topicModuleContext || '',
        essay: essay || '',
        score: score || 0,
        grade: grade || '',
        criteria: criteria || {},
        strengths: strengths || [],
        weaknesses: weaknesses || [],
        critical_weakness: criticalWeakness || '',
        detailed_feedback: detailedFeedback || '',
        improved_thinking: improvedThinking || '',
      })
      .select()
      .single()

    if (error) {
      console.error('[PRACTICE HISTORY] POST insert error:', error.message)
      // Fallback: return success with local id
      return NextResponse.json({
        data: {
          id: `local-${Date.now()}`,
          fallback: true,
          ...body,
          created_at: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[PRACTICE HISTORY] POST catch:', error)
    return NextResponse.json({
      data: {
        id: `local-${Date.now()}`,
        fallback: true,
        created_at: new Date().toISOString(),
      },
    })
  }
}

// DELETE /api/practice/history?id=xxx&userId=xxx — Delete a practice session
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json({ error: 'id and userId are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[PRACTICE HISTORY] DELETE error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PRACTICE HISTORY] DELETE catch:', error)
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 })
  }
}
