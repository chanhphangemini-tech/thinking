'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  calculateLevel,
  getLevelProgress,
  calculatePhaseXP,
  getStreakBonusMultiplier,
  checkForNewAchievements,
  checkTimeBasedAchievements,
  getAchievement,
  ACHIEVEMENTS,
  XP_DAILY_PRACTICE,
  XP_MODULE_COMPLETE_BONUS,
  type AchievementDefinition,
} from '@/lib/gamification'
import type { ModuleSlug } from '@/lib/types'

// ============================================
// TYPES
// ============================================
export interface GamificationState {
  xp: number
  level: number
  streak: number
  longestStreak: number
  lastActive: Date | null
  achievements: string[]
  todayXP: number
}

export interface UseGamificationReturn {
  // State
  xp: number
  level: number
  levelProgress: { current: number; required: number; percentage: number }
  streak: number
  longestStreak: number
  streakBonus: number
  achievements: string[]
  earnedAchievements: AchievementDefinition[]
  todayXP: number
  
  // Actions
  addPhaseXP: (phase: number, moduleSlug: ModuleSlug) => Promise<{ xpEarned: number; newAchievements: string[]; levelUp: boolean }>
  addDailyPracticeXP: () => Promise<{ xpEarned: number; newAchievements: string[] }>
  addModuleCompleteBonus: (moduleSlug: ModuleSlug) => Promise<{ xpEarned: number; newAchievements: string[] }>
  checkAndUnlockAchievements: (params: {
    completedPhases: Record<ModuleSlug, number[]>
    totalQuizzes?: number
    totalDailyPractices?: number
    perfectQuiz?: boolean
    firstTryPerfect?: boolean
  }) => Promise<string[]>
  recordDailyActivity: () => Promise<void>
  syncWithServer: () => Promise<void>
  
  // Helpers
  getAchievementById: (id: string) => AchievementDefinition | undefined
  hasAchievement: (id: string) => boolean
}

// ============================================
// LOCAL STORAGE KEYS
// ============================================
const STORAGE_KEY = 'thinking-ai-gamification'

// ============================================
// HELPER FUNCTIONS
// ============================================
function getInitialState(): GamificationState {
  if (typeof window === 'undefined') {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      lastActive: null,
      achievements: [],
      todayXP: 0,
    }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        lastActive: parsed.lastActive ? new Date(parsed.lastActive) : null,
      }
    }
  } catch {
    // ignore
  }
  
  return {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastActive: null,
    achievements: [],
    todayXP: 0,
  }
}

function saveState(state: GamificationState): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

// ============================================
// HOOK
// ============================================
export function useGamification(userId?: string): UseGamificationReturn {
  const [state, setState] = useState<GamificationState>(getInitialState)
  
  // Calculate derived values
  const level = useMemo(() => calculateLevel(state.xp), [state.xp])
  const levelProgress = useMemo(() => getLevelProgress(state.xp), [state.xp])
  const streakBonus = useMemo(() => getStreakBonusMultiplier(state.streak), [state.streak])
  const earnedAchievements = useMemo(() => {
    return state.achievements
      .map(id => getAchievement(id))
      .filter((a): a is AchievementDefinition => a !== undefined)
  }, [state.achievements])
  
  // Check if streak should be maintained on mount - use a ref to avoid cascading renders
  const streakChecked = useRef(false)
  
  useEffect(() => {
    if (streakChecked.current || !state.lastActive) return
    streakChecked.current = true
    
    const lastActiveDate = new Date(state.lastActive)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const lastActiveDay = format(lastActiveDate, 'yyyy-MM-dd')
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd')
    
    // If last active was before yesterday, reset streak
    if (lastActiveDay < yesterdayStr) {
      // Defer state update to avoid cascading renders
      requestAnimationFrame(() => {
        setState(prev => {
          const newState = { ...prev, streak: 0 }
          saveState(newState)
          return newState
        })
      })
    }
  }, [state.lastActive])
  
  // Reset todayXP at midnight
  useEffect(() => {
    const checkDateChange = () => {
      const today = format(new Date(), 'yyyy-MM-dd')
      const stored = localStorage.getItem(`${STORAGE_KEY}-last-date`)
      if (stored !== today) {
        localStorage.setItem(`${STORAGE_KEY}-last-date`, today)
        setState(prev => ({ ...prev, todayXP: 0 }))
      }
    }
    
    checkDateChange()
    const interval = setInterval(checkDateChange, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])
  
  // Sync with server if userId is provided
  const syncWithServer = useCallback(async () => {
    if (!userId) return
    
    try {
      const response = await fetch(`/api/gamification?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.gamification) {
          setState(prev => ({
            ...prev,
            xp: data.gamification.xp || prev.xp,
            level: data.gamification.level || prev.level,
            streak: data.gamification.streak || prev.streak,
            longestStreak: data.gamification.longestStreak || prev.longestStreak,
            lastActive: data.gamification.lastActive ? new Date(data.gamification.lastActive) : prev.lastActive,
          }))
        }
        if (data.achievements) {
          setState(prev => ({
            ...prev,
            achievements: data.achievements.map((a: { achievement: string }) => a.achievement),
          }))
        }
      }
    } catch {
      // Silent fail - local state is primary
    }
  }, [userId])
  
  // Sync on mount - using a flag to avoid cascading renders
  const syncedRef = useRef(false)
  
  useEffect(() => {
    if (userId && !syncedRef.current) {
      syncedRef.current = true
      // Use setTimeout to defer the sync to avoid cascading renders
      const timer = setTimeout(() => {
        void syncWithServer()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [userId, syncWithServer])
  
  // Record daily activity
  const recordDailyActivity = useCallback(async () => {
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd')
    
    setState(prev => {
      let newStreak = prev.streak
      let newLongestStreak = prev.longestStreak
      
      if (prev.lastActive) {
        const lastActiveStr = format(new Date(prev.lastActive), 'yyyy-MM-dd')
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = format(yesterday, 'yyyy-MM-dd')
        
        if (lastActiveStr === yesterdayStr) {
          // Continuation of streak
          newStreak = prev.streak + 1
        } else if (lastActiveStr !== todayStr) {
          // Streak broken or first activity
          newStreak = 1
        }
        // If lastActiveStr === todayStr, streak stays the same
      } else {
        // First activity ever
        newStreak = 1
      }
      
      newLongestStreak = Math.max(newLongestStreak, newStreak)
      
      const newState = {
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActive: today,
      }
      
      saveState(newState)
      return newState
    })
  }, [])
  
  // Add XP for phase completion
  const addPhaseXP = useCallback(async (phase: number, moduleSlug: ModuleSlug) => {
    await recordDailyActivity()
    
    const xpEarned = calculatePhaseXP(state.streak)
    let newAchievements: string[] = []
    let levelUp = false
    
    setState(prev => {
      const newXP = prev.xp + xpEarned
      const newLevel = calculateLevel(newXP)
      levelUp = newLevel > prev.level
      
      // Check for time-based achievements
      const timeAchievements = checkTimeBasedAchievements()
      const allAchievements = [...prev.achievements]
      
      for (const achievementId of timeAchievements) {
        if (!allAchievements.includes(achievementId)) {
          allAchievements.push(achievementId)
          newAchievements.push(achievementId)
        }
      }
      
      // Check phase achievements
      if (phase === 0 && !allAchievements.includes('first_steps')) {
        allAchievements.push('first_steps')
        newAchievements.push('first_steps')
      }
      if (phase === 1 && !allAchievements.includes('curious_mind')) {
        allAchievements.push('curious_mind')
        newAchievements.push('curious_mind')
      }
      
      const newState = {
        ...prev,
        xp: newXP,
        level: newLevel,
        achievements: allAchievements,
        todayXP: prev.todayXP + xpEarned,
      }
      
      saveState(newState)
      return newState
    })
    
    // Sync with server
    if (userId) {
      try {
        await fetch('/api/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            xpToAdd: xpEarned,
            newAchievements,
          }),
        })
      } catch {
        // Silent fail
      }
    }
    
    return { xpEarned, newAchievements, levelUp }
  }, [state.streak, recordDailyActivity, userId])
  
  // Add XP for daily practice
  const addDailyPracticeXP = useCallback(async () => {
    await recordDailyActivity()
    
    const xpEarned = Math.floor(XP_DAILY_PRACTICE * streakBonus)
    const newAchievements: string[] = []
    
    setState(prev => {
      const newXP = prev.xp + xpEarned
      
      const newState = {
        ...prev,
        xp: newXP,
        todayXP: prev.todayXP + xpEarned,
      }
      
      saveState(newState)
      return newState
    })
    
    return { xpEarned, newAchievements }
  }, [streakBonus, recordDailyActivity])
  
  // Add module complete bonus
  const addModuleCompleteBonus = useCallback(async (moduleSlug: ModuleSlug) => {
    const xpEarned = XP_MODULE_COMPLETE_BONUS
    let newAchievements: string[] = []
    
    setState(prev => {
      const newXP = prev.xp + xpEarned
      const newLevel = calculateLevel(newXP)
      
      // Check for module achievement
      const achievementMap: Record<ModuleSlug, string> = {
        systema: 'system_thinker',
        argos: 'critical_thinker',
        cognos: 'ai_master',
        ludus: 'game_theorist',
      }
      
      const allAchievements = [...prev.achievements]
      const achievementId = achievementMap[moduleSlug]
      
      if (achievementId && !allAchievements.includes(achievementId)) {
        allAchievements.push(achievementId)
        newAchievements.push(achievementId)
      }
      
      const newState = {
        ...prev,
        xp: newXP,
        level: newLevel,
        achievements: allAchievements,
        todayXP: prev.todayXP + xpEarned,
      }
      
      saveState(newState)
      return newState
    })
    
    // Sync with server
    if (userId) {
      try {
        await fetch('/api/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            xpToAdd: xpEarned,
            newAchievements,
          }),
        })
      } catch {
        // Silent fail
      }
    }
    
    return { xpEarned, newAchievements }
  }, [userId])
  
  // Check and unlock achievements
  const checkAndUnlockAchievements = useCallback(async (params: {
    completedPhases: Record<ModuleSlug, number[]>
    totalQuizzes?: number
    totalDailyPractices?: number
    perfectQuiz?: boolean
    firstTryPerfect?: boolean
  }) => {
    const newAchievements = checkForNewAchievements({
      completedPhases: params.completedPhases,
      streak: state.streak,
      totalQuizzes: params.totalQuizzes || 0,
      totalDailyPractices: params.totalDailyPractices || 0,
      existingAchievements: state.achievements,
      perfectQuizToday: params.perfectQuiz,
      firstTryPerfect: params.firstTryPerfect,
    })
    
    if (newAchievements.length > 0) {
      let totalXPReward = 0
      
      setState(prev => {
        const allAchievements = [...prev.achievements]
        
        for (const achievementId of newAchievements) {
          if (!allAchievements.includes(achievementId)) {
            allAchievements.push(achievementId)
            const achievement = getAchievement(achievementId)
            if (achievement) {
              totalXPReward += achievement.xpReward
            }
          }
        }
        
        const newXP = prev.xp + totalXPReward
        const newLevel = calculateLevel(newXP)
        
        const newState = {
          ...prev,
          xp: newXP,
          level: newLevel,
          achievements: allAchievements,
        }
        
        saveState(newState)
        return newState
      })
      
      // Show toast for new achievements
      for (const achievementId of newAchievements) {
        const achievement = getAchievement(achievementId)
        if (achievement) {
          toast.success(`🏆 Thành tựu mới: ${achievement.name}!`, {
            description: achievement.description,
          })
        }
      }
      
      // Sync with server
      if (userId) {
        try {
          await fetch('/api/gamification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              xpToAdd: totalXPReward,
              newAchievements,
            }),
          })
        } catch {
          // Silent fail
        }
      }
    }
    
    return newAchievements
  }, [state.streak, state.achievements, userId])
  
  // Helpers
  const getAchievementById = useCallback((id: string) => getAchievement(id), [])
  const hasAchievement = useCallback((id: string) => state.achievements.includes(id), [state.achievements])
  
  return {
    // State
    xp: state.xp,
    level,
    levelProgress,
    streak: state.streak,
    longestStreak: state.longestStreak,
    streakBonus,
    achievements: state.achievements,
    earnedAchievements,
    todayXP: state.todayXP,
    
    // Actions
    addPhaseXP,
    addDailyPracticeXP,
    addModuleCompleteBonus,
    checkAndUnlockAchievements,
    recordDailyActivity,
    syncWithServer,
    
    // Helpers
    getAchievementById,
    hasAchievement,
  }
}

export default useGamification
