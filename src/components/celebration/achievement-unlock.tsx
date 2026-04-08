'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, X } from 'lucide-react'
import { AchievementBadge } from '@/components/gamification/achievement-badge'
import { getAchievement, getRarityColor, type AchievementDefinition } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface AchievementUnlockProps {
  achievementId: string | null
  open: boolean
  onClose: () => void
}

export function AchievementUnlock({
  achievementId,
  open,
  onClose,
}: AchievementUnlockProps) {
  const achievement = achievementId ? getAchievement(achievementId) : null

  if (!achievement) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-transparent border-0 shadow-none p-0">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Background glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute inset-0 rounded-3xl blur-3xl',
                  'bg-gradient-to-br',
                  getRarityColor(achievement.rarity)
                )}
              />

              {/* Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/20 p-6 text-center">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>

                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                    Thành Tựu Mới!
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>

                {/* Achievement badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex justify-center mb-4"
                >
                  <AchievementBadge
                    achievement={achievement}
                    size="lg"
                    showDetails
                  />
                </motion.div>

                {/* Achievement name */}
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-white mb-2"
                >
                  {achievement.name}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-white/60 mb-4"
                >
                  {achievement.description}
                </motion.p>

                {/* XP reward */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  <div className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                    <span className="text-cyan-400 font-medium">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium"
                  >
                    Tuyệt vời!
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

interface AchievementUnlockInlineProps {
  achievement: AchievementDefinition
  className?: string
}

export function AchievementUnlockInline({
  achievement,
  className,
}: AchievementUnlockInlineProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-gradient-to-r from-amber-500/10 to-transparent',
        'border border-amber-500/20',
        className
      )}
    >
      <AchievementBadge achievement={achievement} size="md" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-medium uppercase">Thành tựu mới!</span>
        </div>
        <p className="font-medium text-white">{achievement.name}</p>
        <p className="text-xs text-white/50">+{achievement.xpReward} XP</p>
      </div>
    </motion.div>
  )
}

export default AchievementUnlock
