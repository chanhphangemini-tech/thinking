'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, LogIn, LogOut, Home, User, Flame } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import type { User, UserProfile } from '@/lib/types'

interface HeaderProps {
  user: User | null
  profile: UserProfile | null
  onLogout: () => void
}

export function Header({ user, profile, onLogout }: HeaderProps) {
  const nav = useNavigation()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={nav.goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Brain className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg tracking-tight">
            Thinking<span className="text-cyan-400">AI</span>
          </span>
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
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-white/50 hover:text-red-400">
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
  )
}
