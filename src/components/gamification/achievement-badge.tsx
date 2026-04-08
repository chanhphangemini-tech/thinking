'use client'

import { motion } from 'framer-motion'
import { getRarityColor, getRarityGlow, type AchievementDefinition } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: AchievementDefinition
  earned?: boolean
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { container: 'w-12 h-12', icon: 'text-lg', text: 'text-[10px]' },
  md: { container: 'w-16 h-16', icon: 'text-2xl', text: 'text-xs' },
  lg: { container: 'w-20 h-20', icon: 'text-3xl', text: 'text-sm' },
}

export function AchievementBadge({
  achievement,
  earned = true,
  size = 'md',
  showDetails = false,
  className,
}: AchievementBadgeProps) {
  const sizeConfig = SIZE_MAP[size]
  const rarityColor = getRarityColor(achievement.rarity)
  const rarityGlow = getRarityGlow(achievement.rarity)

  if (!earned) {
    return (
      <div
        className={cn(
          'relative rounded-xl bg-white/5 border border-white/10 flex items-center justify-center',
          sizeConfig.container,
          className
        )}
        title="Chưa mở khóa"
      >
        <span className="text-lg opacity-30">?</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn('relative', className)}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-br blur-md opacity-50',
          rarityColor
        )}
      />

      {/* Badge container */}
      <div
        className={cn(
          'relative rounded-xl bg-gradient-to-br border-2 flex flex-col items-center justify-center shadow-lg',
          sizeConfig.container,
          rarityColor,
          rarityGlow
        )}
      >
        <span className={sizeConfig.icon}>{achievement.icon}</span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={cn('font-medium text-white/80', sizeConfig.text)}>
            {achievement.name}
          </p>
          <p className="text-[10px] text-white/40 capitalize">{achievement.rarity}</p>
        </div>
      )}
    </motion.div>
  )
}

interface AchievementBadgeListProps {
  achievements: AchievementDefinition[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AchievementBadgeList({
  achievements,
  maxDisplay = 5,
  size = 'sm',
  className,
}: AchievementBadgeListProps) {
  const displayAchievements = achievements.slice(0, maxDisplay)
  const remaining = achievements.length - maxDisplay

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {displayAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
          earned={true}
        />
      ))}
      {remaining > 0 && (
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50">
          +{remaining}
        </div>
      )}
    </div>
  )
}

export default AchievementBadge
