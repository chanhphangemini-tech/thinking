import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { progressQuerySchema, progressUpdateSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    
    // Validate query params
    const validatedParams = progressQuerySchema.parse({
      userId: searchParams.get('userId'),
    })
    const { userId } = validatedParams

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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: error.errors[0].message,
        validationErrors: error.errors 
      }, { status: 400 })
    }
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    
    // Validate input with Zod
    const validatedData = progressUpdateSchema.parse({
      ...body,
      phaseNumber: body.phaseNumber,
      score: body.score,
    })
    const { userId, moduleSlug, phaseNumber, score, passed } = validatedData
    const { total, answers } = body

    // Upsert user_progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', moduleSlug)
      .eq('phase_number', phaseNumber)
      .single()
      .catch(() => ({ data: null }))

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

    return NextResponse.json({ data, newPass: isNewPass })
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
