import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { quizQuerySchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    
    // Build validation object
    const validationObj: { module: string; phase?: number } = {
      module: searchParams.get('module') || '',
    }
    
    const phaseParam = searchParams.get('phase')
    if (phaseParam) {
      validationObj.phase = parseInt(phaseParam)
    }

    // Validate input - only validate if module is provided
    if (!validationObj.module) {
      return NextResponse.json({ error: 'Module là bắt buộc' }, { status: 400 })
    }

    try {
      quizQuerySchema.parse(validationObj)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ 
          error: error.errors[0].message,
          validationErrors: error.errors 
        }, { status: 400 })
      }
    }

    let query = supabase
      .from('quizzes')
      .select('*')
      .eq('module_slug', validationObj.module)
      .order('phase_number', { ascending: true })
      .order('sort_order', { ascending: true })

    if (validationObj.phase) {
      query = query.eq('phase_number', validationObj.phase)
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
