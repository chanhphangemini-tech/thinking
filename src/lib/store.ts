import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppView, ModuleSlug } from './types'

interface NavigationState {
  view: AppView
  currentModule: ModuleSlug | null
  currentPhase: number | null
  showAuthModal: boolean
  authMode: 'login' | 'signup'
  showDocs: boolean
  docsPhase: number | null

  setView: (view: AppView) => void
  setModule: (module: ModuleSlug) => void
  setPhase: (phase: number) => void
  startPhase: (phase: number) => void
  openAuth: (mode: 'login' | 'signup') => void
  closeAuth: () => void
  openDocs: (phase: number) => void
  closeDocs: () => void
  goHome: () => void
  goRoadmap: () => void
}

export const useNavigation = create<NavigationState>()(
  persist(
    (set) => ({
      view: 'landing',
      currentModule: null,
      currentPhase: null,
      showAuthModal: false,
      authMode: 'login',
      showDocs: false,
      docsPhase: null,

      setView: (view) => set({ view }),
      // Click module -> show roadmap overview first
      setModule: (module) => set({ currentModule: module, view: 'roadmap', currentPhase: null, showDocs: false, docsPhase: null }),
      setPhase: (phase) => set({ currentPhase: phase }),
      // Click phase in roadmap -> go to learning view
      startPhase: (phase) => set({ currentPhase: phase, view: 'module', showDocs: false, docsPhase: null }),
      openAuth: (mode) => set({ showAuthModal: true, authMode: mode }),
      closeAuth: () => set({ showAuthModal: false }),
      openDocs: (phase) => set({ showDocs: true, docsPhase: phase }),
      closeDocs: () => set({ showDocs: false, docsPhase: null }),
      goHome: () => set({ view: 'landing', currentModule: null, currentPhase: null, showDocs: false, docsPhase: null }),
      goRoadmap: () => set({ view: 'roadmap', currentPhase: null, showDocs: false, docsPhase: null }),
    }),
    {
      name: 'thinking-ai-navigation',
      // Only persist navigation state, not modal states
      partialize: (state) => ({
        view: state.view,
        currentModule: state.currentModule,
        currentPhase: state.currentPhase,
      }),
    }
  )
)
