'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug } from '@/lib/types'

// Layout
import { Sidebar, MobileSidebar } from '@/components/layout/sidebar'
import { LoadingScreen } from '@/components/layout/loading'
import { AuthModal } from '@/components/auth/auth-modal'

// Views
import { LandingView } from '@/components/landing/landing-view'
import { RoadmapView } from '@/components/quiz/roadmap-view'
import { DocsListView } from '@/components/docs/docs-list-view'
import { DocsView } from '@/components/docs/docs-view'
import { QuizListView } from '@/components/quiz/quiz-list-view'
import { QuizView } from '@/components/quiz/quiz-view'
import { ProfileView } from '@/components/profile/profile-view'
import { PracticeView } from '@/components/practice/practice-view'

// Hooks
import { useAuth } from '@/hooks/use-auth'
import { useQuiz } from '@/hooks/use-quiz'
import { useJournal } from '@/hooks/use-journal'
import { useDocs } from '@/hooks/use-docs'
import { useQuizChecklist } from '@/hooks/use-quiz-checklist'
import { useProgress } from '@/hooks/use-progress'
import { useNavigation } from '@/lib/store'

// Main App Component
export default function ThinkingAIApp() {
  const nav = useNavigation()
  
  // Auth
  const {
    user,
    profile,
    loading: authLoading,
    handleLogin: authLogin,
    handleLogout: authLogout,
    handleSignup: authSignup,
  } = useAuth()

  // Progress
  const {
    progress,
    totalProgress,
    updateProgress,
  } = useProgress(user?.id)

  // Quiz
  const {
    quizQuestions,
    quizLoading,
    selectedAnswers,
    quizSubmitted,
    quizScore,
    quizPassed,
    quizResetKey,
    startQuiz,
    submitQuiz,
    resetQuiz,
    selectAnswer,
  } = useQuiz(user?.id)

  // Journal
  const {
    journalEntries,
    journalTitle,
    journalContent,
    journalModule,
    setJournalTitle,
    setJournalContent,
    setJournalModule,
    addJournalEntry,
  } = useJournal(user?.id, nav.view === 'profile')

  // Docs
  const {
    currentDocs,
    docsLoading,
    loadDocsContent,
    readDocs,
    markAsRead,
    toggleRead,
  } = useDocs()

  // Quiz Checklist (manual completion tracking)
  const {
    checklist,
    toggleCompleted,
  } = useQuizChecklist()

  // Auth state for form
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authDisplayName, setAuthDisplayName] = useState('')
  const [authLoadingState, setAuthLoadingState] = useState(false)

  // Current docs read status
  const currentDocsRead = nav.currentModule && nav.currentPhase
    ? readDocs[nav.currentModule]?.has(nav.currentPhase) || false
    : false

  // Auth handlers
  const onLogin = useCallback(async () => {
    if (!authEmail || !authPassword) return
    setAuthLoadingState(true)
    const result = await authLogin(authEmail, authPassword, () => {
      nav.closeAuth()
      setAuthEmail('')
      setAuthPassword('')
    })
    if (result.success) {
      toast.success(result.message || 'Đăng nhập thành công!')
    } else {
      toast.error(result.error || 'Đăng nhập thất bại')
    }
    setAuthLoadingState(false)
  }, [authEmail, authPassword, authLogin, nav])

  const onSignup = useCallback(async () => {
    if (!authEmail || !authPassword) return
    setAuthLoadingState(true)
    const result = await authSignup(authEmail, authPassword, authDisplayName, () => {
      nav.closeAuth()
      setAuthEmail('')
      setAuthPassword('')
      setAuthDisplayName('')
    }, () => nav.openAuth('login'))
    if (result.success) {
      toast.success(result.message || 'Đăng ký thành công!')
    } else {
      toast.error(result.error || 'Đăng ký thất bại')
    }
    setAuthLoadingState(false)
  }, [authEmail, authPassword, authDisplayName, authSignup, nav])

  const onLogout = useCallback(async () => {
    await authLogout(() => nav.goHome())
    toast.success('Đã đăng xuất')
  }, [authLogout, nav])

  // Quiz handlers
  const onStartQuiz = useCallback(async (module?: ModuleSlug, phase?: number) => {
    const targetModule = module || nav.currentModule
    const targetPhase = phase || nav.currentPhase
    if (targetModule && targetPhase) {
      nav.setModule(targetModule)
      nav.setPhase(targetPhase)
      await startQuiz(targetModule, targetPhase)
    }
  }, [nav, startQuiz])

  const onSubmitQuiz = useCallback(async () => {
    await submitQuiz(updateProgress)
  }, [submitQuiz, updateProgress])

  const onResetQuiz = useCallback(() => {
    resetQuiz()
  }, [resetQuiz])

  // Docs handlers
  const onOpenDocs = useCallback(async (module: ModuleSlug, phase: number) => {
    nav.setModule(module)
    nav.setPhase(phase)
    await loadDocsContent(module, phase)
    nav.openDocs(phase)
  }, [nav, loadDocsContent])

  // Journal handler
  const onAddJournalEntry = useCallback(async () => {
    const success = await addJournalEntry()
    if (success) {
      toast.success('Đã lưu nhật ký!')
    }
  }, [addJournalEntry])

  // Loading state
  if (authLoading) {
    return <LoadingScreen />
  }

  // Determine main content
  const renderMainContent = () => {
    // Show Docs View (fullscreen overlay)
    if (nav.showDocs && currentDocs) {
      return (
        <DocsView
          currentDocs={currentDocs}
          onStartQuiz={() => {
            nav.closeDocs()
            startQuiz(nav.currentModule!, nav.currentPhase!)
          }}
        />
      )
    }

    // Show Quiz View (when quiz is active and a module/phase is selected)
    if (quizQuestions.length > 0 && nav.currentModule && nav.currentPhase) {
      return (
        <QuizView
          progress={progress}
          quizQuestions={quizQuestions}
          quizLoading={quizLoading}
          selectedAnswers={selectedAnswers}
          quizSubmitted={quizSubmitted}
          quizScore={quizScore}
          quizPassed={quizPassed}
          quizResetKey={quizResetKey}
          hasReadDocs={currentDocsRead}
          onAnswerSelect={selectAnswer}
          onSubmitQuiz={onSubmitQuiz}
          onStartQuiz={() => startQuiz(nav.currentModule!, nav.currentPhase!)}
          onResetQuiz={onResetQuiz}
          onLoadDocs={() => loadDocsContent(nav.currentModule!, nav.currentPhase!)}
        />
      )
    }

    // Practice view
    if (nav.view === 'practice') {
      return <PracticeView userId={user?.id} />
    }

    // Profile view
    if (nav.view === 'profile') {
      return (
        <ProfileView
          profile={profile}
          progress={progress}
          totalProgress={totalProgress}
          readDocs={readDocs}
          checklist={checklist}
          journalEntries={journalEntries}
          journalTitle={journalTitle}
          journalContent={journalContent}
          journalModule={journalModule}
          onJournalTitleChange={setJournalTitle}
          onJournalContentChange={setJournalContent}
          onJournalModuleChange={setJournalModule}
          onAddJournalEntry={onAddJournalEntry}
          userId={user?.id}
        />
      )
    }

    // Landing view (no module selected)
    if (!nav.currentModule) {
      return (
        <LandingView
          user={user}
          progress={progress}
          totalProgress={totalProgress}
        />
      )
    }

    // Sidebar tab views (when module is selected)
    switch (nav.sidebarTab) {
      case 'roadmap':
        return (
          <RoadmapView
            progress={progress}
            onStartQuiz={(module, phase) => {
              nav.setPhase(phase)
              startQuiz(module, phase)
            }}
            onOpenDocs={onOpenDocs}
          />
        )
      case 'docs':
        return (
          <DocsListView
            onOpenDoc={onOpenDocs}
            readDocs={readDocs}
            onToggleRead={toggleRead}
          />
        )
      case 'quiz':
        return (
          <QuizListView
            onStartQuiz={(module, phase) => {
              nav.setPhase(phase)
              startQuiz(module, phase)
            }}
            progress={progress}
            checklist={checklist}
            onToggleCompleted={toggleCompleted}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar user={user} profile={profile} onLogout={onLogout} />

      {/* Mobile Sidebar */}
      <MobileSidebar user={user} profile={profile} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {renderMainContent()}
      </main>

      {/* Auth Modal */}
      <AuthModal
        authEmail={authEmail}
        authPassword={authPassword}
        authDisplayName={authDisplayName}
        authLoading={authLoadingState}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onDisplayNameChange={setAuthDisplayName}
        onLogin={onLogin}
        onSignup={onSignup}
      />
    </div>
  )
}
