'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Check, Circle, Clock, FileText, Sparkles } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

interface DocsListViewProps {
  onOpenDoc: (module: ModuleSlug, phase: number) => void
  readDocs: Record<ModuleSlug, Set<number>>
  onToggleRead: (module: ModuleSlug, phase: number) => void
}

export function DocsListView({ onOpenDoc, readDocs, onToggleRead }: DocsListViewProps) {
  const nav = useNavigation()

  if (!nav.currentModule) return null

  const mod = MODULES[nav.currentModule]
  const moduleReadCount = readDocs[nav.currentModule]?.size || 0
  const totalPhases = mod.phases.length
  const readPercent = totalPhases > 0 ? (moduleReadCount / totalPhases) * 100 : 0

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
        <p className="text-white/50 text-sm leading-relaxed mb-5">{mod.description}</p>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">Tiến độ đọc tài liệu</span>
              <span className="text-xs font-medium text-white/70">{moduleReadCount}/{totalPhases} giai đoạn</span>
            </div>
            <Progress
              value={readPercent}
              className="h-2 bg-white/[0.06]"
            />
          </div>
          {moduleReadCount === totalPhases && moduleReadCount > 0 && (
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
          const isRead = readDocs[nav.currentModule]?.has(phase.phase) || false
          const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule]?.[phase.phase] || ''
          const label = phaseLabels[index] || ''

          return (
            <div
              key={phase.phase}
              className={`group relative rounded-2xl border transition-all duration-200 ${
                isRead
                  ? 'border-green-500/20 bg-green-500/[0.03]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
              }`}
            >
              {/* Phase Card Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  {/* Phase Number / Timeline Indicator */}
                  <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        isRead
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : `${mod.accentBg} ${mod.color} border ${mod.borderColor}`
                      }`}
                    >
                      {isRead ? <Check className="w-5 h-5" strokeWidth={2.5} /> : phase.phase}
                    </div>
                    {index < totalPhases - 1 && (
                      <div className={`w-px h-8 ${isRead ? 'bg-green-500/30' : 'bg-white/[0.08]'}`} />
                    )}
                  </div>

                  {/* Mobile phase badge */}
                  <div className="sm:hidden shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isRead
                          ? 'bg-green-500/20 text-green-400'
                          : `${mod.accentBg} ${mod.color}`
                      }`}
                    >
                      {isRead ? <Check className="w-4 h-4" /> : phase.phase}
                    </div>
                  </div>

                  {/* Phase Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
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
                    </div>
                    <h3 className={`text-sm sm:text-base font-semibold mb-1.5 ${isRead ? 'text-white/90' : 'text-white/80'}`}>
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
                        onToggleRead(nav.currentModule!, phase.phase)
                      }}
                      className={`h-9 w-9 p-0 rounded-lg transition-all ${
                        isRead
                          ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                          : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
                      }`}
                      title={isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                    >
                      {isRead ? (
                        <div className="w-5 h-5 rounded-md bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5" strokeWidth={1.5} />
                      )}
                    </Button>

                    {/* Read Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenDoc(nav.currentModule!, phase.phase)
                      }}
                      className={`gap-1.5 text-xs sm:text-sm ${mod.color} hover:${mod.accentBg}`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Đọc tài liệu</span>
                      <span className="sm:hidden">Đọc</span>
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
        <FileText className="w-3.5 h-3.5" />
        <span>Bấm nút tích để đánh dấu đã đọc. Tiến độ được lưu tự động trên trình duyệt.</span>
      </div>
    </div>
  )
}
