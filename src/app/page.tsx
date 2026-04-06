'use client'

import { useEffect, useState, useCallback } from 'react'
import { tryGetSupabase } from '@/lib/supabase/client'
import { useNavigation } from '@/lib/store'
import type { User, ModuleSlug, UserProfile, QuizQuestion } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Brain, Swords, Cpu, LogIn, LogOut, User, Home,
  ChevronRight, ChevronLeft, Trophy, Flame, BookOpen,
  CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Award, PenLine, Trash2, Loader2, Shield, Zap, Target
} from 'lucide-react'
import { toast } from 'sonner'

// ============================================
// MODULE DEFINITIONS
// ============================================
const MODULES: Record<ModuleSlug, {
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  bgGradient: string
  borderColor: string
  accentBg: string
  phases: { phase: number; name: string; title: string }[]
}> = {
  systema: {
    name: 'SYSTEMA',
    subtitle: 'Tư Duy Hệ Thống',
    description: 'Nắm vững Stock & Flow, Feedback Loops, System Archetypes và 12 Đòn Bẩy để hiểu và can thiệp vào bất kỳ hệ thống phức tạp nào.',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-amber-500',
    bgGradient: 'from-amber-950/40 via-stone-950 to-black',
    borderColor: 'border-amber-500/30',
    accentBg: 'bg-amber-500/10',
    phases: [
      { phase: 1, name: 'Tư Duy Phi Tuyến Tính & Phản Hồi', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Cấu Trúc Hệ Thống & Archetypes', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Mô Hình Tâm Trí & Đòn Bẩy', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Thiết Kế Hệ Thống & Dự Phòng', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Tư Duy Hệ Thống Thực Chiến', title: 'Tổng Hợp' },
    ],
  },
  argos: {
    name: 'ARGOS',
    subtitle: 'Tư Duy Phản Biện & Pitching',
    description: 'Phát triển khả năng lập luận sắc bén, nhận diện ngụy biện, và nghệ thuật thuyết phục & pitching để tạo ảnh hưởng trong mọi tình huống.',
    icon: <Swords className="w-8 h-8" />,
    color: 'text-red-500',
    bgGradient: 'from-red-950/30 via-stone-950 to-black',
    borderColor: 'border-red-500/30',
    accentBg: 'bg-red-500/10',
    phases: [
      { phase: 1, name: 'Tâm Lý Học Thuyết Phục & Sự Thật', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Cấu Trúc Lập Luận & Ngụy Biện', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Nghệ Thuật Đặt Câu Hỏi & Lắng Nghe', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Kỹ Thuật Pitching & Storytelling', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Bậc Thầy Thuyết Phục & Phản Biện', title: 'Tổng Hợp' },
    ],
  },
  cognos: {
    name: 'COGNOS',
    subtitle: 'Tư Duy Quản Trị AI',
    description: 'Hiểu bản chất AI, tránh bẫy tư duy, thiết kế prompt hiệu quả, đánh giá rủi ro và xây dựng chiến lược AI governance.',
    icon: <Cpu className="w-8 h-8" />,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-950/30 via-slate-950 to-black',
    borderColor: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    phases: [
      { phase: 1, name: 'Bản Chất AI', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Giới Hạn AI & Bẫy Tư Duy', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Prompt Thinking & Workflow Design', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Đánh Giá Output & Quản Lý Rủi Ro', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Tổng Hợp Tư Duy Quản Trị AI', title: 'Tốt Nghiệp' },
    ],
  },
}

// ============================================
// FALLBACK QUIZ DATA (used when DB not ready)
// ============================================
const FALLBACK_QUIZZES: Record<ModuleSlug, Record<number, QuizQuestion[]>> = {
  systema: {},
  argos: {},
  cognos: {},
}

// Load fallback data dynamically
async function loadFallbackData() {
  try {
    const res = await fetch('/quiz-data.json')
    if (!res.ok) return
    const data = await res.json()
    for (const mod of ['argos', 'cognos', 'systems'] as const) {
      const key = mod === 'systems' ? 'systema' : mod
      if (data[key]) {
        FALLBACK_QUIZZES[key as ModuleSlug] = {}
        for (const phase of data[key].phases) {
          FALLBACK_QUIZZES[key as ModuleSlug][phase.phase] = phase.questions.map((q: { question: string; options: Record<string, string>; correct: string; explanation: string }) => ({
            question: q.question,
            options: q.options,
            correct: q.correct as 'a' | 'b' | 'c' | 'd',
            explanation: q.explanation,
          }))
        }
      }
    }
  } catch {
    // Fallback data not available, will use from DB
  }
}

loadFallbackData()

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function ThinkingAIApp() {
  const nav = useNavigation()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<Record<ModuleSlug, number[]>>({ systema: [], argos: [], cognos: [] })

  // Auth state
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authDisplayName, setAuthDisplayName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})

  // Journal state
  const [journalEntries, setJournalEntries] = useState<Array<{ id: string; title: string; content: string; module_slug?: string; tags: string[]; created_at?: string }>>([])
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalModule, setJournalModule] = useState<ModuleSlug | ''>('')

  // Initialize auth
  useEffect(() => {
    const supabase = tryGetSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
          await fetchProgress(session.user.id)
        }
      } catch {
        // Auth not available yet
      } finally {
        setLoading(false)
      }
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
        await fetchProgress(session.user.id)
      } else {
        setProfile(null)
        setProgress({ systema: [], argos: [], cognos: [] })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`)
      const { data } = await res.json()
      if (data && !data.fallback) {
        setProfile(data)
      } else if (data?.fallback) {
        setProfile({ id: userId, user_id: userId, display_name: data.display_name || 'Người học', xp: 0, streak: 0, longest_streak: 0 })
      }
    } catch {
      setProfile({ id: userId, user_id: userId, display_name: 'Người học', xp: 0, streak: 0, longest_streak: 0 })
    }
  }

  const fetchProgress = async (userId: string) => {
    try {
      const res = await fetch(`/api/progress?userId=${userId}`)
      const { data } = await res.json()
      if (data && Array.isArray(data)) {
        const newProgress: Record<ModuleSlug, number[]> = { systema: [], argos: [], cognos: [] }
        for (const p of data) {
          if (p.passed && newProgress[p.module_slug as ModuleSlug]) {
            newProgress[p.module_slug as ModuleSlug].push(p.phase_number)
          }
        }
        setProgress(newProgress)
      }
    } catch {
      // Progress not available yet
    }
  }

  const handleSignup = async () => {
    if (!authEmail || !authPassword) return
    setAuthLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword, display_name: authDisplayName }),
      })
      const { error } = await res.json()
      if (error) {
        toast.error(error)
      } else {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.')
        nav.closeAuth()
      }
    } catch {
      toast.error('Lỗi kết nối server')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!authEmail || !authPassword) return
    setAuthLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      })
      const { data, error } = await res.json()
      if (error) {
        toast.error(error)
      } else {
        toast.success('Đăng nhập thành công!')
        nav.closeAuth()
        if (data?.session?.user) {
          setUser(data.session.user)
          await fetchProfile(data.session.user.id)
          await fetchProgress(data.session.user.id)
        }
      }
    } catch {
      toast.error('Lỗi kết nối server')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = tryGetSupabase()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProgress({ systema: [], argos: [], cognos: [] })
    nav.goHome()
    toast.success('Đã đăng xuất')
  }

  const startQuiz = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    setQuizLoading(true)
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizScore(0)
    setQuizPassed(false)
    setShowExplanation({})

    try {
      const res = await fetch(`/api/quizzes?module=${moduleSlug}&phase=${phase}`)
      const { data, seeded } = await res.json()

      if (data && data.length > 0) {
        setQuizQuestions(data.map((q: Record<string, unknown>) => ({
          id: q.id as string,
          phase,
          question: q.question as string,
          options: {
            a: q.option_a as string,
            b: q.option_b as string,
            c: q.option_c as string,
            d: q.option_d as string,
          },
          correct: q.correct_answer as 'a' | 'b' | 'c' | 'd',
          explanation: q.explanation as string,
        })))
      } else if (FALLBACK_QUIZZES[moduleSlug]?.[phase]) {
        setQuizQuestions(FALLBACK_QUIZZES[moduleSlug][phase])
      } else {
        toast.error('Chưa có câu hỏi cho giai đoạn này. Database cần được thiết lập.')
      }
    } catch {
      // Try fallback
      if (FALLBACK_QUIZZES[moduleSlug]?.[phase]) {
        setQuizQuestions(FALLBACK_QUIZZES[moduleSlug][phase])
      } else {
        toast.error('Không thể tải câu hỏi')
      }
    } finally {
      setQuizLoading(false)
    }
  }, [])

  const submitQuiz = async () => {
    if (!user || quizQuestions.length === 0) return
    const moduleSlug = nav.currentModule!
    const phaseNum = nav.currentPhase!

    let score = 0
    for (const q of quizQuestions) {
      if (selectedAnswers[quizQuestions.indexOf(q)] === q.correct) {
        score++
      }
    }

    const passed = score >= 4
    setQuizScore(score)
    setQuizPassed(passed)
    setQuizSubmitted(true)

    // Enable all explanations
    const exps: Record<number, boolean> = {}
    quizQuestions.forEach((_, i) => { exps[i] = true })
    setShowExplanation(exps)

    // Save to DB
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          moduleSlug,
          phaseNumber: phaseNum,
          score,
          total: quizQuestions.length,
          passed,
          answers: selectedAnswers,
        }),
      })

      if (passed) {
        setProgress(prev => ({
          ...prev,
          [moduleSlug]: prev[moduleSlug].includes(phaseNum) ? prev[moduleSlug] : [...prev[moduleSlug], phaseNum],
        }))
        toast.success(`🎉 Chúc mừng! Bạn đã qua ${MODULES[moduleSlug].phases[phaseNum - 1].title} với ${score}/${quizQuestions.length}!`)
      } else {
        toast.error(`Bạn đạt ${score}/${quizQuestions.length}. Cần ít nhất 4/5 để qua. Thử lại nhé!`)
      }
    } catch {
      if (passed) {
        setProgress(prev => ({
          ...prev,
          [moduleSlug]: prev[moduleSlug].includes(phaseNum) ? prev[moduleSlug] : [...prev[moduleSlug], phaseNum],
        }))
      }
    }
  }

  const fetchJournal = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/journal?userId=${user.id}`)
      const { data } = await res.json()
      setJournalEntries(data || [])
    } catch {
      // Journal not available
    }
  }

  const addJournalEntry = async () => {
    if (!user || !journalTitle) return
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: journalTitle,
          content: journalContent,
          moduleSlug: journalModule || null,
          tags: journalModule ? [journalModule] : [],
        }),
      })
      const { data } = await res.json()
      if (data) {
        setJournalEntries(prev => [data, ...prev])
        setJournalTitle('')
        setJournalContent('')
        setJournalModule('')
        toast.success('Đã lưu nhật ký!')
      }
    } catch {
      toast.error('Không thể lưu nhật ký')
    }
  }

  useEffect(() => {
    if (nav.view === 'profile' && user) {
      fetchJournal()
    }
  }, [nav.view, user])

  const totalProgress = Object.values(progress).flat().length
  const totalPhases = 15

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white/60 text-sm">Đang tải Thinking AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={nav.goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-lg tracking-tight">Thinking<span className="text-cyan-400">AI</span></span>
          </button>

          <nav className="flex items-center gap-2">
            {nav.view !== 'landing' && (
              <Button variant="ghost" size="sm" onClick={nav.goHome} className="text-white/70 hover:text-white">
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Button>
            )}

            {user && nav.view !== 'profile' && (
              <Button variant="ghost" size="sm" onClick={() => nav.setView('profile')} className="text-white/70 hover:text-white">
                <User className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Hồ sơ</span>
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                  <Flame className="w-3 h-3 mr-1" />
                  {profile?.xp || 0} XP
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/50 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => nav.openAuth('login')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium">
                <LogIn className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1">
        {/* LANDING VIEW */}
        {nav.view === 'landing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
            {/* Hero */}
            <div className="text-center mb-12 sm:mb-20">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-6 text-xs sm:text-sm">
                <Zap className="w-3 h-3 mr-1" />
                3 LĨNH VỰC TƯ DUY — 15 GIAI ĐOẠN — 75 BÀI TẬP
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                Nâng Cấp <span className="text-cyan-400">Tư Duy</span> Của Bạn
              </h1>
              <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Lộ trình 90 ngày với 3 lĩnh vực cốt lõi: Tư Duy Hệ Thống, Phản Biện & Pitching, và Quản Trị AI.
                Được thiết kế cho những ai muốn suy nghĩ sâu hơn và hành động hiệu quả hơn.
              </p>
              {user && (
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/40">
                  <span>Đã hoàn thành {totalProgress}/{totalPhases} giai đoạn</span>
                  <Progress value={(totalProgress / totalPhases) * 100} className="w-32 h-2" />
                </div>
              )}
            </div>

            {/* Module Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => (
                <Card
                  key={slug}
                  className={`group cursor-pointer border ${mod.borderColor} bg-gradient-to-br ${mod.bgGradient} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                  onClick={() => {
                    if (user) {
                      nav.setModule(slug)
                    } else {
                      nav.openAuth('login')
                      toast.info('Vui lòng đăng nhập để bắt đầu học')
                    }
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`${mod.color} p-2 rounded-lg ${mod.accentBg}`}>
                        {mod.icon}
                      </div>
                      {user && progress[slug].length > 0 && (
                        <Badge variant="secondary" className={`${mod.accentBg} ${mod.color} border-0 text-xs`}>
                          {progress[slug].length}/5
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mt-3">{mod.name}</CardTitle>
                    <CardDescription className="text-white/60 text-sm">{mod.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{mod.description}</p>
                    <div className="space-y-2">
                      {mod.phases.map((p) => {
                        const isPassed = progress[slug].includes(p.phase)
                        return (
                          <div key={p.phase} className="flex items-center gap-2 text-xs">
                            {isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                            )}
                            <span className={isPassed ? 'text-white/70' : 'text-white/30'}>
                              {p.phase}. {p.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                      <span>Bắt đầu học</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Section */}
            <div className="mt-16 sm:mt-24 grid sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: <Shield className="w-6 h-6" />, title: 'Học có kỷ luật', desc: 'Gate 4/5 để qua mỗi giai đoạn, đảm bảo thực sự hiểu trước khi tiếp tục' },
                { icon: <Target className="w-6 h-6" />, title: 'Thực chiến thực tế', desc: '75 câu hỏi với giải thích chi tiết, xây dựng từ case studies thực tế' },
                { icon: <Award className="w-6 h-6" />, title: 'Theo dõi tiến độ', desc: 'Dashboard cá nhân, journal phản tỉnh, streak tracking và XP system' },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-cyan-400 mx-auto mb-3">{f.icon}</div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-white/40">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE VIEW */}
        {nav.view === 'module' && nav.currentModule && (() => {
          const mod = MODULES[nav.currentModule]
          const currentPhaseNum = nav.currentPhase || 1
          const currentPhaseInfo = mod.phases[currentPhaseNum - 1]
          const isCurrentPhasePassed = progress[nav.currentModule].includes(currentPhaseNum)
          const passedCount = progress[nav.currentModule].length

          return (
            <div className={`min-h-screen bg-gradient-to-br ${mod.bgGradient}`}>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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

                {/* Phase Selector */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                  {mod.phases.map((p) => {
                    const isPassed = progress[nav.currentModule].includes(p.phase)
                    const isCurrent = currentPhaseNum === p.phase
                    return (
                      <button
                        key={p.phase}
                        onClick={() => nav.setPhase(p.phase)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border whitespace-nowrap text-sm transition-all ${
                          isCurrent
                            ? `border-current ${mod.color} ${mod.accentBg} font-medium`
                            : isPassed
                            ? 'border-green-500/30 text-green-400 bg-green-500/5'
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current" />}
                        <span className="hidden sm:inline">{p.name}</span>
                        <span className="sm:hidden">GĐ {p.phase}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mb-8 flex items-center gap-3">
                  <Progress value={(passedCount / 5) * 100} className="flex-1 h-2" />
                  <span className="text-xs text-white/40">{passedCount}/5</span>
                </div>

                {/* Quiz Area */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{currentPhaseInfo.title}: {currentPhaseInfo.name}</h2>
                      <p className="text-white/40 text-sm mt-1">Yêu cầu: 4/5 câu đúng để qua</p>
                    </div>
                    {quizSubmitted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startQuiz(nav.currentModule!, currentPhaseNum)}
                        className="border-white/20"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Làm lại
                      </Button>
                    )}
                  </div>

                  {quizLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                    </div>
                  ) : quizQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {quizQuestions.map((q, qIdx) => {
                        const selected = selectedAnswers[qIdx]
                        const isCorrect = selected === q.correct
                        const showExp = showExplanation[qIdx] || quizSubmitted

                        return (
                          <Card key={qIdx} className={`border ${showExp && selected ? (isCorrect ? 'border-green-500/30' : 'border-red-500/30') : 'border-white/10'} bg-white/[0.03]`}>
                            <CardContent className="p-4 sm:p-6">
                              <p className="font-medium mb-4 text-sm sm:text-base">
                                <span className="text-white/40 mr-2">Câu {qIdx + 1}.</span>
                                {q.question}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                                  const isSelected = selected === opt
                                  const isCorrectOpt = q.correct === opt
                                  let optClass = 'border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                                  if (quizSubmitted) {
                                    if (isCorrectOpt) optClass = 'border-green-500/50 bg-green-500/10 text-green-400'
                                    else if (isSelected && !isCorrect) optClass = 'border-red-500/50 bg-red-500/10 text-red-400'
                                  } else if (isSelected) {
                                    optClass = `${mod.color} border-current ${mod.accentBg}`
                                  }

                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => !quizSubmitted && setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                                      disabled={quizSubmitted}
                                      className={`flex items-start gap-3 p-3 rounded-lg border text-left text-sm transition-all ${optClass} ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                      <span className="font-mono text-xs mt-0.5 opacity-60">{opt.toUpperCase()}</span>
                                      <span className="leading-relaxed">{q.options[opt]}</span>
                                      {quizSubmitted && isCorrectOpt && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-green-400" />}
                                      {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto shrink-0 text-red-400" />}
                                    </button>
                                  )
                                })}
                              </div>
                              {showExp && (
                                <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-500/5 border border-green-500/20' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                                  <p className={isCorrect ? 'text-green-400' : 'text-amber-400'}>
                                    {isCorrect ? '✅ Chính xác! ' : '❌ Chưa đúng. '}
                                    {q.explanation}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <Card className="border-white/10 bg-white/[0.02]">
                      <CardContent className="p-8 text-center">
                        <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 mb-4">Nhấn nút bên dưới để bắt đầu quiz giai đoạn này</p>
                        <Button
                          onClick={() => startQuiz(nav.currentModule!, currentPhaseNum)}
                          className={`${mod.color} border border-current ${mod.accentBg} hover:opacity-90`}
                          variant="outline"
                        >
                          Bắt đầu Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit Button */}
                  {!quizSubmitted && quizQuestions.length > 0 && Object.keys(selectedAnswers).length === quizQuestions.length && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={submitQuiz}
                        size="lg"
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8"
                      >
                        Nộp bài ({Object.keys(selectedAnswers).length}/{quizQuestions.length})
                      </Button>
                    </div>
                  )}

                  {/* Quiz Result */}
                  {quizSubmitted && (
                    <Card className={`border-2 ${quizPassed ? 'border-green-500/30' : 'border-red-500/30'} bg-white/[0.03]`}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{quizPassed ? '🎉' : '💪'}</div>
                        <h3 className={`text-xl font-bold mb-2 ${quizPassed ? 'text-green-400' : 'text-red-400'}`}>
                          {quizPassed ? 'Chúc mừng! Bạn đã qua giai đoạn này!' : 'Chưa qua — Thử lại nhé!'}
                        </h3>
                        <p className="text-white/50 mb-4">
                          Kết quả: <span className="font-bold text-white">{quizScore}/{quizQuestions.length}</span> câu đúng
                        </p>
                        {quizPassed && isCurrentPhasePassed && currentPhaseNum < 5 && (
                          <Button
                            onClick={() => {
                              nav.setPhase(currentPhaseNum + 1)
                              setQuizQuestions([])
                              setQuizSubmitted(false)
                              setSelectedAnswers({})
                            }}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
                          >
                            Tiếp tục giai đoạn tiếp theo
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* PROFILE VIEW */}
        {nav.view === 'profile' && user && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
            <p className="text-white/40 text-sm mb-8">Theo dõi tiến độ học tập và nhật ký phản tỉnh</p>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                  <Trophy className="w-4 h-4 mr-1.5" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="journal" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                  <PenLine className="w-4 h-4 mr-1.5" />
                  Nhật ký
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{profile?.xp || 0}</p>
                        <p className="text-xs text-white/40">Tổng XP</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{profile?.streak || 0}</p>
                        <p className="text-xs text-white/40">Ngày streak</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalProgress}/{totalPhases}</p>
                        <p className="text-xs text-white/40">Giai đoạn hoàn thành</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Module Progress */}
                <Card className="border-white/10 bg-white/[0.03]">
                  <CardHeader>
                    <CardTitle className="text-lg">Tiến độ theo module</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => {
                      const passed = progress[slug].length
                      return (
                        <div key={slug}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={mod.color}>{mod.icon}</span>
                              <span className="font-medium">{mod.name}</span>
                              <span className="text-xs text-white/40">{mod.subtitle}</span>
                            </div>
                            <span className="text-sm text-white/40">{passed}/5</span>
                          </div>
                          <Progress value={(passed / 5) * 100} className="h-2 mb-3" />
                          <div className="flex gap-1.5">
                            {mod.phases.map((p) => {
                              const isPassed = progress[slug].includes(p.phase)
                              return (
                                <button
                                  key={p.phase}
                                  onClick={() => {
                                    nav.setModule(slug)
                                    nav.setPhase(p.phase)
                                  }}
                                  className={`flex-1 h-8 rounded text-xs transition-all ${
                                    isPassed
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                      : 'bg-white/[0.03] text-white/30 border border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {isPassed ? '✓' : p.phase}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Journal Tab */}
              <TabsContent value="journal" className="space-y-6">
                <Card className="border-white/10 bg-white/[0.03]">
                  <CardHeader>
                    <CardTitle className="text-lg">Viết nhật ký phản tỉnh</CardTitle>
                    <CardDescription className="text-white/40 text-sm">
                      Ghi nhận suy nghĩ, bài học và insight sau mỗi buổi học
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Tiêu đề..."
                      value={journalTitle}
                      onChange={(e) => setJournalTitle(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                    <div className="flex gap-2">
                      {(['systema', 'argos', 'cognos'] as ModuleSlug[]).map((slug) => (
                        <button
                          key={slug}
                          onClick={() => setJournalModule(journalModule === slug ? '' : slug)}
                          className={`px-3 py-1.5 rounded text-xs border transition-all ${
                            journalModule === slug
                              ? `${MODULES[slug].color} border-current ${MODULES[slug].accentBg}`
                              : 'border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {MODULES[slug].name}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Viết suy nghĩ của bạn tại đây..."
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                    />
                    <Button
                      onClick={addJournalEntry}
                      disabled={!journalTitle}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
                    >
                      <PenLine className="w-4 h-4 mr-1" />
                      Lưu nhật ký
                    </Button>
                  </CardContent>
                </Card>

                {/* Journal Entries List */}
                {journalEntries.length > 0 ? (
                  <div className="space-y-3">
                    {journalEntries.map((entry) => (
                      <Card key={entry.id} className="border-white/10 bg-white/[0.03]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-sm">{entry.title}</h3>
                                {entry.module_slug && (
                                  <Badge variant="outline" className={`${MODULES[entry.module_slug as ModuleSlug]?.color || 'text-white/40'} border-current text-[10px]`}>
                                    {MODULES[entry.module_slug as ModuleSlug]?.name || entry.module_slug}
                                  </Badge>
                                )}
                              </div>
                              {entry.content && (
                                <p className="text-white/40 text-sm line-clamp-2">{entry.content}</p>
                              )}
                              {entry.created_at && (
                                <p className="text-white/20 text-xs mt-2">
                                  {new Date(entry.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-white/10 bg-white/[0.03]">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Chưa có nhật ký nào. Bắt đầu ghi nhận suy nghĩ của bạn!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/5 bg-black/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <Brain className="w-4 h-4 text-cyan-400/50" />
            <span>ThinkingAI — Nâng cấp tư duy mỗi ngày</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <span>© 2025</span>
            <Separator orientation="vertical" className="h-3" />
            <span>3 Modules · 15 Phases · 75 Exercises</span>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="/thinking-ai-project.zip"
              download="thinking-ai-project.zip"
              className="flex items-center gap-1 text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Source Code (.zip)
            </a>
          </div>
        </div>
      </footer>

      {/* ========== AUTH MODAL ========== */}
      <Dialog open={nav.showAuthModal} onOpenChange={(open) => !open && nav.closeAuth()}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {nav.authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {nav.authMode === 'signup' && (
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Tên hiển thị</label>
                <Input
                  placeholder="Nhập tên của bạn..."
                  value={authDisplayName}
                  onChange={(e) => setAuthDisplayName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Mật khẩu</label>
              <Input
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              onClick={nav.authMode === 'login' ? handleLogin : handleSignup}
              disabled={authLoading || !authEmail || !authPassword}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : nav.authMode === 'login' ? (
                'Đăng nhập'
              ) : (
                'Tạo tài khoản'
              )}
            </Button>

            <p className="text-center text-sm text-white/40">
              {nav.authMode === 'login' ? (
                <>
                  Chưa có tài khoản?{' '}
                  <button onClick={() => nav.openAuth('signup')} className="text-cyan-400 hover:underline">
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{' '}
                  <button onClick={() => nav.openAuth('login')} className="text-cyan-400 hover:underline">
                    Đăng nhập
                  </button>
                </>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
