'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle2, BookOpen, Brain, ArrowRight, Clock, Zap, Trophy, Layers, Sparkles } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

interface RoadmapViewProps {
  progress: Record<ModuleSlug, number[]>
  onStartQuiz: (module: ModuleSlug, phase: number) => void
  onOpenDocs: (module: ModuleSlug, phase: number) => void
}

// Phase level badges
const PHASE_LEVELS: Record<number, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  0: { label: 'Giới Thiệu', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20', icon: <Sparkles className="w-3.5 h-3.5" /> },
  1: { label: 'Nền Tảng', color: 'text-sky-400', bgColor: 'bg-sky-500/10', borderColor: 'border-sky-500/20', icon: <Layers className="w-3.5 h-3.5" /> },
  2: { label: 'Thực Chiến', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', icon: <Zap className="w-3.5 h-3.5" /> },
  3: { label: 'Thực Chiến', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', icon: <Zap className="w-3.5 h-3.5" /> },
  4: { label: 'Thực Chiến', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', icon: <Zap className="w-3.5 h-3.5" /> },
  5: { label: 'Tổng Hợp', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', icon: <Trophy className="w-3.5 h-3.5" /> },
}

// Key topics per phase for SYSTEMA (quick glance)
const PHASE_TOPICS: Record<number, string[]> = {
  1: ['Hệ thống vs Đống', 'Stock & Flow', 'Feedback Loops', 'Mô hình Tảng Băng'],
  2: ['Reinforcing/Balancing', 'Delays', 'Archetypes', 'Trị Nguồn Gốc'],
  3: ['Mental Models', 'First Principles', 'Inversion', '12 Đòn Bẩy'],
  4: ['Resilience', 'Redundancy', 'Self-Organization', 'Thiết Kế Can Thiệp'],
  5: ['Capstone Project', 'Framework 5 Bước', 'Checklist Hàng Ngày', 'Learning by Teaching'],
}

export function RoadmapView({ progress, onStartQuiz, onOpenDocs }: RoadmapViewProps) {
  const nav = useNavigation()

  if (!nav.currentModule) return null

  const mod = MODULES[nav.currentModule]
  const passedPhases = progress[nav.currentModule] || []
  const passedCount = passedPhases.length
  const isCompleted = passedCount === 6

  return (
    <div className={`min-h-screen bg-gradient-to-br ${mod.bgGradient}`}>
      {/* ============ HERO BANNER ============ */}
      <div className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Back button */}
          <button
            onClick={nav.goHome}
            className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại trang chủ
          </button>

          {/* Module identity */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
            {/* Icon */}
            <div className={`${mod.color} p-3.5 rounded-2xl ${mod.accentBg} border ${mod.borderColor} shrink-0 self-start`}>
              <div className="w-10 h-10">{mod.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                {mod.name}
                <span className={`ml-2 text-lg sm:text-xl font-medium ${mod.color}`}>{mod.subtitle}</span>
              </h1>
              <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-2xl">
                {mod.description}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className={`text-2xl font-bold ${mod.color}`}>{passedCount}<span className="text-white/20 font-normal">/6</span></div>
              <div className="text-[11px] text-white/30 mt-0.5">Hoàn thành</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-2xl font-bold text-white/80">6</div>
              <div className="text-[11px] text-white/30 mt-0.5">Giai đoạn</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-2xl font-bold text-white/80">
                {isCompleted ? (
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                ) : (
                  <Clock className="w-6 h-6 text-white/40 mx-auto" />
                )}
              </div>
              <div className="text-[11px] text-white/30 mt-0.5">
                {isCompleted ? 'Mastered!' : 'Đang học'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ LEARNING PATH ============ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Section title */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white/70 flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-500/60" />
            Lộ trình học tập
          </h2>
          <p className="text-white/30 text-sm mt-1">Từ cơ bản đến nâng cao — mỗi giai đoạn xây dựng nền tảng cho giai đoạn tiếp theo</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-5 sm:left-7 top-8 bottom-8 w-px bg-gradient-to-b from-white/10 via-white/5 to-white/0" />

          <div className="space-y-3">
            {mod.phases.map((phaseInfo, index) => {
              const isPassed = passedPhases.includes(phaseInfo.phase)
              const isLast = index === mod.phases.length - 1
              const level = PHASE_LEVELS[phaseInfo.phase]
              const topics = nav.currentModule === 'systema' ? (PHASE_TOPICS[phaseInfo.phase] || []) : []
              const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule!]?.[phaseInfo.phase] || ''

              return (
                <div key={phaseInfo.phase} className="relative pl-14 sm:pl-[3.5rem]">
                  {/* Timeline node */}
                  <div className={`absolute left-2.5 sm:left-4 top-5 w-5 h-5 rounded-full border-2 z-10 flex items-center justify-center transition-all ${
                    isPassed
                      ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : phaseInfo.phase === 0 && passedPhases.length === 0
                        ? `bg-amber-500/20 border-amber-500/50 animate-pulse`
                        : 'bg-black/60 border-white/15'
                  }`}>
                    {isPassed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  {/* Phase card */}
                  <div className={`rounded-xl border transition-all group ${
                    isPassed
                      ? 'border-emerald-500/15 bg-emerald-500/[0.02]'
                      : 'border-white/[0.06] bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.03]'
                  }`}>
                    <div className="p-4 sm:p-5">
                      {/* Phase header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Phase number badge */}
                          <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isPassed
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : `${level.bgColor} ${level.color} border ${level.borderColor}`
                          }`}>
                            {phaseInfo.phase}
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-semibold text-sm sm:text-base ${
                                isPassed ? 'text-emerald-400' : 'text-white/85'
                              }`}>
                                {phaseInfo.name}
                              </h3>
                              {isPassed && (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0">
                                  Hoàn thành
                                </Badge>
                              )}
                            </div>
                            {/* Level tag */}
                            <Badge variant="secondary" className={`${level.bgColor} ${level.color} ${level.borderColor} text-[10px] px-1.5 py-0 mt-1 border`}>
                              {level.icon}
                              <span className="ml-1">{level.label}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/35 text-sm leading-relaxed mt-2.5 ml-[2.25rem]">
                        {phaseDesc}
                      </p>

                      {/* Topics pills — SYSTEMA specific, shown for all modules as empty if no topics */}
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 ml-[2.25rem]">
                          {topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 border border-white/[0.05]"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read docs button */}
                      <div className="mt-4 ml-[2.25rem]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenDocs(nav.currentModule!, phaseInfo.phase)}
                          className={`transition-all ${
                            isPassed
                              ? 'border-emerald-500/20 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30'
                              : `border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/20`
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                          {isPassed ? 'Xem lại tài liệu' : 'Đọc tài liệu'}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-50" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Connector hint between cards */}
                  {!isLast && (
                    <div className="flex items-center justify-center py-1">
                      <ArrowRight className="w-3 h-3 text-white/10 rotate-90" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ============ COMPLETION MESSAGE ============ */}
        {isCompleted && (
          <div className={`mt-10 rounded-2xl border ${mod.borderColor} ${mod.accentBg} p-6 sm:p-8 text-center`}>
            <div className={`w-14 h-14 rounded-2xl ${mod.accentBg} border ${mod.borderColor} flex items-center justify-center mx-auto mb-4`}>
              <Trophy className={`w-7 h-7 ${mod.color}`} />
            </div>
            <h3 className={`text-xl font-bold ${mod.color} mb-2`}>
              Chúc mừng! Bạn đã hoàn thành {mod.name}
            </h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Bạn đã làm chủ tư duy hệ thống. Hãy tiếp tục áp dụng vào thực tế và khám phá các module khác!
            </p>
            <div className="flex justify-center gap-3 mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={nav.goHome}
                className="border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              >
                Khám phá module khác
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
