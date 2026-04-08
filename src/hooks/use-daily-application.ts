'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ModuleSlug } from '@/lib/types'

// ============================================
// Types
// ============================================
interface DailyApplication {
  id: string
  module_slug: ModuleSlug
  application_date: string
  description: string
  context: 'work' | 'daily' | 'personal'
  effectiveness: number
  created_at: string
}

interface DailyStats {
  todayCount: number
  streak: number
  totalApplications: number
  moduleStats: Record<ModuleSlug, number>
}

// ============================================
// Storage Key
// ============================================
const STORAGE_KEY = 'thinking-ai-daily-applications'

// ============================================
// Hook
// ============================================
export function useDailyApplication(userId?: string) {
  const [applications, setApplications] = useState<DailyApplication[]>([])
  const [stats, setStats] = useState<DailyStats>({
    todayCount: 0,
    streak: 0,
    totalApplications: 0,
    moduleStats: { systema: 0, argos: 0, cognos: 0, ludus: 0 },
  })
  const [loading, setLoading] = useState(true)

  // Load applications from storage
  useEffect(() => {
    const loadApplications = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const apps: DailyApplication[] = JSON.parse(stored)
          setApplications(apps)
          calculateStats(apps)
        }
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  // Calculate statistics
  const calculateStats = useCallback((apps: DailyApplication[]) => {
    const today = new Date().toISOString().split('T')[0]
    
    // Today count
    const todayApps = apps.filter(app => app.application_date === today)
    
    // Streak calculation
    let streak = 0
    const dates = [...new Set(apps.map(app => app.application_date))].sort().reverse()
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      const expectedDateStr = expectedDate.toISOString().split('T')[0]
      
      if (dates.includes(expectedDateStr)) {
        streak++
      } else {
        break
      }
    }

    // Module stats
    const moduleStats: Record<ModuleSlug, number> = {
      systema: apps.filter(a => a.module_slug === 'systema').length,
      argos: apps.filter(a => a.module_slug === 'argos').length,
      cognos: apps.filter(a => a.module_slug === 'cognos').length,
      ludus: apps.filter(a => a.module_slug === 'ludus').length,
    }

    setStats({
      todayCount: todayApps.length,
      streak,
      totalApplications: apps.length,
      moduleStats,
    })
  }, [])

  // Log new application
  const logApplication = useCallback(async (data: {
    module_slug: ModuleSlug
    application_date: string
    description: string
    context: 'work' | 'daily' | 'personal'
    effectiveness: number
  }) => {
    const newApplication: DailyApplication = {
      id: `app-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }

    // Update local storage
    const updatedApps = [newApplication, ...applications].slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApps))
    setApplications(updatedApps)
    calculateStats(updatedApps)

    // If user is logged in, also save to API
    if (userId) {
      try {
        await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            moduleSlug: data.module_slug,
            type: 'daily_practice',
            content: {
              description: data.description,
              context: data.context,
              effectiveness: data.effectiveness,
            },
          }),
        })
      } catch {
        // Silent fail - local storage is primary
      }
    }

    return newApplication
  }, [applications, userId, calculateStats])

  // Get applications by date range
  const getApplicationsByDateRange = useCallback((startDate: string, endDate: string) => {
    return applications.filter(app => 
      app.application_date >= startDate && app.application_date <= endDate
    )
  }, [applications])

  // Get applications by module
  const getApplicationsByModule = useCallback((moduleSlug: ModuleSlug) => {
    return applications.filter(app => app.module_slug === moduleSlug)
  }, [applications])

  // Delete application
  const deleteApplication = useCallback((id: string) => {
    const updatedApps = applications.filter(app => app.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApps))
    setApplications(updatedApps)
    calculateStats(updatedApps)
  }, [applications, calculateStats])

  // Check if daily goal is met
  const isDailyGoalMet = stats.todayCount >= 5

  // Get XP earned today
  const xpToday = stats.todayCount * 10

  // Get next milestone
  const getNextMilestone = useCallback(() => {
    const milestones = [
      { count: 7, reward: 'Tuần đầu tiên!' },
      { count: 30, reward: 'Tháng đầu tiên!' },
      { count: 100, reward: 'Bậc thầy thực hành!' },
      { count: 365, reward: 'Một năm không ngừng!' },
    ]
    
    return milestones.find(m => stats.totalApplications < m.count) || milestones[milestones.length - 1]
  }, [stats.totalApplications])

  return {
    applications,
    stats,
    loading,
    logApplication,
    getApplicationsByDateRange,
    getApplicationsByModule,
    deleteApplication,
    isDailyGoalMet,
    xpToday,
    getNextMilestone,
  }
}

export default useDailyApplication
