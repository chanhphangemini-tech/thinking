'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle2, ArrowRight, Star, RotateCcw, BookOpen, Target } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS, PASS_THRESHOLD } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

interface RoadmapViewProps {
  progress: Record<ModuleSlug, number[]>
  onStartQuiz: (module: ModuleSlug, phase: number) => void
  onOpenDocs: (module: ModuleSlug, phase: number) => void
}

export function RoadmapView({ progress, onStartQuiz, onOpenDocs }: RoadmapViewProps) {
  const nav = useNavigation()
  
  if (!nav.currentModule) return null
  
  const mod = MODULES[nav.currentModule]
  const passedPhases = progress[nav.currentModule] || []
  const passedCount = passedPhases.length

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
            <span className="text-sm text-white/50">Tiến độ hoàn thành</span>
            <span className="text-sm font-medium">{passedCount}/5 giai đoạn</span>
          </div>
          <Progress value={(passedCount / 5) * 100} className="h-2.5" />
        </div>

        {/* Phase Cards Roadmap - No Locking */}
        <div className="space-y-4">
          {mod.phases.map((phaseInfo) => {
            const isPassed = passedPhases.includes(phaseInfo.phase)
            const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule!]?.[phaseInfo.phase] || ''

            return (
              <Card key={phaseInfo.phase} className={`border transition-all ${
                isPassed
                  ? 'border-green-500/20 bg-green-500/[0.03]'
                  : 'border-white/10 bg-white/[0.02]'
              }`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Phase Number Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border ${
                      isPassed
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/50'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        phaseInfo.phase
                      )}
                    </div>

                    {/* Phase Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className={`font-semibold text-sm sm:text-base ${
                            isPassed ? 'text-green-400' : 'text-white/80'
                          }`}>
                            {phaseInfo.title}: {phaseInfo.name}
                          </h3>
                        </div>
                        {isPassed && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs shrink-0">
                            ✅ Đã qua
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">{phaseDesc}</p>

                      {/* Action Buttons - No Locking */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenDocs(nav.currentModule!, phaseInfo.phase)}
                          className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1" />
                          Đọc tài liệu
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onStartQuiz(nav.currentModule!, phaseInfo.phase)}
                          className={`${isPassed ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'bg-cyan-500 hover:bg-cyan-400 text-black font-medium'}`}
                          variant={isPassed ? 'outline' : 'default'}
                        >
                          {isPassed ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Làm lại
                            </>
                          ) : (
                            <>
                              <Target className="w-3.5 h-3.5 mr-1" />
                              Làm bài test
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
