import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModuleSlug, AppView, SidebarTab } from './types'

interface NavigationState {
  view: AppView
  currentModule: ModuleSlug | null
  currentPhase: number | null
  sidebarTab: SidebarTab
  showDocs: boolean
  showAuthModal: boolean
  authMode: 'login' | 'signup'

  // Actions
  setView: (view: AppView) => void
  setModule: (module: ModuleSlug) => void
  openModuleTab: (module: ModuleSlug, tab: SidebarTab) => void
  setPhase: (phase: number) => void
  setSidebarTab: (tab: SidebarTab) => void
  openDocs: (phase: number) => void
  closeDocs: () => void
  openAuth: (mode: 'login' | 'signup') => void
  closeAuth: () => void
  goHome: () => void
  openPractice: () => void
}

export const useNavigation = create<NavigationState>()(
  persist(
    (set) => ({
      view: 'landing',
      currentModule: null,
      currentPhase: null,
      sidebarTab: 'roadmap',
      showDocs: false,
      showAuthModal: false,
      authMode: 'login',

      setView: (view) => set({ view, ...(view === 'profile' ? { showDocs: false } : {}), ...(view === 'landing' ? { showDocs: false } : {}) }),
      setModule: (module) => set({ currentModule: module, view: 'landing', sidebarTab: 'roadmap' }),
      openModuleTab: (module: ModuleSlug, tab: SidebarTab) => set({ currentModule: module, view: 'landing', sidebarTab: tab, showDocs: false }),
      setPhase: (phase) => set({ currentPhase: phase }),
      setSidebarTab: (tab) => set({ sidebarTab: tab, showDocs: false, view: 'landing' }),
      openDocs: (phase) => set({ showDocs: true, currentPhase: phase }),
      closeDocs: () => set({ showDocs: false }),
      openAuth: (mode) => set({ showAuthModal: true, authMode: mode }),
      closeAuth: () => set({ showAuthModal: false }),
      goHome: () => set({ view: 'landing', currentModule: null, currentPhase: null, showDocs: false, sidebarTab: 'roadmap' }),
      openPractice: () => set({ view: 'practice', currentModule: null, currentPhase: null, showDocs: false, sidebarTab: 'roadmap' }),
    }),
    {
      name: 'thinking-ai-navigation',
      partialize: (state) => ({
        view: state.view,
        currentModule: state.currentModule,
        currentPhase: state.currentPhase,
        sidebarTab: state.sidebarTab,
      }),
    }
  )
)
