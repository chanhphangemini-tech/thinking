'use client'

import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User } from 'lucide-react'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
            <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
            <path d="M6 18a4 4 0 0 1-1.967-.516"/>
            <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
          </svg>
          <span className="font-bold text-lg tracking-tight">
            Thinking<span className="text-cyan-400">AI</span>
          </span>
        </button>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav.setView('profile')} className="text-white/70 hover:text-white">
                <User className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{profile?.display_name || 'Hồ sơ'}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-white/50 hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
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
