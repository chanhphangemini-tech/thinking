'use client'

import { motion } from 'framer-motion'
import { Crown, Star } from 'lucide-react'
import { getLevelBadgeColor, getLevelTitle } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
  animated?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { badge: 'w-10 h-10', text: 'text-base', icon: 'w-3 h-3' },
  md: { badge: 'w-14 h-14', text: 'text-xl', icon: 'w-4 h-4' },
  lg: { badge: 'w-20 h-20', text: 'text-3xl', icon: 'w-5 h-5' },
}

export function LevelBadge({
  level,
  size = 'md',
  showTitle = true,
  animated = true,
  className,
}: LevelBadgeProps) {
  const sizeConfig = SIZE_MAP[size]
  const gradientColor = getLevelBadgeColor(level)
  const levelTitle = getLevelTitle(level)
  const isHighLevel = level >= 25
  const isMaxLevel = level >= 50

  return (
    <div className={cn('relative', className)}>
      {/* Outer glow */}
      {isHighLevel && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute inset-0 rounded-2xl bg-gradient-to-br blur-lg',
            gradientColor
          )}
        />
      )}

      {/* Badge container */}
      <motion.div
        initial={animated ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={cn(
          'relative rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center',
          'border-2 shadow-lg',
          sizeConfig.badge,
          gradientColor,
          isMaxLevel ? 'border-amber-300 shadow-amber-500/40' : 'border-white/20 shadow-white/10'
        )}
      >
        {/* Level number */}
        <div className="flex items-center gap-0.5">
          {isMaxLevel && <Crown className={cn(sizeConfig.icon, 'text-amber-200')} />}
          <span className={cn('font-bold text-white', sizeConfig.text)}>
            {level}
          </span>
          {isMaxLevel && <Star className={cn(sizeConfig.icon, 'text-amber-200')} />}
        </div>

        {/* Level title */}
        {showTitle && size !== 'sm' && (
          <span className="text-[10px] text-white/70 font-medium">
            {levelTitle}
          </span>
        )}
      </motion.div>
    </div>
  )
}

interface LevelUpAnimationProps {
  level: number
  onAnimationEnd?: () => void
  className?: string
}

export function LevelUpAnimation({
  level,
  onAnimationEnd,
  className,
}: LevelUpAnimationProps) {
  const gradientColor = getLevelBadgeColor(level)
  const levelTitle = getLevelTitle(level)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      onAnimationComplete={onAnimationEnd}
      className={cn(
        'flex flex-col items-center gap-4 p-6 rounded-3xl',
        'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
        'border border-white/20 shadow-2xl',
        className
      )}
    >
      {/* Glow background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className={cn(
          'absolute inset-0 rounded-3xl opacity-20 blur-2xl bg-gradient-to-br',
          gradientColor
        )}
      />

      {/* Level badge */}
      <LevelBadge level={level} size="lg" animated={false} showTitle={false} />

      {/* Text */}
      <div className="text-center">
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-1"
        >
          Level Up! 🎉
        </motion.p>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          Bạn đã đạt <span className="text-cyan-400 font-medium">{levelTitle}</span>
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LevelBadge
