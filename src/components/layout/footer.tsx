'use client'

import { Separator } from '@/components/ui/separator'
import { Brain } from 'lucide-react'

export function Footer() {
  return (
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
  )
}
