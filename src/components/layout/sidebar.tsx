'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Home, Map, BookOpen, PenLine, User, LogIn, LogOut, ChevronRight, Menu, Zap, Library, CheckCircle2, Clock } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES } from '@/lib/constants/modules'
import type { User, UserProfile, ModuleSlug } from '@/lib/types'

interface SidebarProps {
  user: User | null
  profile: UserProfile | null
  progress: Record<ModuleSlug, number[]>
  onLogout: () => void
}

// ============================================
// Shared navigation content used by both Desktop & Mobile sidebars
// ============================================
function SidebarNav({ user, profile, progress, onLogout }: SidebarProps) {
  const nav = useNavigation()

  const handleModuleSelect = (slug: ModuleSlug) => {
    nav.setModule(slug)
    nav.setSidebarTab('roadmap')
  }

  return (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={nav.goHome}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            >
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
              <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
              <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
              <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
              <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
              <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
              <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
              <path d="M6 18a4 4 0 0 1-1.967-.516" />
              <path d="M19.967 17.484A4 4 0 0 1 18 18" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Thinking<span className="text-cyan-400">AI</span>
          </span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Home */}
        <button
          onClick={nav.goHome}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            nav.view === 'landing'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-white/50 hover:bg-white/5 hover:text-white/70'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Trang chủ</span>
        </button>

        {/* Module Selection */}
        {nav.currentModule && (
          <div className="pt-2 pb-2">
            <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">
              Module đang chọn
            </p>
            <div
              className={`px-3 py-2 rounded-lg ${MODULES[nav.currentModule].accentBg} border ${MODULES[nav.currentModule].borderColor}`}
            >
              <div className="flex items-center gap-2">
                <span className={MODULES[nav.currentModule].color}>
                  {MODULES[nav.currentModule].icon}
                </span>
                <span
                  className={`font-medium text-sm ${MODULES[nav.currentModule].color}`}
                >
                  {MODULES[nav.currentModule].name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Tabs — only show when a module is selected */}
        {nav.currentModule && (
          <div className="pt-2">
            <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">
              Điều hướng
            </p>

            <button
              onClick={() => nav.setSidebarTab('roadmap')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                nav.sidebarTab === 'roadmap'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Lộ trình</span>
            </button>

            <button
              onClick={() => nav.setSidebarTab('docs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                nav.sidebarTab === 'docs'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tài liệu</span>
            </button>

            <button
              onClick={() => nav.setSidebarTab('quiz')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                nav.sidebarTab === 'quiz'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>Bài tập</span>
            </button>
          </div>
        )}

        {/* Practice Menu — always visible */}
        <div className="pt-4">
          <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">
            Thực Chiến
          </p>
          <button
            onClick={nav.openPractice}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              nav.view === 'practice'
                ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Thực chiến với AI</span>
          </button>
        </div>

        {/* References Menu — always visible */}
        <div className="pt-4">
          <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">
            Nghiên cứu
          </p>
          <button
            onClick={nav.openReferences}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              nav.view === 'references'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Tài liệu tham khảo</span>
          </button>
        </div>

        {/* Module List */}
        <div className="pt-4">
          <p className="text-xs text-white/30 uppercase tracking-wider px-3 mb-2">
            Chọn Module
          </p>
          {(['systema', 'argos', 'cognos', 'ludus'] as ModuleSlug[]).map((slug) => {
            const mod = MODULES[slug]
            const completedCount = progress[slug]?.length ?? 0
            const isCompleted = completedCount === 6
            const isInProgress = completedCount > 0 && completedCount < 6
            return (
              <button
                key={slug}
                onClick={() => handleModuleSelect(slug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  nav.currentModule === slug
                    ? `${mod.accentBg} border ${mod.borderColor} ${mod.color}`
                    : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                <span className={nav.currentModule === slug ? mod.color : ''}>
                  {mod.icon}
                </span>
                <span className="flex-1 text-left truncate">{mod.name}</span>
                {/* Status badge */}
                {user && completedCount > 0 && (
                  isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Hoàn thành</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{completedCount}/6</span>
                    </span>
                  )
                )}
                {user && isInProgress && (
                  <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-white/5">
        {user ? (
          <div className="space-y-2">
            <button
              onClick={() => nav.setView('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                nav.view === 'profile'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="truncate">{profile?.display_name || 'Hồ sơ'}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-start text-white/40 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => nav.openAuth('login')}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Đăng nhập
          </Button>
        )}
      </div>
    </>
  )
}

// ============================================
// Desktop Sidebar — hidden on mobile
// ============================================
export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 bg-black/50 border-r border-white/5 flex-col h-screen sticky top-0">
      <SidebarNav {...props} />
    </aside>
  )
}

// ============================================
// Mobile Sidebar — Sheet-based hamburger menu
// ============================================
export function MobileSidebar(props: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-40 md:hidden text-white/70 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-black/95 border-white/5">
        {/* Accessible title (visually hidden but present for screen readers) */}
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
        <div className="flex flex-col h-full">
          <SidebarNav {...props} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
