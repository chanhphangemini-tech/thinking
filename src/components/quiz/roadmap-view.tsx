'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle2, Lock, ArrowRight, Star, RotateCcw } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

interface RoadmapViewProps {
  progress: Record<ModuleSlug, number[]>
}

export function RoadmapView({ progress }: RoadmapViewProps) {
  const nav = useNavigation()
  
  if (!nav.currentModule) return null
  
  const mod = MODULES[nav.currentModule]
  const passedPhases = progress[nav.currentModule]
  const passedCount = passedPhases.length
  const nextPhase = passedCount < 5 ? passedCount + 1 : null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${mod.bgGradient}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Module Header */}
        <div className="mb-8">
          <button
            onClick={nav.goHome}
            className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`${mod.color} p-2 rounded-lg ${mod.accentBg}`}>{mod.icon}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{mod.name}</h1>
              <p className={`${mod.color} text-sm`}>{mod.subtitle}</p>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-2">{mod.description}</p>
        </div>

        {/* Overall Progress */}
        <div className="mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Tiến độ tổng thể</span>
            <span className="text-sm font-medium">{passedCount}/5 giai đoạn</span>
          </div>
          <Progress value={(passedCount / 5) * 100} className="h-2.5" />
        </div>

        {/* Phase Cards Roadmap */}
        <div className="space-y-0">
          {mod.phases.map((phaseInfo, idx) => {
            const isPassed = passedPhases.includes(phaseInfo.phase)
            const isCurrent = nextPhase === phaseInfo.phase
            const isLocked = phaseInfo.phase > 1 && !passedPhases.includes(phaseInfo.phase - 1)
            const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule!]?.[phaseInfo.phase] || ''

            return (
              <div key={phaseInfo.phase}>
                {/* Connecting Line */}
                {idx > 0 && (
                  <div className="flex items-center ml-6 py-1">
                    <div className={`w-0.5 h-6 ${isLocked ? 'bg-white/5' : isPassed ? 'bg-green-500/40' : 'bg-white/10'}`} />
                  </div>
                )}

                {/* Phase Card */}
                <Card className={`border transition-all ${
                  isLocked
                    ? 'border-white/5 bg-white/[0.01] opacity-50'
                    : isCurrent
                      ? `border-current ${mod.color} ${mod.accentBg} shadow-lg`
                      : isPassed
                        ? 'border-green-500/20 bg-green-500/[0.03]'
                        : 'border-white/10 bg-white/[0.02]'
                }`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Phase Number Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border ${
                        isPassed
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : isCurrent
                            ? `bg-white/10 border-current ${mod.color}`
                            : 'bg-white/5 border-white/10 text-white/30'
                      }`}>
                        {isPassed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          phaseInfo.phase
                        )}
                      </div>

                      {/* Phase Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className={`font-semibold text-sm sm:text-base ${
                              isPassed ? 'text-green-400' : isCurrent ? 'text-white' : isLocked ? 'text-white/30' : 'text-white/60'
                            }`}>
                              {phaseInfo.title}: {phaseInfo.name}
                            </h3>
                          </div>
                          {/* Status Badge */}
                          {isPassed ? (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs shrink-0">
                              ✅ Hoàn thành
                            </Badge>
                          ) : isCurrent ? (
                            <Badge variant="secondary" className={`shrink-0 text-xs ${mod.accentBg} ${mod.color} border-current`}>
                              <Star className="w-3 h-3 mr-1" />
                              Hiện tại
                            </Badge>
                          ) : isLocked ? (
                            <Badge variant="secondary" className="bg-white/5 text-white/20 border-white/10 text-xs shrink-0">
                              🔒 Khóa
                            </Badge>
                          ) : null}
                        </div>
                        <p className={`text-sm leading-relaxed ${isLocked ? 'text-white/15' : 'text-white/40'}`}>
                          {phaseDesc}
                        </p>

                        {/* Action Button */}
                        <div className="mt-3">
                          {isPassed ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => nav.startPhase(phaseInfo.phase)}
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Ôn tập lại
                            </Button>
                          ) : isCurrent ? (
                            <Button
                              size="sm"
                              onClick={() => nav.startPhase(phaseInfo.phase)}
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
                            >
                              Bắt đầu học
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          ) : isLocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-white/10 text-white/20 cursor-not-allowed"
                            >
                              <Lock className="w-3.5 h-3.5 mr-1" />
                              Khóa
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
