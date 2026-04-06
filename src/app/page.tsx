'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
  Award, PenLine, Trash2, Loader2, Shield, Zap, Target,
  FileText, X as XIcon, Lock, Map, Star
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
// PHASE DESCRIPTIONS FOR ROADMAP
// ============================================
const PHASE_DESCRIPTIONS: Record<ModuleSlug, Record<number, string>> = {
  systema: {
    1: 'Hiểu tư duy phi tuyến tính, vòng lặp phản hồi (reinforcing/balancing), và mô hình tảng băng trôi.',
    2: 'Nắm vững Stock & Flow, 8 System Archetypes phổ biến trong kinh doanh và đời sống.',
    3: 'Nhận diện Mental Models, 5 mô hình tư duy cốt lõi, và 12 Đòn Bẩy của Meadows.',
    4: 'Thiết kế hệ thống hiệu quả: 6 nguyên tắc, Resilience vs Antifragility, và dự phòng.',
    5: 'Tổng hợp thực chiến: Framework 5 bước phân tích hệ thống, checklist quyết định hàng ngày.',
  },
  argos: {
    1: 'Hiểu tâm lý thuyết phục: Tam giác Tu từ (Ethos-Pathos-Logos) và 7 nguyên tắc Cialdini.',
    2: 'Phân tích lập luận: Deductive vs Inductive, PREP Framework, và nhận diện 12+ ngụy biện.',
    3: 'Nghệ thuật đặt câu hỏi: Socratic Questioning, kỹ thuật Chris Voss, và Active Listening.',
    4: 'Kỹ năng Pitching: Cấu trúc Hook-Problem-Solution-Evidence-Ask, 3 frameworks Storytelling.',
    5: 'Tổng hợp thực chiến: Thuyết phục trong tình huống phức tạp, xử lý phản đối, và debate.',
  },
  cognos: {
    1: 'Bản chất AI: Lịch sử, loại AI (Narrow/General/AGI), Machine Learning basics, Neural Networks.',
    2: 'Giới hạn AI: Hallucination, Bias, Coral problem, bẫy Automation Bias và Overreliance.',
    3: 'Prompt Thinking: Technique phân tích task, chain-of-thought, role prompting, và workflow design.',
    4: 'Đánh giá output: Framework RICE, đánh giá rủi ro, AI governance, và responsible AI.',
    5: 'Tốt nghiệp: Tổng hợp tư duy quản trị AI, xây dựng AI strategy cho tổ chức.',
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
    for (const mod of ['systema', 'argos', 'cognos'] as ModuleSlug[]) {
      if (data[mod]) {
        FALLBACK_QUIZZES[mod] = {}
        for (const phase of data[mod].phases) {
          FALLBACK_QUIZZES[mod][phase.phase] = phase.questions.map((q: { question: string; options: Record<string, string>; correct: string; explanation: string }) => ({
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
// LOCAL STORAGE AUTH HELPERS
// ============================================
const AUTH_STORAGE_KEY = 'thinking-ai-user'

function saveUserToLocalStorage(user: User, accessToken: string) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || '',
      accessToken,
    }))
  } catch {
    // localStorage not available
  }
}

function loadUserFromLocalStorage(): { id: string; email: string; displayName: string; accessToken: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearUserFromLocalStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // localStorage not available
  }
}

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
  const [quizResetKey, setQuizResetKey] = useState(0)

  // Docs state
  const [docsContent, setDocsContent] = useState<Record<string, { title: string; content: string }>>({})
  const [docsLoading, setDocsLoading] = useState(false)
  const [currentDocs, setCurrentDocs] = useState<{ title: string; content: string } | null>(null)
  const [docsReadPhases, setDocsReadPhases] = useState<Set<string>>(new Set())

  // Journal state
  const [journalEntries, setJournalEntries] = useState<Array<{ id: string; title: string; content: string; module_slug?: string; tags: string[]; created_at?: string }>>([])
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalModule, setJournalModule] = useState<ModuleSlug | ''>('')

  // Track previous phase for quiz reset
  const prevPhaseRef = useRef<number | null>(null)
  const prevModuleRef = useRef<ModuleSlug | null>(null)

  // Initialize auth with localStorage fallback
  useEffect(() => {
    // Step 1: Try to restore from localStorage immediately
    const savedUser = loadUserFromLocalStorage()
    if (savedUser) {
      const mockUser = {
        id: savedUser.id,
        email: savedUser.email,
        user_metadata: { display_name: savedUser.displayName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '',
      } as unknown as User
      setUser(mockUser)
      fetchProfile(savedUser.id)
      fetchProgress(savedUser.id)
    }

    const supabase = tryGetSupabase()
    if (!supabase) {
      if (!savedUser) setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          // Update localStorage with fresh data
          saveUserToLocalStorage(session.user, session.access_token)
          await fetchProfile(session.user.id)
          await fetchProgress(session.user.id)
        } else if (!savedUser) {
          // No session and no saved user - clear everything
          clearUserFromLocalStorage()
        }
      } catch {
        // Auth not available yet
      } finally {
        setLoading(false)
      }
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        saveUserToLocalStorage(session.user, session.access_token)
        await fetchProfile(session.user.id)
        await fetchProgress(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setProgress({ systema: [], argos: [], cognos: [] })
        clearUserFromLocalStorage()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Reset quiz state when entering a new phase
  useEffect(() => {
    if (nav.view === 'module' && nav.currentModule && nav.currentPhase) {
      if (
        prevModuleRef.current !== nav.currentModule ||
        prevPhaseRef.current !== nav.currentPhase
      ) {
        prevModuleRef.current = nav.currentModule
        prevPhaseRef.current = nav.currentPhase
        setQuizResetKey(prev => prev + 1)
        setQuizQuestions([])
        setSelectedAnswers({})
        setQuizSubmitted(false)
        setQuizScore(0)
        setQuizPassed(false)
        setShowExplanation({})
      }
    }
  }, [nav.view, nav.currentModule, nav.currentPhase])

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
      const { error, data, needsConfirmation, message } = await res.json()
      if (error) {
        toast.error(error)
      } else if (needsConfirmation) {
        toast.success(message || 'Đăng ký thành công! Kiểm tra email để xác nhận.')
        nav.closeAuth()
      } else if (data?.session?.user) {
        toast.success('Đăng ký thành công!')
        setUser(data.session.user)
        saveUserToLocalStorage(data.session.user, data.session.access_token)
        nav.closeAuth()
        await fetchProfile(data.session.user.id)
        await fetchProgress(data.session.user.id)
      } else {
        toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.')
        nav.openAuth('login')
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
          saveUserToLocalStorage(data.session.user, data.session.access_token)
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
    clearUserFromLocalStorage()
    nav.goHome()
    toast.success('Đã đăng xuất')
  }

  const startQuiz = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    const docsKey = `${moduleSlug}-${phase}`
    setDocsReadPhases(prev => new Set(prev).add(docsKey))
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

  const loadDocsContent = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    const key = `${moduleSlug}-${phase}`
    if (docsContent[key]) {
      setCurrentDocs(docsContent[key])
      nav.openDocs(phase)
      setDocsReadPhases(prev => new Set(prev).add(key))
      return
    }

    setDocsLoading(true)
    try {
      const res = await fetch('/docs-content.json')
      if (!res.ok) throw new Error('Failed to load docs')
      const data = await res.json()

      // Cache all docs content
      const allDocs: Record<string, { title: string; content: string }> = {}
      for (const modSlug of ['systema', 'argos', 'cognos'] as ModuleSlug[]) {
        const mod = data[modSlug]
        if (mod?.phases) {
          for (const p of mod.phases) {
            allDocs[`${modSlug}-${p.phase}`] = { title: p.title, content: p.content }
          }
        }
      }
      setDocsContent(allDocs)

      const targetDoc = allDocs[key]
      if (targetDoc) {
        setCurrentDocs(targetDoc)
        nav.openDocs(phase)
        setDocsReadPhases(prev => new Set(prev).add(key))
      } else {
        toast.error('Chưa có tài liệu cho giai đoạn này')
      }
    } catch {
      toast.error('Không thể tải tài liệu. Vui lòng thử lại.')
    } finally {
      setDocsLoading(false)
    }
  }, [docsContent])

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
                        const isLocked = p.phase > 1 && !progress[slug].includes(p.phase - 1)
                        return (
                          <div key={p.phase} className={`flex items-center gap-2 text-xs ${isLocked ? 'opacity-40' : ''}`}>
                            {isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            ) : isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                            )}
                            <span className={isPassed ? 'text-white/70' : isLocked ? 'text-white/20' : 'text-white/30'}>
                              {p.phase}. {p.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                      <span>Xem lộ trình</span>
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

        {/* ========== ROADMAP VIEW ========== */}
        {nav.view === 'roadmap' && nav.currentModule && (() => {
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
                    const phaseDesc = PHASE_DESCRIPTIONS[nav.currentModule]?.[phaseInfo.phase] || ''

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
                                    <h3 className={`font-semibold text-sm sm:text-base ${isPassed ? 'text-green-400' : isCurrent ? 'text-white' : isLocked ? 'text-white/30' : 'text-white/60'}`}>
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
        })()}

        {/* ========== MODULE VIEW (Learning View for a Phase) ========== */}
        {nav.view === 'module' && nav.currentModule && nav.currentPhase && (() => {
          const mod = MODULES[nav.currentModule]
          const currentPhaseNum = nav.currentPhase
          const currentPhaseInfo = mod.phases[currentPhaseNum - 1]
          const isCurrentPhasePassed = progress[nav.currentModule].includes(currentPhaseNum)
          const stepKey = `${nav.currentModule}-${currentPhaseNum}`
          const hasReadDocs = docsReadPhases.has(stepKey)
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
                  <button onClick={nav.goRoadmap} className={`hover:text-white transition-colors ${mod.color}`}>{mod.name}</button>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-white/70">{currentPhaseInfo.title}</span>
                </div>

                {/* Phase Title */}
                <div className="mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold">{currentPhaseInfo.title}: {currentPhaseInfo.name}</h1>
                  <p className="text-white/40 text-sm mt-1">Yêu cầu: 4/5 câu đúng để qua</p>
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

                {/* ===== MAIN CONTENT BASED ON STEP ===== */}

                {/* STEP 1: Before reading docs - Show prominent docs card */}
                {!hasReadDocs && !isActiveQuiz && !isQuizDone && (
                  <div className="space-y-6">
                    <Card
                      className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-cyan-950/5 cursor-pointer hover:border-cyan-500/40 transition-all group"
                      onClick={() => loadDocsContent(nav.currentModule!, currentPhaseNum)}
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
                              {PHASE_DESCRIPTIONS[nav.currentModule]?.[currentPhaseNum] || 'Đọc kỹ tài liệu trước khi làm bài test. Bạn cần hiểu lý thuyết để đạt 4/5 câu đúng.'}
                            </p>
                            <Button
                              size="lg"
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              📖 Xem tài liệu
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* STEP 2: After reading docs, before quiz - Show quiz start button */}
                {isAfterDocsRead && !isQuizDone && (
                  <div className="space-y-6">
                    {/* Docs read confirmation */}
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-green-400 text-sm font-medium">Tài liệu đã đọc! ✅</span>
                    </div>

                    {/* Start quiz card */}
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
                          5 câu hỏi trắc nghiệm. Cần đúng ít nhất 4/5 để qua giai đoạn.
                        </p>
                        <Button
                          size="lg"
                          onClick={() => startQuiz(nav.currentModule!, currentPhaseNum)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                        >
                          ✍️ Bắt đầu làm bài test
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                        <div className="mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadDocsContent(nav.currentModule!, currentPhaseNum)}
                            className="text-white/30 hover:text-white/60"
                          >
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadDocsContent(nav.currentModule!, currentPhaseNum)}
                        disabled={docsLoading}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        {docsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-1" />
                        )}
                        <span className="hidden sm:inline">Xem tài liệu</span>
                      </Button>
                    </div>

                    {/* Quiz questions */}
                    <div className="space-y-4">
                      {quizQuestions.map((q, qIdx) => {
                        const selected = selectedAnswers[qIdx]
                        const isCorrect = selected === q.correct

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
                                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
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
                          onClick={submitQuiz}
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
                            <Button
                              variant="outline"
                              onClick={() => {
                                nav.closeDocs()
                                loadDocsContent(nav.currentModule!, currentPhaseNum)
                              }}
                              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Ôn lại tài liệu
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuizQuestions([])
                              setSelectedAnswers({})
                              setQuizSubmitted(false)
                              setQuizScore(0)
                              setQuizPassed(false)
                              setShowExplanation({})
                              setQuizResetKey(prev => prev + 1)
                            }}
                            className="border-white/20"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Làm lại quiz
                          </Button>
                          {quizPassed && currentPhaseNum < 5 && (
                            <Button
                              onClick={() => {
                                nav.startPhase(currentPhaseNum + 1)
                              }}
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
                            >
                              Tiếp giai đoạn tiếp theo
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                          {quizPassed && currentPhaseNum === 5 && (
                            <Button
                              onClick={nav.goRoadmap}
                              className="bg-green-500 hover:bg-green-400 text-black font-medium"
                            >
                              <Trophy className="w-4 h-4 mr-1" />
                              Hoàn thành module! Về lộ trình
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
                                    <div
                                      key={opt}
                                      className={`flex items-start gap-3 p-2.5 rounded-lg border text-left text-sm ${optClass}`}
                                    >
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
                              const isLocked = p.phase > 1 && !progress[slug].includes(p.phase - 1)
                              return (
                                <button
                                  key={p.phase}
                                  onClick={() => {
                                    if (isLocked) {
                                      toast.warning('Bạn cần hoàn thành giai đoạn trước trước khi tiếp tục')
                                      return
                                    }
                                    nav.setModule(slug)
                                  }}
                                  className={`flex-1 h-8 rounded text-xs transition-all ${
                                    isLocked
                                      ? 'bg-white/[0.01] text-white/15 border border-white/5 cursor-not-allowed opacity-40'
                                      : isPassed
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                      : 'bg-white/[0.03] text-white/30 border border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {isPassed ? '✓' : isLocked ? '🔒' : p.phase}
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
            <span>© 2025 ThinkingAI</span>
            <Separator orientation="vertical" className="h-3" />
            <span>3 Modules · 15 Phases · 75 Exercises</span>
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

      {/* ========== DOCS OVERLAY ========== */}
      <Dialog open={nav.showDocs} onOpenChange={(open) => {
        if (!open) {
          nav.closeDocs()
          setCurrentDocs(null)
        }
      }}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-3xl max-h-[90vh] p-0 overflow-hidden">
          {/* Docs Header */}
          <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-semibold truncate">
                  {currentDocs?.title || 'Tài liệu học tập'}
                </DialogTitle>
                {nav.currentModule && (
                  <p className="text-xs text-white/40">
                    {MODULES[nav.currentModule].name} — {MODULES[nav.currentModule].subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                nav.closeDocs()
                setCurrentDocs(null)
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white shrink-0"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Docs Content */}
          <ScrollArea className="max-h-[calc(90vh-5rem)]">
            <div className="px-6 py-6">
              {docsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                    <p className="text-white/40 text-sm">Đang tải tài liệu...</p>
                  </div>
                </div>
              ) : currentDocs ? (
                <div
                  className="docs-overlay-content"
                  dangerouslySetInnerHTML={{ __html: currentDocs.content }}
                />
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">Không có tài liệu cho giai đoạn này</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Docs Footer */}
          {currentDocs && nav.currentModule && (
            <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between bg-zinc-950/95">
              <p className="text-xs text-white/30">
                💡 Đọc kỹ tài liệu trước khi làm quiz để đạt kết quả tốt nhất
              </p>
              <Button
                size="sm"
                onClick={() => {
                  nav.closeDocs()
                  setCurrentDocs(null)
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
              >
                Đã hiểu, đóng lại
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
