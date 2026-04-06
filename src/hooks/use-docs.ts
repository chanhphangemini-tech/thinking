'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { ModuleSlug } from '@/lib/types'
import { useNavigation } from '@/lib/store'

interface DocsContent {
  title: string
  content: string
}

export function useDocs() {
  const nav = useNavigation()
  const [docsContent, setDocsContent] = useState<Record<string, DocsContent>>({})
  const [currentDocs, setCurrentDocs] = useState<DocsContent | null>(null)
  const [docsLoading, setDocsLoading] = useState(false)
  const [docsReadPhases, setDocsReadPhases] = useState<Set<string>>(new Set())

  // Load docs content
  const loadDocsContent = useCallback(async (moduleSlug: ModuleSlug, phase: number) => {
    const key = `${moduleSlug}-${phase}`
    
    // If already cached, use it
    if (docsContent[key]) {
      setCurrentDocs(docsContent[key])
      nav.openDocs(phase)
      setDocsReadPhases(prev => new Set(prev).add(key))
      return
    }

    setDocsLoading(true)
    try {
      const res = await fetch('/docs-content.json')
      if (!res.ok) throw new Error('Failed to load docs')
      const data = await res.json()

      // Cache all docs content
      const allDocs: Record<string, DocsContent> = {}
      for (const modSlug of ['systema', 'argos', 'cognos'] as ModuleSlug[]) {
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
        nav.openDocs(phase)
        setDocsReadPhases(prev => new Set(prev).add(key))
      } else {
        toast.error('Chưa có tài liệu cho giai đoạn này')
      }
    } catch {
      toast.error('Không thể tải tài liệu. Vui lòng thử lại.')
    } finally {
      setDocsLoading(false)
    }
  }, [docsContent, nav])

  // Close docs
  const closeDocs = useCallback(() => {
    nav.closeDocs()
  }, [nav])

  // Check if docs read
  const hasReadDocs = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    return docsReadPhases.has(`${moduleSlug}-${phase}`)
  }, [docsReadPhases])

  // Mark as read
  const markAsRead = useCallback((moduleSlug: ModuleSlug, phase: number) => {
    setDocsReadPhases(prev => new Set(prev).add(`${moduleSlug}-${phase}`))
  }, [])

  return {
    currentDocs,
    docsLoading,
    docsReadPhases,
    loadDocsContent,
    closeDocs,
    hasReadDocs,
    markAsRead,
  }
}
