'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PenLine, ChevronRight, CheckCircle2, Target, Star } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS, PASS_THRESHOLD } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'
import { useState, useEffect } from 'react'

interface QuizListViewProps {
  onStartQuiz: (module: ModuleSlug, phase: number) => void
  progress: Record<ModuleSlug, number[]>
}

export function QuizListView({ onStartQuiz, progress }: QuizListViewProps) {
  const nav = useNavigation()
  const [openModules, setOpenModules] = useState<string[]>([])

  useEffect(() => {
    if (nav.currentModule && !openModules.includes(nav.currentModule)) {
      setOpenModules([nav.currentModule])
    }
  }, [nav.currentModule, openModules])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bài tập trắc nghiệm</h1>
        <p className="text-white/40 text-sm">
          Làm bài test để kiểm tra kiến thức. Cần đúng {PASS_THRESHOLD}/5 câu để qua mỗi giai đoạn.
        </p>
      </div>

      <Accordion type="multiple" value={openModules} onValueChange={setOpenModules} className="space-y-4">
        {(['systema', 'argos', 'cognos', 'ludus'] as ModuleSlug[]).map((slug) => {
          const mod = MODULES[slug]
          const passedCount = progress[slug]?.length || 0

          return (
            <AccordionItem key={slug} value={slug} className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-white/[0.02]">
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${mod.accentBg}`}>
                    <span className={mod.color}>{mod.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{mod.name}</span>
                      <Badge variant="secondary" className={`text-xs ${passedCount === 5 ? 'bg-green-500/10 text-green-400 border-green-500/20' : `${mod.accentBg} ${mod.color} border-current`}`}>
                        {passedCount === 5 ? '✅ Hoàn thành' : `${passedCount}/5 qua`}
                      </Badge>
                    </div>
                    <p className="text-white/40 text-sm mt-0.5">{mod.subtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-4">
                <div className="space-y-3 pt-2">
                  {mod.phases.map((phase) => {
                    const isPassed = progress[slug]?.includes(phase.phase) || false
                    const phaseDesc = PHASE_DESCRIPTIONS[slug]?.[phase.phase] || ''

                    return (
                      <Card
                        key={phase.phase}
                        className={`border transition-all ${
                          isPassed
                            ? 'border-green-500/20 bg-green-500/[0.02]'
                            : 'border-white/10 bg-white/[0.01]'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border ${
                              isPassed
                                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                : 'bg-white/5 border-white/10 text-white/50'
                            }`}>
                              {isPassed ? <CheckCircle2 className="w-5 h-5" /> : phase.phase}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium ${isPassed ? 'text-green-400' : 'text-white/80'}`}>
                                  {phase.title}: {phase.name}
                                </h4>
                                {isPassed && (
                                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                    Đã qua
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white/40 text-xs">{phaseDesc}</p>
                              <p className="text-white/30 text-xs mt-1">
                                Yêu cầu: {PASS_THRESHOLD}/5 câu đúng
                              </p>
                            </div>
                            <Button
                              onClick={() => onStartQuiz(slug, phase.phase)}
                              className={`shrink-0 ${
                                isPassed
                                  ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                  : 'bg-cyan-500 hover:bg-cyan-400 text-black font-medium'
                              }`}
                              variant={isPassed ? 'outline' : 'default'}
                            >
                              {isPassed ? (
                                <>
                                  <Star className="w-4 h-4 mr-1" />
                                  Làm lại
                                </>
                              ) : (
                                <>
                                  <Target className="w-4 h-4 mr-1" />
                                  Làm test
                                </>
                              )}
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
