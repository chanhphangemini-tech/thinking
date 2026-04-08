'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, ArrowRight, RotateCcw, FileText, Loader2, Target, BookOpen, Trophy } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES, PHASE_DESCRIPTIONS, PASS_THRESHOLD, QUESTIONS_PER_QUIZ } from '@/lib/constants/modules'
import type { ModuleSlug, QuizQuestion } from '@/lib/types'

interface QuizViewProps {
  progress: Record<ModuleSlug, number[]>
  quizQuestions: QuizQuestion[]
  quizLoading: boolean
  selectedAnswers: Record<number, string>
  quizSubmitted: boolean
  quizScore: number
  quizPassed: boolean
  quizResetKey: number
  hasReadDocs: boolean
  onAnswerSelect: (questionIndex: number, answer: string) => void
  onSubmitQuiz: () => void
  onStartQuiz: () => void
  onResetQuiz: () => void
  onLoadDocs: () => void
}

export function QuizView({
  progress,
  quizQuestions,
  quizLoading,
  selectedAnswers,
  quizSubmitted,
  quizScore,
  quizPassed,
  quizResetKey,
  hasReadDocs,
  onAnswerSelect,
  onSubmitQuiz,
  onStartQuiz,
  onResetQuiz,
  onLoadDocs,
}: QuizViewProps) {
  const nav = useNavigation()
  
  if (!nav.currentModule || nav.currentPhase === null || nav.currentPhase === undefined) return null
  
  const mod = MODULES[nav.currentModule]
  const currentPhaseNum = nav.currentPhase
  const currentPhaseInfo = mod.phases.find(p => p.phase === currentPhaseNum)
  
  if (!currentPhaseInfo) return null
  
  const isCurrentPhasePassed = progress[nav.currentModule]?.includes(currentPhaseNum) || false
  
  const isActiveQuiz = quizQuestions.length > 0 && !quizSubmitted
  const isAfterDocsRead = hasReadDocs && !isActiveQuiz && !quizSubmitted
  const isQuizDone = quizSubmitted

  // Determine current learning step
  let currentStep = 1 // 1=docs, 2=quiz, 3=done
  if (isQuizDone) {
    currentStep = 3
  } else if (hasReadDocs || isActiveQuiz) {
    currentStep = 2
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${mod.bgGradient}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-white/40 mb-6 flex-wrap">
          <button onClick={nav.goHome} className="hover:text-white transition-colors">Trang chủ</button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <button onClick={() => nav.setSidebarTab('roadmap')} className={`hover:text-white transition-colors ${mod.color}`}>{mod.name}</button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-white/70">{currentPhaseInfo.title}</span>
        </div>

        {/* Phase Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">{currentPhaseInfo.title}: {currentPhaseInfo.name}</h1>
          <p className="text-white/40 text-sm mt-1">Yêu cầu: {PASS_THRESHOLD}/{QUESTIONS_PER_QUIZ} câu đúng để qua</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2 sm:gap-4">
            {[
              { emoji: '📖', label: 'Đọc tài liệu', step: 1 },
              { emoji: '✍️', label: 'Làm bài test', step: 2 },
              { emoji: '🏆', label: 'Hoàn thành', step: 3 },
            ].map((s, i) => {
              const isDone = currentStep > s.step || isCurrentPhasePassed
              const isCurrent = currentStep === s.step
              return (
                <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm flex-1 justify-center transition-all ${
                    isDone
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : isCurrent
                        ? `bg-white/5 text-white border border-white/10 ${mod.color} font-medium`
                        : 'bg-white/[0.02] text-white/20 border border-white/5'
                  }`}>
                    <span className="text-base">{isDone && !isCurrent ? '✅' : s.emoji}</span>
                    <span className="hidden sm:inline truncate">{s.label}</span>
                    <span className="sm:hidden truncate text-xs">Bước {s.step}</span>
                  </div>
                  {i < 2 && (
                    <ChevronRight className="w-4 h-4 text-white/10 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* STEP 1: Before reading docs */}
        {!hasReadDocs && !isActiveQuiz && !isQuizDone && (
          <Card
            className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-cyan-950/5 cursor-pointer hover:border-cyan-500/40 transition-all group"
            onClick={onLoadDocs}
          >
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="p-4 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0 group-hover:bg-cyan-500/25 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-bold text-lg text-cyan-400 mb-2">Bước 1: Đọc tài liệu lý thuyết</h3>
                  <p className="text-sm text-white/40 mb-1">
                    {currentPhaseInfo.title} — {currentPhaseInfo.name}
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {PHASE_DESCRIPTIONS[nav.currentModule]?.[currentPhaseNum] || 'Đọc kỹ tài liệu trước khi làm bài test. Bạn cần hiểu lý thuyết để đạt kết quả tốt.'}
                  </p>
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                    <BookOpen className="w-4 h-4 mr-2" />
                    📖 Xem tài liệu
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: After reading docs, before quiz */}
        {isAfterDocsRead && !isQuizDone && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-green-400 text-sm font-medium">Tài liệu đã đọc! ✅</span>
            </div>

            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bước 2: Kiểm tra kiến thức</h3>
                <p className="text-white/40 text-sm mb-1">
                  {currentPhaseInfo.title} — {currentPhaseInfo.name}
                </p>
                <p className="text-white/50 text-sm mb-6">
                  {QUESTIONS_PER_QUIZ} câu hỏi trắc nghiệm. Cần đúng ít nhất {PASS_THRESHOLD}/{QUESTIONS_PER_QUIZ} để qua giai đoạn.
                </p>
                <Button size="lg" onClick={onStartQuiz} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                  ✍️ Bắt đầu làm bài test
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" onClick={onLoadDocs} className="text-white/30 hover:text-white/60">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Xem lại tài liệu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* During quiz loading */}
        {quizLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Đang tải câu hỏi...</p>
            </div>
          </div>
        )}

        {/* During quiz - show questions */}
        {isActiveQuiz && !quizLoading && (
          <div className="space-y-6">
            {/* Quiz header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold">Bài test: {currentPhaseInfo.name}</h2>
                <p className="text-white/40 text-sm mt-1">
                  Đã trả lời {Object.keys(selectedAnswers).length}/{quizQuestions.length} câu
                </p>
              </div>
            </div>

            {/* Quiz questions */}
            <div className="space-y-4">
              {quizQuestions.map((q, qIdx) => {
                const selected = selectedAnswers[qIdx]

                return (
                  <Card key={`${quizResetKey}-${qIdx}`} className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-4 sm:p-6">
                      <p className="font-medium mb-4 text-sm sm:text-base">
                        <span className="text-white/40 mr-2">Câu {qIdx + 1}.</span>
                        {q.question}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                          const isSelected = selected === opt
                          const optClass = isSelected
                            ? `${mod.color} border-current ${mod.accentBg}`
                            : 'border-white/10 hover:border-white/30 hover:bg-white/[0.04]'

                          return (
                            <button
                              key={opt}
                              onClick={() => onAnswerSelect(qIdx, opt)}
                              className={`flex items-start gap-3 p-3 rounded-lg border text-left text-sm transition-all cursor-pointer ${optClass}`}
                            >
                              <span className="font-mono text-xs mt-0.5 opacity-60">{opt.toUpperCase()}</span>
                              <span className="leading-relaxed">{q.options[opt]}</span>
                            </button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Submit Button */}
            {Object.keys(selectedAnswers).length === quizQuestions.length && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={onSubmitQuiz}
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8"
                >
                  Nộp bài ({Object.keys(selectedAnswers).length}/{quizQuestions.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Quiz submitted - Show result */}
        {isQuizDone && (
          <div className="space-y-6">
            {/* Result Card */}
            <Card className={`border-2 ${quizPassed ? 'border-green-500/30' : 'border-red-500/30'} bg-white/[0.03]`}>
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-5xl mb-4">{quizPassed ? '🎉' : '💪'}</div>
                <h3 className={`text-2xl font-bold mb-2 ${quizPassed ? 'text-green-400' : 'text-red-400'}`}>
                  {quizPassed ? 'Chúc mừng! Bạn đã qua giai đoạn này!' : 'Chưa qua — Thử lại nhé!'}
                </h3>
                <p className="text-white/50 mb-6">
                  Kết quả: <span className="font-bold text-white text-lg">{quizScore}/{quizQuestions.length}</span> câu đúng
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {!quizPassed && (
                    <Button variant="outline" onClick={onLoadDocs} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                      <FileText className="w-4 h-4 mr-1" />
                      Ôn lại tài liệu
                    </Button>
                  )}
                  <Button variant="outline" onClick={onResetQuiz} className="border-white/20">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Làm lại quiz
                  </Button>
                  {quizPassed && (
                    <Button onClick={() => nav.setSidebarTab('roadmap')} className="bg-green-500 hover:bg-green-400 text-black font-medium">
                      <Trophy className="w-4 h-4 mr-1" />
                      Xem lộ trình
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Show explanations for review */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-white/50 uppercase tracking-wider">Chi tiết đáp án</h3>
              {quizQuestions.map((q, qIdx) => {
                const selected = selectedAnswers[qIdx]
                const isCorrect = selected === q.correct

                return (
                  <Card key={`${quizResetKey}-result-${qIdx}`} className={`border ${isCorrect ? 'border-green-500/20' : 'border-red-500/20'} bg-white/[0.02]`}>
                    <CardContent className="p-4 sm:p-5">
                      <p className="font-medium mb-3 text-sm">
                        <span className="text-white/40 mr-2">Câu {qIdx + 1}.</span>
                        {q.question}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2 mb-3">
                        {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                          const isSelected = selected === opt
                          const isCorrectOpt = q.correct === opt
                          let optClass = 'border-white/10 opacity-50'
                          if (isCorrectOpt) optClass = 'border-green-500/50 bg-green-500/10 text-green-400 opacity-100'
                          else if (isSelected && !isCorrect) optClass = 'border-red-500/50 bg-red-500/10 text-red-400 opacity-100'

                          return (
                            <div key={opt} className={`flex items-start gap-3 p-2.5 rounded-lg border text-left text-sm ${optClass}`}>
                              <span className="font-mono text-xs mt-0.5 opacity-60">{opt.toUpperCase()}</span>
                              <span className="leading-relaxed">{q.options[opt]}</span>
                              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-green-400" />}
                              {isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto shrink-0 text-red-400" />}
                            </div>
                          )
                        })}
                      </div>
                      <div className={`p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-500/5 border border-green-500/20' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                        <p className={isCorrect ? 'text-green-400' : 'text-amber-400'}>
                          {isCorrect ? '✅ Chính xác! ' : '❌ Chưa đúng. '}
                          {q.explanation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
