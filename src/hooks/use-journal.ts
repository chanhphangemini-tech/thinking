'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug } from '@/lib/types'

interface JournalEntry {
  id: string
  title: string
  content: string
  module_slug?: string
  tags: string[]
  created_at?: string
}

export function useJournal(userId: string | undefined, isActive: boolean) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalModule, setJournalModule] = useState<ModuleSlug | ''>('')
  const [loading, setLoading] = useState(false)

  // Fetch journal entries
  const fetchJournal = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/journal?userId=${userId}`)
      const { data } = await res.json()
      setJournalEntries(data || [])
    } catch {
      // Journal not available
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Add journal entry
  const addJournalEntry = useCallback(async () => {
    if (!userId || !journalTitle) return false
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: journalTitle,
          content: journalContent,
          moduleSlug: journalModule || null,
          tags: journalModule ? [journalModule] : [],
        }),
      })
      const { data } = await res.json()
      if (data) {
        setJournalEntries(prev => [data, ...prev])
        setJournalTitle('')
        setJournalContent('')
        setJournalModule('')
        toast.success('Đã lưu nhật ký!')
        return true
      }
    } catch {
      toast.error('Không thể lưu nhật ký')
    }
    return false
  }, [userId, journalTitle, journalContent, journalModule])

  // Delete journal entry
  const deleteJournalEntry = useCallback(async (entryId: string) => {
    if (!userId) return false
    try {
      const res = await fetch(`/api/journal?id=${entryId}&userId=${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setJournalEntries(prev => prev.filter(e => e.id !== entryId))
        toast.success('Đã xóa nhật ký')
        return true
      }
    } catch {
      toast.error('Không thể xóa nhật ký')
    }
    return false
  }, [userId])

  // Fetch journal when active
  useEffect(() => {
    if (isActive && userId) {
      fetchJournal()
    }
  }, [isActive, userId, fetchJournal])

  return {
    journalEntries,
    journalTitle,
    journalContent,
    journalModule,
    loading,
    setJournalTitle,
    setJournalContent,
    setJournalModule,
    addJournalEntry,
    deleteJournalEntry,
    fetchJournal,
  }
}
