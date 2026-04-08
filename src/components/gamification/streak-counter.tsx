'use client'

import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { getStreakBonusMultiplier } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface StreakCounterProps {
  streak: number
  longestStreak: number
  compact?: boolean
  showBonus?: boolean
  className?: string
}

export function StreakCounter({
  streak,
  longestStreak,
  compact = false,
  showBonus = true,
  className,
}: StreakCounterProps) {
  const bonus = getStreakBonusMultiplier(streak)
  const bonusPercent = Math.round((bonus - 1) * 100)
  const hasStreak = streak > 0

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <motion.div
          animate={hasStreak ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3, repeat: hasStreak ? Infinity : 0, repeatDelay: 2 }}
        >
          <Flame
            className={cn(
              'w-4 h-4',
              hasStreak ? 'text-orange-400' : 'text-white/20'
            )}
          />
        </motion.div>
        <span className={cn(
          'font-bold text-sm',
          hasStreak ? 'text-orange-400' : 'text-white/30'
        )}>
          {streak}
        </span>
        {showBonus && hasStreak && bonus > 1 && (
          <span className="text-[10px] text-orange-300/60">
            (+{bonusPercent}%)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Fire icon with animation */}
      <motion.div
        animate={hasStreak ? {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: hasStreak ? Infinity : 0,
          repeatDelay: 3,
        }}
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          hasStreak
            ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30'
            : 'bg-white/5 border border-white/10'
        )}
      >
        <Flame
          className={cn(
            'w-6 h-6',
            hasStreak ? 'text-orange-400' : 'text-white/20'
          )}
        />
      </motion.div>

      {/* Streak info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-2xl font-bold',
            hasStreak ? 'text-orange-400' : 'text-white/30'
          )}>
            {streak}
          </span>
          <span className="text-sm text-white/50">ngày</span>
          {hasStreak && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30"
            >
              <Zap className="w-3 h-3 text-orange-300" />
              <span className="text-xs text-orange-300 font-medium">
                +{bonusPercent}% XP
              </span>
            </motion.div>
          )}
        </div>
        <p className="text-xs text-white/30">
          Kỷ lục: {longestStreak} ngày
        </p>
      </div>
    </div>
  )
}

interface StreakCalendarProps {
  streakData: { date: string; completed: boolean; xpEarned: number }[]
  startDate?: Date
  className?: string
}

export function StreakCalendar({
  streakData,
  startDate,
  className,
}: StreakCalendarProps) {
  // Generate last 30 days
  const days = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayData = streakData.find(d => d.date === dateStr)
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      completed: dayData?.completed || false,
      xp: dayData?.xpEarned || 0,
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">30 ngày gần nhất</span>
        <span className="text-xs text-white/30">
          {streakData.filter(d => d.completed).length} ngày hoạt động
        </span>
      </div>
      
      <div className="grid grid-cols-10 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={cn(
              'aspect-square rounded-sm text-[8px] flex items-center justify-center',
              day.completed
                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
                : 'bg-white/5 text-white/20'
            )}
            title={`${day.date}: ${day.completed ? `${day.xp} XP` : 'Không có hoạt động'}`}
          >
            {day.day}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default StreakCounter
