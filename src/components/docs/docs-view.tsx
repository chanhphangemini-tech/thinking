'use client'

import { Button } from '@/components/ui/button'
import { BookOpen, Target, X as XIcon, ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/lib/store'
import { MODULES } from '@/lib/constants/modules'

interface DocsViewProps {
  currentDocs: { title: string; content: string } | null
  onStartQuiz: () => void
}

export function DocsView({ currentDocs, onStartQuiz }: DocsViewProps) {
  const nav = useNavigation()

  if (!currentDocs || !nav.currentModule) return null

  const mod = MODULES[nav.currentModule]

  const handleBack = () => {
    // Close docs and go back to docs list
    nav.closeDocs()
    nav.setSidebarTab('docs')
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#05070a] overflow-hidden">
      {/* Docs Header - sticky */}
      <div className="sticky top-0 z-50 bg-[#05070a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {/* Back Button - Always visible */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className={`border-current ${mod.color} ${mod.accentBg} hover:opacity-80 gap-1 shrink-0`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="w-px h-6 bg-white/20 hidden sm:block" />
            <BookOpen className={`w-5 h-5 shrink-0 hidden sm:block ${mod.color}`} />
            <h2 className="font-semibold text-sm sm:text-lg truncate">{currentDocs.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {nav.currentPhase && (
              <Button
                size="sm"
                onClick={() => {
                  nav.closeDocs()
                  onStartQuiz()
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-xs sm:text-sm"
              >
                <Target className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Làm bài test</span>
                <span className="sm:hidden">Test</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-white/70 hover:text-white">
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Docs Content - scrollable, large text */}
      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12">
          <div
            className="docs-fullpage-content"
            dangerouslySetInnerHTML={{ __html: currentDocs.content }}
          />
        </div>
      </div>
    </div>
  )
}
