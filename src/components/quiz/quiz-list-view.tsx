'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, Circle, PenLine, Sparkles, Target, Trophy, RotateCcw, ChevronRight } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS, PASS_THRESHOLD } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

interface QuizListViewProps {
  onStartQuiz: (module: ModuleSlug, phase: number) => void
  progress: Record<ModuleSlug, number[]>
  checklist: Record<ModuleSlug, Set<number>>
  onToggleCompleted: (module: ModuleSlug, phase: number) => void
}

export function QuizListView({ onStartQuiz, progress, checklist, onToggleCompleted }: QuizListViewProps) {
  const nav = useNavigation()

  if (!nav.currentModule) return null

  const mod = MODULES[nav.currentModule]
  const moduleCheckCount = checklist[nav.currentModule]?.size || 0
  const totalPhases = mod.phases.length
  const checkPercent = totalPhases > 0 ? (moduleCheckCount / totalPhases) * 100 : 0

  // Phase level labels for visual hierarchy
  const phaseLabels = ['Cơ bản', 'Nền tảng', 'Nâng cao', 'Thực chiến', 'Tổng hợp']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Module Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${mod.accentBg} border ${mod.borderColor}`}>
            <span className={mod.color}>{mod.icon}</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{mod.name}</h1>
            <p className={`text-sm ${mod.color} font-medium`}>{mod.subtitle}</p>
          </div>
        </div>
        <p className="text-white/50 text-sm leading-relaxed mb-2">{mod.description}</p>
        <p className="text-white/30 text-xs">Mỗi giai đoạn có 5 câu hỏi trắc nghiệm. Cần đúng {PASS_THRESHOLD}/5 câu để qua.</p>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">Tiến độ hoàn thành bài tập</span>
              <span className="text-xs font-medium text-white/70">{moduleCheckCount}/{totalPhases} giai đoạn</span>
            </div>
            <Progress
              value={checkPercent}
              className="h-2 bg-white/[0.06]"
            />
          </div>
          {moduleCheckCount === totalPhases && moduleCheckCount > 0 && (
            <Badge className="bg-green-500/15 text-green-400 border-green-500/25 text-xs shrink-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Hoàn thành
            </Badge>
          )}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {mod.phases.map((phase, index) => {
          const isChecked = checklist[nav.currentModule]?.has(phase.phase) || false
          const isPassed = progress[nav.currentModule]?.includes(phase.phase) || false
          const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule]?.[phase.phase] || ''
          const label = phaseLabels[index] || ''

          return (
            <div
              key={phase.phase}
              className={`group relative rounded-2xl border transition-all duration-200 ${
                isChecked
                  ? 'border-green-500/20 bg-green-500/[0.03]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
              }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  {/* Phase Number / Timeline Indicator */}
                  <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        isChecked
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : isPassed
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : `${mod.accentBg} ${mod.color} border ${mod.borderColor}`
                      }`}
                    >
                      {isChecked ? <Check className="w-5 h-5" strokeWidth={2.5} /> : isPassed ? <Trophy className="w-5 h-5" /> : phase.phase}
                    </div>
                    {index < totalPhases - 1 && (
                      <div className={`w-px h-8 ${isChecked ? 'bg-green-500/30' : 'bg-white/[0.08]'}`} />
                    )}
                  </div>

                  {/* Mobile phase badge */}
                  <div className="sm:hidden shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isChecked
                          ? 'bg-green-500/20 text-green-400'
                          : isPassed
                            ? 'bg-amber-500/15 text-amber-400'
                            : `${mod.accentBg} ${mod.color}`
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4" /> : isPassed ? <Trophy className="w-4 h-4" /> : phase.phase}
                    </div>
                  </div>

                  {/* Phase Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
                        {phase.title}
                      </span>
                      {label && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 ${mod.accentBg} ${mod.color} border-0`}
                        >
                          {label}
                        </Badge>
                      )}
                      {isPassed && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-400 border-amber-500/20"
                        >
                          Đã qua test
                        </Badge>
                      )}
                    </div>
                    <h3 className={`text-sm sm:text-base font-semibold mb-1.5 ${isChecked ? 'text-white/90' : 'text-white/80'}`}>
                      {phase.name}
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {phaseDesc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Checklist Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleCompleted(nav.currentModule!, phase.phase)
                      }}
                      className={`h-9 w-9 p-0 rounded-lg transition-all ${
                        isChecked
                          ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
                      }`}
                      title={isChecked ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành'}
                    >
                      {isChecked ? (
                        <div className="w-5 h-5 rounded-md bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5" strokeWidth={1.5} />
                      )}
                    </Button>

                    {/* Start Quiz Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStartQuiz(nav.currentModule!, phase.phase)
                      }}
                      className={`gap-1.5 text-xs sm:text-sm ${mod.color} hover:${mod.accentBg}`}
                    >
                      <Target className="w-4 h-4" />
                      <span className="hidden sm:inline">{isPassed ? 'Làm lại' : 'Làm bài test'}</span>
                      <span className="sm:hidden">{isPassed ? 'Lại' : 'Test'}</span>
                      <ChevronRight className="w-3 h-3 opacity-50" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-2 text-white/25 text-xs">
        <PenLine className="w-3.5 h-3.5" />
        <span>Bấm nút tích để đánh dấu đã hoàn thành. Tiến độ được lưu tự động trên trình duyệt.</span>
      </div>
    </div>
  )
}
