import { create } from 'zustand'
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
  openAuth: (mode: 'login' | 'signup') => void
  closeAuth: () => void
  openDocs: (phase: number) => void
  closeDocs: () => void
  goHome: () => void
}

export const useNavigation = create<NavigationState>((set) => ({
  view: 'landing',
  currentModule: null,
  currentPhase: null,
  showAuthModal: false,
  authMode: 'login',
  showDocs: false,
  docsPhase: null,

  setView: (view) => set({ view }),
  setModule: (module) => set({ currentModule: module, view: 'module', currentPhase: null }),
  setPhase: (phase) => set({ currentPhase: phase }),
  openAuth: (mode) => set({ showAuthModal: true, authMode: mode }),
  closeAuth: () => set({ showAuthModal: false }),
  openDocs: (phase) => set({ showDocs: true, docsPhase: phase }),
  closeDocs: () => set({ showDocs: false, docsPhase: null }),
  goHome: () => set({ view: 'landing', currentModule: null, currentPhase: null, showDocs: false, docsPhase: null }),
}))
