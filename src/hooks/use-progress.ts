'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { ModuleSlug } from '@/lib/types'

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<Record<ModuleSlug, number[]>>({
    systema: [],
    argos: [],
    cognos: []
  })
  
  // Track if we've fetched for this userId
  const fetchedUserId = useRef<string | undefined>(undefined)

  // Update progress after quiz pass
  const updateProgress = useCallback((moduleSlug: ModuleSlug, phaseNum: number) => {
    setProgress(prev => ({
      ...prev,
      [moduleSlug]: prev[moduleSlug].includes(phaseNum) ? prev[moduleSlug] : [...prev[moduleSlug], phaseNum],
    }))
  }, [])

  // Calculate total progress
  const totalProgress = Object.values(progress).flat().length
  
  const isPhasePassed = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    return progress[moduleSlug].includes(phase)
  }, [progress])

  // Fetch progress when userId changes - using a ref to prevent cascading updates
  useEffect(() => {
    const fetchProgress = async (uid: string) => {
      try {
        const res = await fetch(`/api/progress?userId=${uid}`)
        const { data } = await res.json()
        if (data && Array.isArray(data)) {
          const newProgress: Record<ModuleSlug, number[]> = {
            systema: [],
            argos: [],
            cognos: []
          }
          for (const p of data) {
            if (p.passed && newProgress[p.module_slug as ModuleSlug]) {
              newProgress[p.module_slug as ModuleSlug].push(p.phase_number)
            }
          }
          setProgress(newProgress)
        }
      } catch {
        // Progress not available yet
      }
    }

    // Only fetch if userId changed
    if (userId && userId !== fetchedUserId.current) {
      fetchedUserId.current = userId
      fetchProgress(userId)
    }
  }, [userId])

  return {
    progress,
    totalProgress,
    updateProgress,
    isPhasePassed,
  }
}
