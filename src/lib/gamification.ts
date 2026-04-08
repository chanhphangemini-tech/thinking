// ============================================
// THINKING AI - Gamification System
// Premium gamification logic for XP, Levels, Achievements
// ============================================

import type { ModuleSlug } from './types'

// ============================================
// XP CALCULATION CONSTANTS
// ============================================
export const XP_PER_PHASE = 100
export const XP_STREAK_BONUS_MULTIPLIER = 0.25 // 25% bonus per streak day
export const MAX_STREAK_BONUS = 2.0 // Max 200% bonus
export const XP_DAILY_PRACTICE = 25
export const XP_MODULE_COMPLETE_BONUS = 500
export const XP_ALL_MODULES_BONUS = 2000

// ============================================
// LEVEL SYSTEM
// ============================================
export const MAX_LEVEL = 50

// XP thresholds for each level (cumulative)
export const LEVEL_THRESHOLDS: number[] = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1400,   // Level 7
  1900,   // Level 8
  2500,   // Level 9
  3200,   // Level 10
  4000,   // Level 11
  5000,   // Level 12
  6200,   // Level 13
  7600,   // Level 14
  9200,   // Level 15
  11000,  // Level 16
  13000,  // Level 17
  15200,  // Level 18
  17600,  // Level 19
  20200,  // Level 20
  23000,  // Level 21
  26000,  // Level 22
  29200,  // Level 23
  32600,  // Level 24
  36200,  // Level 25
  40000,  // Level 26
  44000,  // Level 27
  48200,  // Level 28
  52600,  // Level 29
  57200,  // Level 30
  62000,  // Level 31
  67000,  // Level 32
  72200,  // Level 33
  77600,  // Level 34
  83200,  // Level 35
  89000,  // Level 36
  95000,  // Level 37
  101200, // Level 38
  107600, // Level 39
  114200, // Level 40
  121000, // Level 41
  128000, // Level 42
  135200, // Level 43
  142600, // Level 44
  150200, // Level 45
  158000, // Level 46
  166000, // Level 47
  174200, // Level 48
  182600, // Level 49
  191200, // Level 50
]

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================
export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  category: 'progress' | 'streak' | 'mastery' | 'special'
  hidden?: boolean
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // === PROGRESS ACHIEVEMENTS ===
  {
    id: 'first_steps',
    name: 'Bước Đầu Tiên',
    description: 'Hoàn thành Phase 0 của bất kỳ module nào',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    category: 'progress',
  },
  {
    id: 'curious_mind',
    name: 'Tâm Hồn Tò Mò',
    description: 'Hoàn thành phase đầu tiên (Phase 1) của bất kỳ module nào',
    icon: '🧠',
    rarity: 'common',
    xpReward: 100,
    category: 'progress',
  },
  {
    id: 'half_way_there',
    name: 'Nửa Chặng Đường',
    description: 'Hoàn thành 10/20 giai đoạn',
    icon: '🏃',
    rarity: 'uncommon',
    xpReward: 250,
    category: 'progress',
  },
  {
    id: 'completionist',
    name: 'Người Hoàn Thành',
    description: 'Hoàn thành tất cả 20 giai đoạn',
    icon: '🏆',
    rarity: 'legendary',
    xpReward: 2000,
    category: 'progress',
  },

  // === MODULE MASTERY ACHIEVEMENTS ===
  {
    id: 'system_thinker',
    name: 'Nhà Tư Duy Hệ Thống',
    description: 'Hoàn thành tất cả các giai đoạn của SYSTEMA',
    icon: '⚙️',
    rarity: 'rare',
    xpReward: 500,
    category: 'mastery',
  },
  {
    id: 'critical_thinker',
    name: 'Nhà Phản Biện Sắc Sảo',
    description: 'Hoàn thành tất cả các giai đoạn của ARGOS',
    icon: '⚔️',
    rarity: 'rare',
    xpReward: 500,
    category: 'mastery',
  },
  {
    id: 'ai_master',
    name: 'Bậc Thầy AI',
    description: 'Hoàn thành tất cả các giai đoạn của COGNOS',
    icon: '🤖',
    rarity: 'rare',
    xpReward: 500,
    category: 'mastery',
  },
  {
    id: 'game_theorist',
    name: 'Nhà Lý Thuyết Trò Chơi',
    description: 'Hoàn thành tất cả các giai đoạn của LUDUS',
    icon: '🎮',
    rarity: 'rare',
    xpReward: 500,
    category: 'mastery',
  },
  {
    id: 'renaissance_mind',
    name: 'Tư Duy Phục Hưng',
    description: 'Hoàn thành tất cả 4 module',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 2000,
    category: 'mastery',
  },

  // === STREAK ACHIEVEMENTS ===
  {
    id: 'consistent_learner',
    name: 'Người Học Kiên Trì',
    description: 'Duy trì streak 7 ngày liên tiếp',
    icon: '🔥',
    rarity: 'uncommon',
    xpReward: 150,
    category: 'streak',
  },
  {
    id: 'dedicated_scholar',
    name: 'Học Giả Tận Tụy',
    description: 'Duy trì streak 30 ngày liên tiếp',
    icon: '💎',
    rarity: 'rare',
    xpReward: 500,
    category: 'streak',
  },
  {
    id: 'unstoppable',
    name: 'Bất Khả Chiến Bại',
    description: 'Duy trì streak 100 ngày liên tiếp',
    icon: '🌟',
    rarity: 'legendary',
    xpReward: 2000,
    category: 'streak',
  },
  {
    id: 'streak_master',
    name: 'Bậc Thầy Streak',
    description: 'Duy trì streak 7 ngày với tối thiểu 1 hoạt động mỗi ngày',
    icon: '📅',
    rarity: 'uncommon',
    xpReward: 100,
    category: 'streak',
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    id: 'early_bird',
    name: 'Chim Sớm',
    description: 'Học tập trước 8:00 sáng',
    icon: '🌅',
    rarity: 'uncommon',
    xpReward: 50,
    category: 'special',
  },
  {
    id: 'night_owl',
    name: 'Cú Đêm',
    description: 'Học tập sau 10:00 tối',
    icon: '🦉',
    rarity: 'uncommon',
    xpReward: 50,
    category: 'special',
  },
  {
    id: 'speed_learner',
    name: 'Học Nhanh',
    description: 'Hoàn thành một phase trong vòng 15 phút',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 200,
    category: 'special',
    hidden: true,
  },
  {
    id: 'perfectionist',
    name: 'Người Hoàn Hảo',
    description: 'Đạt 8/8 điểm trong một bài quiz',
    icon: '💯',
    rarity: 'epic',
    xpReward: 300,
    category: 'special',
  },
  {
    id: 'first_perfect',
    name: 'Lần Đầu Hoàn Hảo',
    description: 'Đạt điểm tối đa trong lần thử đầu tiên của một phase',
    icon: '✨',
    rarity: 'epic',
    xpReward: 500,
    category: 'special',
    hidden: true,
  },
  {
    id: 'quiz_master',
    name: 'Bậc Thầy Quiz',
    description: 'Hoàn thành 50 bài quiz',
    icon: '📝',
    rarity: 'rare',
    xpReward: 400,
    category: 'progress',
    hidden: true,
  },
  {
    id: 'daily_practitioner',
    name: 'Thực Hành Hàng Ngày',
    description: 'Hoàn thành 30 bài Daily Practice',
    icon: '📚',
    rarity: 'rare',
    xpReward: 300,
    category: 'progress',
    hidden: true,
  },
  {
    id: 'knowledge_seeker',
    name: 'Kẻ Tìm Kiếm Tri Thức',
    description: 'Đọc tất cả tài liệu của một module',
    icon: '📖',
    rarity: 'uncommon',
    xpReward: 150,
    category: 'progress',
  },
  {
    id: 'well_rounded',
    name: 'Tư Duy Toàn Diện',
    description: 'Đọc ít nhất 1 tài liệu từ mỗi module',
    icon: '🌐',
    rarity: 'common',
    xpReward: 50,
    category: 'progress',
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate level from total XP
 */
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) return 0
  return LEVEL_THRESHOLDS[currentLevel] || 0
}

/**
 * Get XP progress within current level (0-100%)
 */
export function getLevelProgress(xp: number): { current: number; required: number; percentage: number } {
  const currentLevel = calculateLevel(xp)
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  
  const current = xp - currentThreshold
  const required = nextThreshold - currentThreshold
  const percentage = required > 0 ? Math.min(100, (current / required) * 100) : 100
  
  return { current, required, percentage }
}

/**
 * Calculate XP earned for phase completion with streak bonus
 */
export function calculatePhaseXP(streakDays: number): number {
  const streakBonus = Math.min(MAX_STREAK_BONUS, 1 + (streakDays * XP_STREAK_BONUS_MULTIPLIER))
  return Math.floor(XP_PER_PHASE * streakBonus)
}

/**
 * Calculate streak bonus multiplier
 */
export function getStreakBonusMultiplier(streakDays: number): number {
  return Math.min(MAX_STREAK_BONUS, 1 + (streakDays * XP_STREAK_BONUS_MULTIPLIER))
}

/**
 * Check if a streak should be maintained (activity within last 24 hours)
 */
export function shouldMaintainStreak(lastActiveDate: Date | null, currentDate: Date = new Date()): boolean {
  if (!lastActiveDate) return false
  
  const diffMs = currentDate.getTime() - lastActiveDate.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return diffHours <= 36 // Give 36 hour grace period
}

/**
 * Check if streak is broken
 */
export function isStreakBroken(lastActiveDate: Date | null, currentDate: Date = new Date()): boolean {
  if (!lastActiveDate) return false
  
  const diffMs = currentDate.getTime() - lastActiveDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  
  return diffDays > 1 // More than 1 day gap = broken streak
}

/**
 * Get achievement by ID
 */
export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

/**
 * Get all achievements by category
 */
export function getAchievementsByCategory(category: AchievementDefinition['category']): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => a.category === category && !a.hidden)
}

/**
 * Get visible achievements (non-hidden)
 */
export function getVisibleAchievements(): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => !a.hidden)
}

/**
 * Check time-based achievements
 */
export function checkTimeBasedAchievements(): string[] {
  const achievements: string[] = []
  const hour = new Date().getHours()
  
  if (hour < 8) {
    achievements.push('early_bird')
  }
  
  if (hour >= 22) {
    achievements.push('night_owl')
  }
  
  return achievements
}

/**
 * Get level badge color
 */
export function getLevelBadgeColor(level: number): string {
  if (level >= 50) return 'from-amber-400 to-yellow-300' // Legendary
  if (level >= 40) return 'from-purple-400 to-pink-400' // Epic
  if (level >= 25) return 'from-cyan-400 to-blue-400' // Rare
  if (level >= 10) return 'from-green-400 to-emerald-400' // Uncommon
  return 'from-gray-400 to-slate-400' // Common
}

/**
 * Get level title
 */
export function getLevelTitle(level: number): string {
  if (level >= 50) return 'Huyền Thoại'
  if (level >= 40) return 'Bậc Thầy'
  if (level >= 30) return 'Chuyên Gia'
  if (level >= 20) return 'Thành Thạo'
  if (level >= 10) return 'Có Kinh Nghiệm'
  if (level >= 5) return 'Người Học'
  return 'Người Mới'
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: AchievementDefinition['rarity']): string {
  switch (rarity) {
    case 'legendary': return 'from-amber-500 to-yellow-400 border-amber-500/50'
    case 'epic': return 'from-purple-500 to-pink-500 border-purple-500/50'
    case 'rare': return 'from-cyan-500 to-blue-500 border-cyan-500/50'
    case 'uncommon': return 'from-green-500 to-emerald-500 border-green-500/50'
    default: return 'from-gray-400 to-slate-400 border-gray-500/50'
  }
}

/**
 * Get rarity glow
 */
export function getRarityGlow(rarity: AchievementDefinition['rarity']): string {
  switch (rarity) {
    case 'legendary': return 'shadow-amber-500/30'
    case 'epic': return 'shadow-purple-500/30'
    case 'rare': return 'shadow-cyan-500/30'
    case 'uncommon': return 'shadow-green-500/30'
    default: return 'shadow-gray-500/20'
  }
}

/**
 * Calculate module completion progress
 */
export function calculateModuleProgress(
  completedPhases: number[],
  totalPhases: number = 5
): { percentage: number; isComplete: boolean } {
  const percentage = Math.min(100, (completedPhases.length / totalPhases) * 100)
  const isComplete = completedPhases.length >= totalPhases
  return { percentage, isComplete }
}

/**
 * Check for new achievements based on progress
 */
export function checkForNewAchievements(params: {
  completedPhases: Record<ModuleSlug, number[]>
  streak: number
  totalQuizzes: number
  totalDailyPractices: number
  existingAchievements: string[]
  perfectQuizToday?: boolean
  firstTryPerfect?: boolean
}): string[] {
  const newAchievements: string[] = []
  const { completedPhases, streak, totalQuizzes, totalDailyPractices, existingAchievements, perfectQuizToday, firstTryPerfect } = params
  
  // Count totals
  const allPhases = Object.values(completedPhases).flat()
  const totalPhases = allPhases.length
  const completedModules = Object.values(completedPhases).filter(p => p.length >= 5).length
  
  // Check each achievement
  if (!existingAchievements.includes('first_steps') && totalPhases >= 1) {
    newAchievements.push('first_steps')
  }
  
  if (!existingAchievements.includes('curious_mind') && allPhases.some(p => p === 1)) {
    newAchievements.push('curious_mind')
  }
  
  if (!existingAchievements.includes('half_way_there') && totalPhases >= 10) {
    newAchievements.push('half_way_there')
  }
  
  if (!existingAchievements.includes('completionist') && totalPhases >= 20) {
    newAchievements.push('completionist')
  }
  
  // Module mastery
  if (!existingAchievements.includes('system_thinker') && completedPhases.systema?.length >= 5) {
    newAchievements.push('system_thinker')
  }
  if (!existingAchievements.includes('critical_thinker') && completedPhases.argos?.length >= 5) {
    newAchievements.push('critical_thinker')
  }
  if (!existingAchievements.includes('ai_master') && completedPhases.cognos?.length >= 5) {
    newAchievements.push('ai_master')
  }
  if (!existingAchievements.includes('game_theorist') && completedPhases.ludus?.length >= 5) {
    newAchievements.push('game_theorist')
  }
  if (!existingAchievements.includes('renaissance_mind') && completedModules >= 4) {
    newAchievements.push('renaissance_mind')
  }
  
  // Streak achievements
  if (!existingAchievements.includes('consistent_learner') && streak >= 7) {
    newAchievements.push('consistent_learner')
  }
  if (!existingAchievements.includes('dedicated_scholar') && streak >= 30) {
    newAchievements.push('dedicated_scholar')
  }
  if (!existingAchievements.includes('unstoppable') && streak >= 100) {
    newAchievements.push('unstoppable')
  }
  if (!existingAchievements.includes('streak_master') && streak >= 7) {
    newAchievements.push('streak_master')
  }
  
  // Quiz achievements
  if (!existingAchievements.includes('quiz_master') && totalQuizzes >= 50) {
    newAchievements.push('quiz_master')
  }
  
  // Practice achievements
  if (!existingAchievements.includes('daily_practitioner') && totalDailyPractices >= 30) {
    newAchievements.push('daily_practitioner')
  }
  
  // Special achievements
  if (!existingAchievements.includes('perfectionist') && perfectQuizToday) {
    newAchievements.push('perfectionist')
  }
  
  if (!existingAchievements.includes('first_perfect') && firstTryPerfect) {
    newAchievements.push('first_perfect')
  }
  
  return newAchievements
}

/**
 * Format XP number with K suffix for large numbers
 */
export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}
