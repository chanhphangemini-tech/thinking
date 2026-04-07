'use client'

import { useState, useCallback } from 'react'
import type { ModuleSlug } from '@/lib/types'

const QUIZ_CHECKLIST_KEY = 'thinking-ai-quiz-checklist'

function loadChecklist(): Record<ModuleSlug, Set<number>> {
  try {
    if (typeof window === 'undefined') {
      return {
        systema: new Set(),
        argos: new Set(),
        cognos: new Set(),
        ludus: new Set(),
      }
    }
    const saved = localStorage.getItem(QUIZ_CHECKLIST_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        systema: new Set(parsed.systema || []),
        argos: new Set(parsed.argos || []),
        cognos: new Set(parsed.cognos || []),
        ludus: new Set(parsed.ludus || []),
      }
    }
  } catch {
    // Ignore errors
  }
  return {
    systema: new Set(),
    argos: new Set(),
    cognos: new Set(),
    ludus: new Set(),
  }
}

export function useQuizChecklist() {
  const [checklist, setChecklist] = useState<Record<ModuleSlug, Set<number>>>(loadChecklist)

  // Save to localStorage
  const saveChecklist = useCallback((newChecklist: Record<ModuleSlug, Set<number>>) => {
    try {
      localStorage.setItem(QUIZ_CHECKLIST_KEY, JSON.stringify({
        systema: Array.from(newChecklist.systema),
        argos: Array.from(newChecklist.argos),
        cognos: Array.from(newChecklist.cognos),
        ludus: Array.from(newChecklist.ludus),
      }))
    } catch {
      // Ignore errors
    }
  }, [])

  // Toggle completed / not completed
  const toggleCompleted = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    setChecklist(prev => {
      const newSet = new Set(prev[moduleSlug])
      if (newSet.has(phase)) {
        newSet.delete(phase)
      } else {
        newSet.add(phase)
      }
      const newChecklist = { ...prev, [moduleSlug]: newSet }
      saveChecklist(newChecklist)
      return newChecklist
    })
  }, [saveChecklist])

  return {
    checklist,
    toggleCompleted,
  }
}
