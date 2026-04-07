'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug } from '@/lib/types'
import { useNavigation } from '@/lib/store'

interface DocsContent {
  title: string
  content: string
}

const DOCS_READ_KEY = 'thinking-ai-docs-read'

export function useDocs() {
  const nav = useNavigation()
  const [docsContent, setDocsContent] = useState<Record<string, DocsContent>>({})
  const [currentDocs, setCurrentDocs] = useState<DocsContent | null>(null)
  const [docsLoading, setDocsLoading] = useState(false)
  const [readDocs, setReadDocs] = useState<Record<ModuleSlug, Set<number>>>({
    systema: new Set(),
    argos: new Set(),
    cognos: new Set(),
    ludus: new Set()
  })

  // Load read docs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DOCS_READ_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setReadDocs({
          systema: new Set(parsed.systema || []),
          argos: new Set(parsed.argos || []),
          cognos: new Set(parsed.cognos || []),
          ludus: new Set(parsed.ludus || [])
        })
      }
    } catch {
      // Ignore errors
    }
  }, [])

  // Save read docs to localStorage
  const saveReadDocs = useCallback((newReadDocs: Record<ModuleSlug, Set<number>>) => {
    try {
      localStorage.setItem(DOCS_READ_KEY, JSON.stringify({
        systema: Array.from(newReadDocs.systema),
        argos: Array.from(newReadDocs.argos),
        cognos: Array.from(newReadDocs.cognos),
        ludus: Array.from(newReadDocs.ludus)
      }))
    } catch {
      // Ignore errors
    }
  }, [])

  // Load docs content
  const loadDocsContent = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    const key = `${moduleSlug}-${phase}`
    
    // If already cached, use it
    if (docsContent[key]) {
      setCurrentDocs(docsContent[key])
      return
    }

    setDocsLoading(true)
    try {
      const res = await fetch('/docs-content.json')
      if (!res.ok) throw new Error('Failed to load docs')
      const data = await res.json()

      // Cache all docs content
      const allDocs: Record<string, DocsContent> = {}
      for (const modSlug of ['systema', 'argos', 'cognos', 'ludus'] as ModuleSlug[]) {
        const mod = data[modSlug]
        if (mod?.phases) {
          for (const p of mod.phases) {
            allDocs[`${modSlug}-${p.phase}`] = { title: p.title, content: p.content }
          }
        }
      }
      setDocsContent(allDocs)

      const targetDoc = allDocs[key]
      if (targetDoc) {
        setCurrentDocs(targetDoc)
      } else {
        toast.error('Chưa có tài liệu cho giai đoạn này')
      }
    } catch {
      toast.error('Không thể tải tài liệu. Vui lòng thử lại.')
    } finally {
      setDocsLoading(false)
    }
  }, [docsContent])

  // Toggle read/unread status (manual user action)
  const toggleRead = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    setReadDocs(prev => {
      const newSet = new Set(prev[moduleSlug])
      if (newSet.has(phase)) {
        newSet.delete(phase)
      } else {
        newSet.add(phase)
      }
      const newReadDocs = { ...prev, [moduleSlug]: newSet }
      saveReadDocs(newReadDocs)
      return newReadDocs
    })
  }, [saveReadDocs])

  // Mark as read (kept for compatibility)
  const markAsRead = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    setReadDocs(prev => {
      const newSet = new Set(prev[moduleSlug])
      newSet.add(phase)
      const newReadDocs = { ...prev, [moduleSlug]: newSet }
      saveReadDocs(newReadDocs)
      return newReadDocs
    })
  }, [saveReadDocs])

  return {
    currentDocs,
    docsLoading,
    readDocs,
    loadDocsContent,
    markAsRead,
    toggleRead,
  }
}
