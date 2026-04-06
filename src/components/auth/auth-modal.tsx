'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useNavigation } from '@/lib/store'

interface AuthModalProps {
  authEmail: string
  authPassword: string
  authDisplayName: string
  authLoading: boolean
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onDisplayNameChange: (name: string) => void
  onLogin: () => void
  onSignup: () => void
}

export function AuthModal({
  authEmail,
  authPassword,
  authDisplayName,
  authLoading,
  onEmailChange,
  onPasswordChange,
  onDisplayNameChange,
  onLogin,
  onSignup,
}: AuthModalProps) {
  const nav = useNavigation()

  return (
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
                onChange={(e) => onDisplayNameChange(e.target.value)}
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
              onChange={(e) => onEmailChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Mật khẩu</label>
            <Input
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={authPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <Button
            onClick={nav.authMode === 'login' ? onLogin : onSignup}
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
  )
}
