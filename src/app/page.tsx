'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug } from '@/lib/types'

// Components
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoadingScreen } from '@/components/layout/loading'
import { LandingView } from '@/components/landing/landing-view'
import { RoadmapView } from '@/components/quiz/roadmap-view'
import { QuizView } from '@/components/quiz/quiz-view'
import { ProfileView } from '@/components/profile/profile-view'
import { AuthModal } from '@/components/auth/auth-modal'
import { DocsView } from '@/components/docs/docs-view'

// Hooks
import { useAuth } from '@/hooks/use-auth'
import { useQuiz } from '@/hooks/use-quiz'
import { useJournal } from '@/hooks/use-journal'
import { useDocs } from '@/hooks/use-docs'
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
    fetchProfile,
  } = useAuth()

  // Progress
  const {
    progress,
    totalProgress,
    updateProgress,
    isPhasePassed,
    isPhaseLocked,
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
    closeDocs,
    hasReadDocs,
    markAsRead,
  } = useDocs()

  // Auth state for form
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authDisplayName, setAuthDisplayName] = useState('')
  const [authLoadingState, setAuthLoadingState] = useState(false)

  // Check if docs read for current phase
  const currentDocsRead = nav.currentModule && nav.currentPhase
    ? hasReadDocs(nav.currentModule, nav.currentPhase)
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
  const onSubmitQuiz = useCallback(async () => {
    await submitQuiz(updateProgress)
  }, [submitQuiz, updateProgress])

  const onStartQuiz = useCallback(async () => {
    if (nav.currentModule && nav.currentPhase) {
      markAsRead(nav.currentModule, nav.currentPhase)
      await startQuiz(nav.currentModule, nav.currentPhase)
    }
  }, [nav.currentModule, nav.currentPhase, startQuiz, markAsRead])

  const onLoadDocs = useCallback(async () => {
    if (nav.currentModule && nav.currentPhase) {
      await loadDocsContent(nav.currentModule, nav.currentPhase)
    }
  }, [nav.currentModule, nav.currentPhase, loadDocsContent])

  const onResetQuiz = useCallback(() => {
    resetQuiz()
  }, [resetQuiz])

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

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header user={user} profile={profile} onLogout={onLogout} />

      <main className="flex-1">
        {/* Landing View */}
        {nav.view === 'landing' && (
          <LandingView
            user={user}
            progress={progress}
            totalProgress={totalProgress}
          />
        )}

        {/* Roadmap View */}
        {nav.view === 'roadmap' && (
          <RoadmapView progress={progress} />
        )}

        {/* Module/Quiz View */}
        {nav.view === 'module' && (
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
            onStartQuiz={onStartQuiz}
            onResetQuiz={onResetQuiz}
            onLoadDocs={onLoadDocs}
          />
        )}

        {/* Profile View */}
        {nav.view === 'profile' && user && (
          <ProfileView
            profile={profile}
            progress={progress}
            totalProgress={totalProgress}
            journalEntries={journalEntries}
            journalTitle={journalTitle}
            journalContent={journalContent}
            journalModule={journalModule}
            onJournalTitleChange={setJournalTitle}
            onJournalContentChange={setJournalContent}
            onJournalModuleChange={setJournalModule}
            onAddJournalEntry={onAddJournalEntry}
          />
        )}
      </main>

      <Footer />

      {/* Docs View */}
      <DocsView
        currentDocs={currentDocs}
        onStartQuiz={onStartQuiz}
      />

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
