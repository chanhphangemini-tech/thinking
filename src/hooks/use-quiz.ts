'use client'

import { useState, useCallback, useEffect, useRef, startTransition } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug, QuizQuestion } from '@/lib/types'
import { useNavigation } from '@/lib/store'
import { PASS_THRESHOLD, MODULES } from '@/lib/constants/modules'

// Fallback quiz data storage (loaded from JSON file)
const FALLBACK_QUIZ_DATA: Record<ModuleSlug, Record<number, QuizQuestion[]>> = {
  systema: {},
  argos: {},
  cognos: {},
  ludus: {},
}
let fallbackDataLoaded = false

// Load fallback quiz data from JSON file
async function loadFallbackData() {
  if (fallbackDataLoaded) return
  try {
    const res = await fetch('/quiz-data.json')
    if (!res.ok) return
    const data = await res.json()
    for (const mod of ['systema', 'argos', 'cognos', 'ludus'] as ModuleSlug[]) {
      if (data[mod]) {
        FALLBACK_QUIZ_DATA[mod] = {}
        for (const phase of data[mod].phases) {
          FALLBACK_QUIZ_DATA[mod][phase.phase] = phase.questions.map((q: {
            question: string
            options: Record<string, string>
            correct: string
            explanation: string
          }) => ({
            question: q.question,
            options: q.options,
            correct: q.correct as 'a' | 'b' | 'c' | 'd',
            explanation: q.explanation,
          }))
        }
      }
    }
    fallbackDataLoaded = true
  } catch {
    // Fallback data not available
  }
}

// Initialize fallback data
loadFallbackData()

export function useQuiz(userId: string | undefined) {
  const nav = useNavigation()
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)
  const [quizResetKey, setQuizResetKey] = useState(0)

  const prevPhaseRef = useRef<number | null>(null)
  const prevModuleRef = useRef<ModuleSlug | null>(null)

  // Reset quiz state when entering a new phase
  const resetAllQuizState = useCallback(() => {
    setQuizResetKey(prev => prev + 1)
    setQuizQuestions([])
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizScore(0)
    setQuizPassed(false)
  }, [])

  useEffect(() => {
    if (nav.view === 'module' && nav.currentModule && nav.currentPhase) {
      if (
        prevModuleRef.current !== nav.currentModule ||
        prevPhaseRef.current !== nav.currentPhase
      ) {
        prevModuleRef.current = nav.currentModule
        prevPhaseRef.current = nav.currentPhase
        startTransition(() => resetAllQuizState())
      }
    }
  }, [nav.view, nav.currentModule, nav.currentPhase, resetAllQuizState])

  // Start quiz - try Supabase API first, fallback to JSON
  const startQuiz = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    setQuizLoading(true)
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizScore(0)
    setQuizPassed(false)

    try {
      const res = await fetch(`/api/quizzes?module=${moduleSlug}&phase=${phase}`)
      const { data } = await res.json()

      if (data && data.length > 0) {
        setQuizQuestions(data.map((q: Record<string, unknown>) => ({
          id: q.id as string,
          phase,
          question: q.question as string,
          options: {
            a: q.option_a as string,
            b: q.option_b as string,
            c: q.option_c as string,
            d: q.option_d as string,
          },
          correct: (q.correct_answer as string).toLowerCase() as 'a' | 'b' | 'c' | 'd',
          explanation: q.explanation as string,
        })))
      } else {
        // Fallback to JSON data
        if (!fallbackDataLoaded) await loadFallbackData()
        if (FALLBACK_QUIZ_DATA[moduleSlug]?.[phase]) {
          setQuizQuestions(FALLBACK_QUIZ_DATA[moduleSlug][phase])
        } else {
          toast.error('Chưa có câu hỏi cho giai đoạn này.')
        }
      }
    } catch {
      // Fallback to JSON data on network error
      if (!fallbackDataLoaded) await loadFallbackData()
      if (FALLBACK_QUIZ_DATA[moduleSlug]?.[phase]) {
        setQuizQuestions(FALLBACK_QUIZ_DATA[moduleSlug][phase])
      } else {
        toast.error('Không thể tải câu hỏi')
      }
    } finally {
      setQuizLoading(false)
    }
  }, [])

  // Submit quiz
  const submitQuiz = useCallback(async (
    onProgressUpdate: (moduleSlug: ModuleSlug, phaseNum: number) => void
  ) => {
    if (!userId || quizQuestions.length === 0) return null
    const moduleSlug = nav.currentModule!
    const phaseNum = nav.currentPhase!

    let score = 0
    for (const q of quizQuestions) {
      if (selectedAnswers[quizQuestions.indexOf(q)] === q.correct) {
        score++
      }
    }

    const passed = score >= PASS_THRESHOLD
    setQuizScore(score)
    setQuizPassed(passed)
    setQuizSubmitted(true)

    // Save to DB
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleSlug,
          phaseNumber: phaseNum,
          score,
          total: quizQuestions.length,
          passed,
          answers: selectedAnswers,
        }),
      })

      if (passed) {
        onProgressUpdate(moduleSlug, phaseNum)
        toast.success(`🎉 Chúc mừng! Bạn đã qua ${MODULES[moduleSlug].phases[phaseNum - 1].title} với ${score}/${quizQuestions.length}!`)
      } else {
        toast.error(`Bạn đạt ${score}/${quizQuestions.length}. Cần ít nhất ${PASS_THRESHOLD}/${quizQuestions.length} để qua. Thử lại nhé!`)
      }
    } catch {
      if (passed) {
        onProgressUpdate(moduleSlug, phaseNum)
      }
    }

    return { score, passed, total: quizQuestions.length }
  }, [userId, quizQuestions, selectedAnswers, nav.currentModule, nav.currentPhase])

  // Reset quiz
  const resetQuiz = useCallback(() => {
    resetAllQuizState()
  }, [resetAllQuizState])

  // Select answer
  const selectAnswer = useCallback((questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }))
  }, [])

  return {
    quizQuestions,
    quizLoading,
    selectedAnswers,
    quizSubmitted,
    quizScore,
    quizPassed,
    quizResetKey,
    startQuiz,
    submitQuiz,
    resetQuiz,
    selectAnswer,
  }
}
