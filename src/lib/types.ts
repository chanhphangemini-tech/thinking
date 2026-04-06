// ============================================
// THINKING AI - Type Definitions
// ============================================

export type ModuleSlug = 'systema' | 'argos' | 'cognos'

export interface ModuleInfo {
  slug: ModuleSlug
  name: string
  subtitle: string
  description: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  totalPhases: number
  estimatedDays: number
}

export interface PhaseInfo {
  phase: number
  name: string
  title: string
  passRequirement: string
}

export interface QuizQuestion {
  id?: string
  phase: number
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correct: 'a' | 'b' | 'c' | 'd'
  explanation: string
}

export interface QuizAttempt {
  id?: string
  user_id: string
  module: ModuleSlug
  phase: number
  score: number
  total: number
  passed: boolean
  answers: Record<number, string>
  created_at?: string
}

export interface UserProgress {
  module: ModuleSlug
  phases_passed: number[]
  last_activity?: string
}

export interface UserProfile {
  id?: string
  user_id: string
  display_name: string
  xp: number
  streak: number
  longest_streak: number
  last_login?: string
  created_at?: string
}

export interface JournalEntry {
  id?: string
  user_id: string
  module?: ModuleSlug
  title: string
  content: string
  tags: string[]
  created_at?: string
  updated_at?: string
}

export interface ActivityLog {
  id?: string
  user_id: string
  action: string
  module?: ModuleSlug
  details?: string
  xp_earned: number
  created_at?: string
}

export type AppView = 'landing' | 'roadmap' | 'module' | 'profile'

export interface AppState {
  view: AppView
  currentModule: ModuleSlug | null
  currentPhase: number | null
  showAuthModal: boolean
  authMode: 'login' | 'signup'
  showDocs: boolean
  docsModule: ModuleSlug | null
  docsPhase: number | null
}
