import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// ============================================
// Quiz Sync API - Syncs quiz data from JSON to database
// Uses direct PostgreSQL connection to bypass RLS
//
// USAGE: POST /api/sync-quizzes?secret=<your-secret-key>
// ============================================

const SYNC_SECRET = process.env.SYNC_SECRET || 'thinkingai-sync-2025'

export async function POST(request: NextRequest) {
  try {
    // Verify secret key
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get database password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const dbPassword = process.env.DATABASE_PASSWORD

    if (!supabaseUrl || !dbPassword) {
      // Try using Supabase Management API instead
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (!serviceRoleKey) {
        return NextResponse.json({
          error: 'Thiếu DATABASE_PASSWORD hoặc SUPABASE_SERVICE_ROLE_KEY env var',
          instructions: [
            'Option 1: Thêm DATABASE_PASSWORD (từ Supabase Dashboard → Settings → Database)',
            'Option 2: Thêm SUPABASE_SERVICE_ROLE_KEY (từ Supabase Dashboard → Settings → API)',
          ],
        }, { status: 500 })
      }

      // Use Supabase client with service role key
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabase = createClient(
        supabaseUrl!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      return await syncQuizzesWithSupabase(supabase)
    }

    // Connect directly to PostgreSQL
    const { Client } = await import('pg')
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0]

    const client = new Client({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      user: 'postgres',
      password: dbPassword,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    })

    await client.connect()

    try {
      // Read quiz data from JSON file
      const quizDataPath = path.join(process.cwd(), 'public', 'quiz-data.json')
      const quizDataRaw = fs.readFileSync(quizDataPath, 'utf-8')
      const quizData = JSON.parse(quizDataRaw)

      const moduleMapping: Record<string, string> = {
        systema: 'systema',
        argos: 'argos',
        cognos: 'cognos',
        ludus: 'ludus',
      }

      let totalDeleted = 0
      let totalInserted = 0

      for (const [rawKey, moduleData] of Object.entries(quizData)) {
        const moduleSlug = moduleMapping[rawKey]
        if (!moduleSlug) continue

        const phases = (moduleData as { phases: Array<{ phase: number; questions: Array<{ question: string; options: Record<string, string>; correct: string; explanation: string }> }> }).phases

        for (const phase of phases) {
          // Delete existing quizzes for this module and phase
          const deleteResult = await client.query(
            'DELETE FROM public.quizzes WHERE module_slug = $1 AND phase_number = $2',
            [moduleSlug, phase.phase]
          )
          totalDeleted += deleteResult.rowCount || 0

          // Insert new quizzes
          for (let idx = 0; idx < phase.questions.length; idx++) {
            const q = phase.questions[idx]
            await client.query(
              `INSERT INTO public.quizzes (module_slug, phase_number, question, option_a, option_b, option_c, option_d, correct_answer, explanation, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [moduleSlug, phase.phase, q.question, q.options.a, q.options.b, q.options.c, q.options.d, q.correct, q.explanation, idx]
            )
            totalInserted++
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Đồng bộ quiz thành công!`,
        details: {
          deleted: totalDeleted,
          inserted: totalInserted,
        },
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Lỗi đồng bộ quiz: ' + message }, { status: 500 })
  }
}

// Alternative: Use Supabase client with service role key
async function syncQuizzesWithSupabase(supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>) {
  // Read quiz data from JSON file
  const quizDataPath = path.join(process.cwd(), 'public', 'quiz-data.json')
  const quizDataRaw = fs.readFileSync(quizDataPath, 'utf-8')
  const quizData = JSON.parse(quizDataRaw)

  const moduleMapping: Record<string, string> = {
    systema: 'systema',
    argos: 'argos',
    cognos: 'cognos',
    ludus: 'ludus',
  }

  let totalDeleted = 0
  let totalInserted = 0
  const errors: string[] = []

  for (const [rawKey, moduleData] of Object.entries(quizData)) {
    const moduleSlug = moduleMapping[rawKey]
    if (!moduleSlug) continue

    const phases = (moduleData as { phases: Array<{ phase: number; questions: Array<{ question: string; options: Record<string, string>; correct: string; explanation: string }> }> }).phases

    for (const phase of phases) {
      // Delete existing quizzes for this module and phase
      const { error: deleteError } = await supabase
        .from('quizzes')
        .delete()
        .eq('module_slug', moduleSlug)
        .eq('phase_number', phase.phase)
      
      if (deleteError) {
        errors.push(`Delete ${moduleSlug} phase ${phase.phase}: ${deleteError.message}`)
      }

      // Insert new quizzes
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

      const { error: insertError } = await supabase.from('quizzes').insert(questions)

      if (insertError) {
        errors.push(`Insert ${moduleSlug} phase ${phase.phase}: ${insertError.message}`)
      } else {
        totalInserted += questions.length
      }
    }
  }

  if (errors.length > 0 && totalInserted === 0) {
    return NextResponse.json({ error: 'Failed to sync quizzes', details: errors }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `Đồng bộ quiz thành công!`,
    details: {
      inserted: totalInserted,
      errors: errors.length > 0 ? errors : undefined,
    },
  })
}
