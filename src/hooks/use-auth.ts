'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { tryGetSupabase } from '@/lib/supabase/client'
import type { User, UserProfile } from '@/lib/types'
import { AUTH_STORAGE_KEY } from '@/lib/constants/modules'

interface SavedUser {
  id: string
  email: string
  displayName: string
  accessToken: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const isAuthInitialized = useRef(false)

  // Local storage helpers
  const saveUserToLocalStorage = useCallback((user: User, accessToken: string) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || '',
        accessToken,
      }))
    } catch {
      // localStorage not available
    }
  }, [])

  const loadUserFromLocalStorage = useCallback((): SavedUser | null => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  const clearUserFromLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // localStorage not available
    }
  }, [])

  // Fetch profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`)
      const { data } = await res.json()
      if (data && !data.fallback) {
        setProfile(data)
      } else if (data?.fallback) {
        setProfile({
          id: userId,
          user_id: userId,
          display_name: data.display_name || 'Người học',
          xp: 0,
          streak: 0,
          longest_streak: 0
        })
      }
    } catch {
      setProfile({
        id: userId,
        user_id: userId,
        display_name: 'Người học',
        xp: 0,
        streak: 0,
        longest_streak: 0
      })
    }
  }, [])

  // Auth handlers
  const handleSignup = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    onSuccess: () => void,
    onSwitchToLogin: () => void
  ) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName }),
      })
      const { error, data, needsConfirmation, message } = await res.json()
      
      if (error) {
        return { success: false, error }
      }
      
      if (needsConfirmation) {
        onSuccess()
        return { success: true, message: message || 'Đăng ký thành công! Kiểm tra email để xác nhận.' }
      }
      
      if (data?.session?.user) {
        setUser(data.session.user)
        saveUserToLocalStorage(data.session.user, data.session.access_token)
        onSuccess()
        await fetchProfile(data.session.user.id)
        return { success: true, message: 'Đăng ký thành công!' }
      }
      
      onSwitchToLogin()
      return { success: true, message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.' }
    } catch {
      return { success: false, error: 'Lỗi kết nối server' }
    }
  }, [saveUserToLocalStorage, fetchProfile])

  const handleLogin = useCallback(async (
    email: string,
    password: string,
    onSuccess: () => void
  ) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const { data, error } = await res.json()
      
      if (error) {
        return { success: false, error }
      }
      
      onSuccess()
      if (data?.session?.user) {
        setUser(data.session.user)
        saveUserToLocalStorage(data.session.user, data.session.access_token)
        await fetchProfile(data.session.user.id)
      }
      return { success: true, message: 'Đăng nhập thành công!' }
    } catch {
      return { success: false, error: 'Lỗi kết nối server' }
    }
  }, [saveUserToLocalStorage, fetchProfile])

  const handleLogout = useCallback(async (onLogout: () => void) => {
    const supabase = tryGetSupabase()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    clearUserFromLocalStorage()
    onLogout()
    return { success: true, message: 'Đã đăng xuất' }
  }, [clearUserFromLocalStorage])

  // Initialize auth
  useEffect(() => {
    // Step 1: Try to restore from localStorage immediately
    const savedUser = loadUserFromLocalStorage()
    if (savedUser) {
      const mockUser = {
        id: savedUser.id,
        email: savedUser.email,
        user_metadata: { display_name: savedUser.displayName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '',
      } as unknown as User
      setUser(mockUser)
      fetchProfile(savedUser.id)
      setLoading(false)
    }

    const supabase = tryGetSupabase()
    if (!supabase) {
      if (!savedUser) setLoading(false)
      return
    }

    // Step 2: Check Supabase session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          saveUserToLocalStorage(session.user, session.access_token)
          await fetchProfile(session.user.id)
        }
      } catch {
        // Auth not available yet
      } finally {
        isAuthInitialized.current = true
        setLoading(false)
      }
    }
    initAuth()

    // Step 3: Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isAuthInitialized.current) return

      if (session?.user) {
        setUser(session.user)
        saveUserToLocalStorage(session.user, session.access_token)
        await fetchProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        clearUserFromLocalStorage()
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUserFromLocalStorage, saveUserToLocalStorage, clearUserFromLocalStorage, fetchProfile])

  return {
    user,
    profile,
    loading,
    handleSignup,
    handleLogin,
    handleLogout,
    fetchProfile,
  }
}
