'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Trophy,
  CheckCircle2,
  PenLine,
  BookOpen,
  Brain,
  Swords,
  Cpu,
  Gamepad2,
  Zap,
  Target,
  Eye,
  EyeOff,
  Clock,
  TrendingUp,
  Mail,
  Calendar,
  Shield,
  Lock,
  User,
  KeyRound,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { MODULES, TOTAL_PHASES } from '@/lib/constants/modules'
import type { ModuleSlug, UserProfile, SidebarTab } from '@/lib/types'
import { useNavigation } from '@/lib/store'

// ============================================
// Types
// ============================================
interface JournalEntry {
  id: string
  title: string
  content: string
  module_slug?: string
  tags: string[]
  created_at?: string
}

interface ProfileViewProps {
  profile: UserProfile | null
  progress: Record<ModuleSlug, number[]>
  totalProgress: number
  readDocs: Record<ModuleSlug, Set<number>>
  checklist: Record<ModuleSlug, Set<number>>
  journalEntries: JournalEntry[]
  journalTitle: string
  journalContent: string
  journalModule: ModuleSlug | ''
  onJournalTitleChange: (title: string) => void
  onJournalContentChange: (content: string) => void
  onJournalModuleChange: (module: ModuleSlug | '') => void
  onAddJournalEntry: () => void
  userId?: string
  userEmail?: string
}

// ============================================
// Module icons map
// ============================================
const MODULE_ICONS: Record<ModuleSlug, React.ReactNode> = {
  systema: <Brain className="w-4 h-4" />,
  argos: <Swords className="w-4 h-4" />,
  cognos: <Cpu className="w-4 h-4" />,
  ludus: <Gamepad2 className="w-4 h-4" />,
}

// ============================================
// MAIN COMPONENT
// ============================================
export function ProfileView({
  profile,
  progress,
  totalProgress,
  readDocs,
  checklist,
  journalEntries,
  journalTitle,
  journalContent,
  journalModule,
  onJournalTitleChange,
  onJournalContentChange,
  onJournalModuleChange,
  onAddJournalEntry,
  userId,
  userEmail,
}: ProfileViewProps) {
  const nav = useNavigation()
  const [practiceCount, setPracticeCount] = useState(0)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Fetch practice count
  useEffect(() => {
    if (!userId) return
    fetch(`/api/practice/history?userId=${userId}`)
      .then(res => res.json())
      .then(({ data }) => setPracticeCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {})
  }, [userId])

  // Calculate totals
  const totalDocsRead = Object.values(readDocs).reduce((sum, set) => sum + set.size, 0)
  const totalQuizDone = Object.values(checklist).reduce((sum, set) => sum + set.size, 0)
  const totalItems = TOTAL_PHASES * 2 + practiceCount // docs + quiz + practice
  const completedItems = totalDocsRead + totalQuizDone + practiceCount
  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  // Navigate to module tab
  const goToModule = (slug: ModuleSlug, tab: SidebarTab = 'roadmap') => {
    nav.openModuleTab(slug, tab)
  }

  // Navigate to specific phase docs
  const goToDocs = (slug: ModuleSlug, phase: number) => {
    nav.openModuleTab(slug, 'docs')
  }

  // Navigate to specific phase quiz
  const goToQuiz = (slug: ModuleSlug, phase: number) => {
    nav.openModuleTab(slug, 'quiz')
  }

  // Change password handler
  const handleChangePassword = useCallback(async () => {
    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }
    if (currentPassword === newPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại.')
      return
    }

    // Get access token from localStorage
    let accessToken = ''
    try {
      const savedUser = localStorage.getItem('thinking-ai-user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        accessToken = parsed.accessToken || ''
      }
    } catch {
      // ignore
    }

    if (!accessToken) {
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
          accessToken,
        }),
      })
      const result = await res.json()

      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        toast.success(result.message || 'Đổi mật khẩu thành công!')
        // Clear form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowCurrentPassword(false)
        setShowNewPassword(false)
      }
    } catch {
      toast.error('Lỗi kết nối server. Vui lòng thử lại.')
    } finally {
      setChangingPassword(false)
    }
  }, [currentPassword, newPassword, confirmPassword])

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Chưa có'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get display email
  const displayEmail = profile?.email || userEmail || ''

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
          <Trophy className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{profile?.display_name || 'Người học'}</h1>
          <p className="text-white/40 text-sm">Theo dõi tiến độ học tập và rèn luyện tư duy</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6 space-y-6">
        <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs sm:text-sm">
            <Trophy className="w-4 h-4 mr-1.5" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="account" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs sm:text-sm">
            <Shield className="w-4 h-4 mr-1.5" />
            Tài khoản
          </TabsTrigger>
          <TabsTrigger value="modules" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs sm:text-sm">
            <Target className="w-4 h-4 mr-1.5" />
            Chi tiết
          </TabsTrigger>
          <TabsTrigger value="journal" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs sm:text-sm">
            <PenLine className="w-4 h-4 mr-1.5" />
            Nhật ký
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* OVERVIEW TAB */}
        {/* ============================================ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overall Progress */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Tiến độ tổng quát
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Hoàn thành tổng thể</span>
                <span className="text-cyan-400 font-medium">{overallPercent}%</span>
              </div>
              <Progress value={overallPercent} className="h-3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {/* Docs Read */}
                <button
                  onClick={() => goToModule('systema', 'docs')}
                  className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-lg font-bold">{totalDocsRead}</span>
                  </div>
                  <p className="text-xs text-white/40">Tài liệu đã đọc</p>
                  <p className="text-[10px] text-white/20 mt-0.5">/ {TOTAL_PHASES} tài liệu</p>
                </button>

                {/* Quiz Done */}
                <button
                  onClick={() => goToModule('systema', 'quiz')}
                  className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-lg font-bold">{totalQuizDone}</span>
                  </div>
                  <p className="text-xs text-white/40">Bài tập đã làm</p>
                  <p className="text-[10px] text-white/20 mt-0.5">/ {TOTAL_PHASES} bài test</p>
                </button>

                {/* Quiz Passed */}
                <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-lg font-bold">{totalProgress}</span>
                  </div>
                  <p className="text-xs text-white/40">Giai đoạn qua</p>
                  <p className="text-[10px] text-white/20 mt-0.5">/ {TOTAL_PHASES} giai đoạn</p>
                </div>

                {/* Practice Sessions */}
                <button
                  onClick={() => nav.openPractice()}
                  className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-lg font-bold">{practiceCount}</span>
                  </div>
                  <p className="text-xs text-white/40">Thực chiến AI</p>
                  <p className="text-[10px] text-white/20 mt-0.5">bài tự luận đã nộp</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Module Summary Cards */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tiến độ theo module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => {
                  const passed = progress[slug]?.length || 0
                  const docsRead = readDocs[slug]?.size || 0
                  const quizDone = checklist[slug]?.size || 0
                  const modulePercent = ((docsRead + quizDone) / 10) * 100

                  return (
                    <button
                      key={slug}
                      onClick={() => goToModule(slug, 'roadmap')}
                      className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`p-1.5 rounded-md ${mod.accentBg}`}>
                          <span className={mod.color}>{mod.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{mod.name}</span>
                            {passed === 5 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <span className="text-xs text-white/30">{mod.subtitle}</span>
                        </div>
                        <span className="text-xs text-white/30 group-hover:text-white/50">{modulePercent}%</span>
                      </div>

                      <Progress value={modulePercent} className="h-1.5 mb-2.5" />

                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-400/60" />
                          {docsRead}/5 đọc
                        </span>
                        <span className="flex items-center gap-1">
                          <PenLine className="w-3 h-3 text-cyan-400/60" />
                          {quizDone}/5 test
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400/60" />
                          {passed}/5 qua
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* ACCOUNT TAB */}
        {/* ============================================ */}
        <TabsContent value="account" className="space-y-6">
          {/* Account Information */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Thông tin tài khoản
              </CardTitle>
              <CardDescription className="text-white/40 text-sm">
                Thông tin đăng nhập và hoạt động tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display Name */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="p-2 rounded-md bg-cyan-500/10">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30">Tên hiển thị</p>
                  <p className="text-sm font-medium">{profile?.display_name || 'Người học'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="p-2 rounded-md bg-emerald-500/10">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30">Email đăng nhập</p>
                  <p className="text-sm font-medium">{displayEmail || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {/* Account ID */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="p-2 rounded-md bg-amber-500/10">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30">ID tài khoản</p>
                  <p className="text-sm font-mono text-white/60">{userId ? `${userId.slice(0, 8)}...${userId.slice(-4)}` : '—'}</p>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="p-2 rounded-md bg-purple-500/10">
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30">Đăng nhập gần nhất</p>
                  <p className="text-sm">{formatDate(profile?.last_login)}</p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="p-2 rounded-md bg-blue-500/10">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30">Ngày tạo tài khoản</p>
                  <p className="text-sm">{formatDate(profile?.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Đổi mật khẩu
              </CardTitle>
              <CardDescription className="text-white/40 text-sm">
                Đổi mật khẩu để bảo vệ tài khoản của bạn. Sau khi đổi thành công, bạn sẽ cần đăng nhập lại.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-400/70">
                  Sau khi đổi mật khẩu thành công, bạn sẽ được tự động đăng xuất. Hãy sử dụng mật khẩu mới để đăng nhập lại.
                </p>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm text-white/50 font-medium">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm text-white/50 font-medium">Mật khẩu mới</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-sm text-white/50 font-medium">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                  />
                </div>
                {/* Real-time validation hints */}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Mật khẩu xác nhận không khớp
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 6 && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Mật khẩu khớp
                  </p>
                )}
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-white/30">Độ mạnh mật khẩu:</p>
                    <span className={`text-xs font-medium ${
                      newPassword.length < 6 ? 'text-red-400' :
                      newPassword.length < 8 ? 'text-amber-400' :
                      newPassword.length < 12 ? 'text-emerald-400' :
                      'text-cyan-400'
                    }`}>
                      {newPassword.length < 6 ? 'Quá yếu' :
                       newPassword.length < 8 ? 'Yếu' :
                       newPassword.length < 12 ? 'Khá' : 'Mạnh'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          newPassword.length >= level * 3
                            ? newPassword.length < 6 ? 'bg-red-400' :
                              newPassword.length < 8 ? 'bg-amber-400' :
                              newPassword.length < 12 ? 'bg-emerald-400' : 'bg-cyan-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Separator className="bg-white/5" />

              {/* Submit button */}
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đổi mật khẩu...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* MODULES DETAIL TAB */}
        {/* ============================================ */}
        <TabsContent value="modules" className="space-y-6">
          {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => {
            const passed = progress[slug]?.length || 0

            return (
              <Card key={slug} className="border-white/10 bg-white/[0.03]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={mod.color}>{mod.icon}</span>
                      <div>
                        <CardTitle className="text-base">{mod.name}</CardTitle>
                        <CardDescription className="text-white/30 text-xs">{mod.subtitle}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${passed === 5 ? 'border-emerald-500/30 text-emerald-400' : 'border-white/10 text-white/40'} text-xs`}>
                        {passed}/5 qua
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => goToModule(slug)} className="text-xs text-cyan-400 hover:bg-cyan-500/10">
                        Mở →
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Phase rows */}
                  <div className="space-y-2">
                    {mod.phases.map((phase) => {
                      const isPassed = progress[slug]?.includes(phase.phase) || false
                      const isDocRead = readDocs[slug]?.has(phase.phase) || false
                      const isQuizDone = checklist[slug]?.has(phase.phase) || false

                      return (
                        <div key={phase.phase} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          {/* Phase badge */}
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                            isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-white/30 border border-white/10'
                          }`}>
                            {isPassed ? '✓' : phase.phase}
                          </div>

                          {/* Phase name */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 truncate">{phase.name}</p>
                          </div>

                          {/* Status badges */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Docs status */}
                            <button
                              onClick={() => goToDocs(slug, phase.phase)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all ${
                                isDocRead
                                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                  : 'border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
                              }`}
                            >
                              <BookOpen className="w-2.5 h-2.5" />
                              {isDocRead ? 'Đã đọc' : 'Chưa đọc'}
                            </button>

                            {/* Quiz status */}
                            <button
                              onClick={() => goToQuiz(slug, phase.phase)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all ${
                                isQuizDone
                                  ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'
                                  : 'border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
                              }`}
                            >
                              <PenLine className="w-2.5 h-2.5" />
                              {isQuizDone ? 'Đã làm' : 'Chưa làm'}
                            </button>

                            {/* Passed status */}
                            {isPassed && (
                              <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-[10px]">
                                <Trophy className="w-2.5 h-2.5 mr-0.5" />Qua
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => goToModule(slug, 'docs')} className="border-white/10 text-white/50 text-xs hover:text-white">
                      <BookOpen className="w-3 h-3 mr-1" />Xem tài liệu
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => goToModule(slug, 'quiz')} className="border-white/10 text-white/50 text-xs hover:text-white">
                      <PenLine className="w-3 h-3 mr-1" />Làm bài test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ============================================ */}
        {/* JOURNAL TAB */}
        {/* ============================================ */}
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
                onChange={(e) => onJournalTitleChange(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <div className="flex gap-2">
                {(['systema', 'argos', 'cognos', 'ludus'] as ModuleSlug[]).map((slug) => (
                  <button
                    key={slug}
                    onClick={() => onJournalModuleChange(journalModule === slug ? '' : slug)}
                    className={`px-3 py-1.5 rounded text-xs border transition-all flex items-center gap-1 ${
                      journalModule === slug
                        ? `${MODULES[slug].color} border-current ${MODULES[slug].accentBg}`
                        : 'border-white/10 text-white/40 hover:border-white/20'
                    }`}
                  >
                    {MODULE_ICONS[slug]}
                    {MODULES[slug].name}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Viết suy nghĩ của bạn tại đây..."
                value={journalContent}
                onChange={(e) => onJournalContentChange(e.target.value)}
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
              />
              <Button
                onClick={onAddJournalEntry}
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
  )
}
