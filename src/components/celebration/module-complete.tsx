'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trophy, Sparkles, X, ArrowRight } from 'lucide-react'
import { MODULES } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ModuleCompleteCelebrationProps {
  moduleSlug: ModuleSlug
  xpEarned: number
  open: boolean
  onClose: () => void
  onViewNextModule?: () => void
}

export function ModuleCompleteCelebration({
  moduleSlug,
  xpEarned,
  open,
  onClose,
  onViewNextModule,
}: ModuleCompleteCelebrationProps) {
  const mod = MODULES[moduleSlug]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-transparent border-0 shadow-none p-0">
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
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute inset-0 rounded-3xl blur-3xl',
                  'bg-gradient-to-br',
                  mod.bgGradient.replace('from-', 'from-').replace('via-', '').replace('to-', 'to-')
                )}
              />

              {/* Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/20 p-8 text-center overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>

                {/* Trophy icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={cn(
                    'w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center',
                    mod.accentBg,
                    'border-2',
                    mod.borderColor
                  )}
                >
                  <Trophy className={cn('w-10 h-10', mod.color)} />
                </motion.div>

                {/* Module name */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn('text-2xl font-bold mb-1', mod.color)}
                >
                  {mod.name} Mastered!
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/50 mb-6"
                >
                  {mod.subtitle}
                </motion.p>

                {/* XP earned */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-xl font-bold text-white">+{xpEarned} XP</span>
                    </div>
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <p className="text-sm text-white/40 mb-2">Thành tựu đã mở khóa:</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl">{moduleSlug === 'systema' ? '⚙️' : moduleSlug === 'argos' ? '⚔️' : moduleSlug === 'cognos' ? '🤖' : '🎮'}</span>
                    <span className="text-sm text-white/60">
                      {moduleSlug === 'systema' && 'Nhà Tư Duy Hệ Thống'}
                      {moduleSlug === 'argos' && 'Nhà Phản Biện Sắc Sảo'}
                      {moduleSlug === 'cognos' && 'Bậc Thầy AI'}
                      {moduleSlug === 'ludus' && 'Nhà Lý Thuyết Trò Chơi'}
                    </span>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Xem lại module
                  </Button>
                  <Button
                    onClick={onViewNextModule || onClose}
                    className={cn(
                      'font-medium',
                      'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white'
                    )}
                  >
                    Khám phá module khác
                    <ArrowRight className="w-4 h-4 ml-2" />
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

export default ModuleCompleteCelebration
