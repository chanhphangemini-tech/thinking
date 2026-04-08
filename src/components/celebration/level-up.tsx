'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, Sparkles, X, Star } from 'lucide-react'
import { LevelBadge } from '@/components/gamification/level-badge'
import { getLevelBadgeColor, getLevelTitle } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface LevelUpCelebrationProps {
  level: number
  open: boolean
  onClose: () => void
}

export function LevelUpCelebration({
  level,
  open,
  onClose,
}: LevelUpCelebrationProps) {
  const gradientColor = getLevelBadgeColor(level)
  const levelTitle = getLevelTitle(level)
  const isHighLevel = level >= 25
  const isMaxLevel = level >= 50

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
                  gradientColor
                )}
              />

              {/* Rotating stars for high levels */}
              {isHighLevel && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(8)].map((_, i) => (
                    <Star
                      key={i}
                      className="absolute w-3 h-3 text-amber-400/40"
                      style={{
                        top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                        left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/20 p-8 text-center overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>

                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  {isMaxLevel ? (
                    <Crown className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  )}
                  <span className="text-lg font-bold text-white uppercase tracking-wider">
                    Level Up!
                  </span>
                  {isMaxLevel ? (
                    <Crown className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  )}
                </motion.div>

                {/* Level badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex justify-center mb-6"
                >
                  <LevelBadge level={level} size="lg" animated={false} showTitle={false} />
                </motion.div>

                {/* Level number */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <span className="text-5xl font-bold text-white">{level}</span>
                </motion.div>

                {/* Level title */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/70 mb-2"
                >
                  {levelTitle}
                </motion.p>

                {/* Congratulations message */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-white/50 mb-6"
                >
                  {isMaxLevel
                    ? 'Chúc mừng! Bạn đã đạt cấp độ tối đa! 🎉'
                    : 'Tiếp tục học tập để lên cấp cao hơn!'}
                </motion.p>

                {/* Action button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={onClose}
                    className={cn(
                      'font-medium px-8',
                      isMaxLevel
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white'
                    )}
                  >
                    {isMaxLevel ? 'Tuyệt vời!' : 'Tiếp tục học'}
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

export default LevelUpCelebration
