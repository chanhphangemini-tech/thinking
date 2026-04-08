// ============================================
// THINKING AI - Type Definitions (Simplified)
// ============================================

export type ModuleSlug = 'systema' | 'argos' | 'cognos' | 'ludus'

// View types
export type AppView = 'landing' | 'profile' | 'practice'
export type SidebarTab = 'roadmap' | 'docs' | 'quiz'

export interface ModuleInfo {
  slug: ModuleSlug
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  accentBg: string
  bgGradient: string
  totalPhases: number
  estimatedDays: number
  phases: PhaseInfo[]
}

export interface PhaseInfo {
  phase: number
  name: string
  title: string
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

export interface UserProgress {
  module: ModuleSlug
  phases_completed: number[]
  last_activity?: string
}

export interface UserProfile {
  id?: string
  user_id: string
  display_name: string
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

// ============================================
// PRACTICE TYPES
// ============================================
export type PracticeStep = 'select' | 'topic' | 'writing' | 'grading' | 'result'

export interface PracticeResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  criticalWeakness: string
  detailedFeedback: string
  improvedThinking: string
}

// User type from Supabase
export interface User {
  id: string
  email?: string
  user_metadata?: {
    display_name?: string
    full_name?: string
  }
  app_metadata?: Record<string, unknown>
  aud?: string
  created_at?: string
}
