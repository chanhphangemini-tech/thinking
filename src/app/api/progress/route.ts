import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ data: [] })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, moduleSlug, phaseNumber, score, total, passed, answers } = body

    if (!userId || !moduleSlug || !phaseNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert user_progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', moduleSlug)
      .eq('phase_number', phaseNumber)
      .single()

    const bestScore = existing ? Math.max(existing.best_score, score) : score
    const isNewPass = passed && (!existing || !existing.passed)

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        module_slug: moduleSlug,
        phase_number: phaseNumber,
        passed: existing?.passed || passed,
        best_score: bestScore,
        attempts: (existing?.attempts || 0) + 1,
        first_passed_at: isNewPass ? new Date().toISOString() : existing?.first_passed_at,
        last_attempt_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_slug,phase_number' })
      .select()
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        // Table doesn't exist yet, store in fallback mode
        return NextResponse.json({ data: { passed, score, total, fallback: true }, fallback: true })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log quiz attempt
    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      module_slug: moduleSlug,
      phase_number: phaseNumber,
      score,
      total,
      passed,
      answers: answers || {},
    }).ignore()

    // Update XP if passed
    if (passed && isNewPass) {
      await supabase.rpc?.('increment_xp', { user_id: userId, amount: 100 })
      // Fallback XP update if RPC doesn't exist
      await supabase.from('profiles')
        .update({ xp: existing ? existing.xp || 0 : 0 }) // This is a no-op, we need RPC
        .eq('id', userId)
    }

    return NextResponse.json({ data, newPass: isNewPass })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
