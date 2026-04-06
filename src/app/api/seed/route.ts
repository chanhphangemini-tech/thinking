import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import type { ModuleSlug } from '@/lib/types'
import * as fs from 'fs'
import * as path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adminKey } = body

    // Simple protection - in production use proper auth
    if (adminKey !== 'thinkingai-seed-2025') {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
    }

    // Read quiz data from the JSON file
    const quizDataPath = path.join(process.cwd(), 'public', 'quiz-data.json')
    const quizDataRaw = fs.readFileSync(quizDataPath, 'utf-8')
    const quizData = JSON.parse(quizDataRaw)

    const moduleMapping: Record<string, ModuleSlug> = {
      argos: 'argos',
      cognos: 'cognos',
      systems: 'systema',
    }

    let totalInserted = 0
    const errors: string[] = []

    for (const [rawKey, moduleData] of Object.entries(quizData)) {
      const moduleSlug = moduleMapping[rawKey]
      if (!moduleSlug) continue

      const phases = (moduleData as { phases: Array<{ phase: number; questions: Array<{ question: string; options: Record<string, string>; correct: string; explanation: string }> }> }).phases

      for (const phase of phases) {
        const questions = phase.questions.map((q, idx) => ({
          module_slug: moduleSlug,
          phase_number: phase.phase,
          question: q.question,
          option_a: q.options.a,
          option_b: q.options.b,
          option_c: q.options.c,
          option_d: q.options.d,
          correct_answer: q.correct,
          explanation: q.explanation,
          sort_order: idx,
        }))

        const supabase = getSupabase()
        const { error } = await supabase.from('quizzes').insert(questions)

        if (error) {
          if (error.message?.includes('does not exist') || error.code === '42P01') {
            return NextResponse.json({
              error: 'Database tables not created yet. Please run the SQL schema in Supabase SQL Editor first.',
              sqlFile: 'supabase-schema.sql',
            }, { status: 400 })
          }
          errors.push(`${moduleSlug} phase ${phase.phase}: ${error.message}`)
        } else {
          totalInserted += questions.length
        }
      }
    }

    if (errors.length > 0 && totalInserted === 0) {
      return NextResponse.json({ error: 'Failed to seed quizzes', details: errors }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      totalInserted,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Seed failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
