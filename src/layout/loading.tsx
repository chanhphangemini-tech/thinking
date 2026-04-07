'use client'

import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
        <p className="text-white/60 text-sm">Đang tải Thinking AI...</p>
      </div>
    </div>
  )
}
