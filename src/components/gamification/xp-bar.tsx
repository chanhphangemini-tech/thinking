'use client'

import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Sparkles } from 'lucide-react'
import { formatXP, getLevelTitle, type LEVEL_THRESHOLDS } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface XPBarProps {
  xp: number
  level: number
  progress: { current: number; required: number; percentage: number }
  showLevel?: boolean
  animated?: boolean
  className?: string
}

export function XPBar({
  xp,
  level,
  progress,
  showLevel = true,
  animated = true,
  className,
}: XPBarProps) {
  const levelTitle = getLevelTitle(level)

  return (
    <div className={cn('space-y-2', className)}>
      {/* Level and XP display */}
      {showLevel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <motion.div
                initial={animated ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                  'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                )}
              >
                {level}
              </motion.div>
              <span className="text-xs text-white/50">{levelTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400 font-medium">{formatXP(xp)} XP</span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <Progress
          value={progress.percentage}
          className="h-2 bg-white/10"
        />
        
        {/* Animated shine effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          >
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        )}
      </div>

      {/* Progress text */}
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{progress.current} / {progress.required} XP</span>
        <span>{Math.round(progress.percentage)}%</span>
      </div>
    </div>
  )
}

interface XPGainAnimationProps {
  amount: number
  onAnimationEnd?: () => void
  className?: string
}

export function XPGainAnimation({
  amount,
  onAnimationEnd,
  className,
}: XPGainAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onAnimationEnd}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-full',
        'bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm',
        'shadow-lg shadow-cyan-500/30',
        className
      )}
    >
      <Sparkles className="w-4 h-4" />
      <span>+{amount} XP</span>
    </motion.div>
  )
}

export default XPBar
