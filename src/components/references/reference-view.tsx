'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Library,
  Globe,
  Flag,
  Brain,
  Swords,
  Cpu,
  Gamepad2,
  Star,
  ChevronDown,
  Search,
} from 'lucide-react'
import { MODULE_BOOKS, getTotalBooks, type Book, type ModuleBooks } from '@/lib/data/reference-books'
import { MODULES } from '@/lib/constants/modules'
import type { ModuleSlug } from '@/lib/types'

// ============================================
// Icons for modules
// ============================================
const MODULE_ICONS: Record<ModuleSlug, React.ReactNode> = {
  systema: <Brain className="w-4 h-4" />,
  argos: <Swords className="w-4 h-4" />,
  cognos: <Cpu className="w-4 h-4" />,
  ludus: <Gamepad2 className="w-4 h-4" />,
}

// ============================================
// Book Card Component
// ============================================
function BookCard({ book, index }: { book: Book; index: number }) {
  return (
    <div className="group flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
      {/* Book Cover Placeholder */}
      <div className={`shrink-0 w-16 h-22 sm:w-20 sm:h-28 rounded-lg bg-gradient-to-br ${book.coverColor} flex flex-col items-center justify-center p-2 shadow-lg`}>
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 mb-1" />
        <span className="text-[7px] sm:text-[8px] text-white/60 text-center leading-tight font-medium">{book.title.split(':').[0].split('(')[0]}</span>
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors leading-snug">
          {book.title}
        </h3>
        <p className="text-xs text-cyan-400/70 mt-0.5">{book.author}</p>

        {book.difficulty && (
          <Badge
            variant="outline"
            className={`mt-1.5 text-[10px] ${
              book.difficulty === 'Cơ bản'
                ? 'border-emerald-500/20 text-emerald-400/70 bg-emerald-500/5'
                : book.difficulty === 'Trung bình'
                  ? 'border-amber-500/20 text-amber-400/70 bg-amber-500/5'
                  : 'border-red-500/20 text-red-400/70 bg-red-500/5'
            }`}
          >
            {book.difficulty}
          </Badge>
        )}

        <p className="text-xs text-white/40 mt-2 leading-relaxed line-clamp-3 sm:line-clamp-4">
          {book.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {book.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/30 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Module Section Component
// ============================================
function ModuleSection({ data, language }: { data: ModuleBooks; language: 'english' | 'vietnamese' }) {
  const [expanded, setExpanded] = useState(true)
  const books = language === 'english' ? data.english : data.vietnamese
  const mod = MODULES[data.module]

  if (books.length === 0) return null

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
      >
        <div className={`p-1.5 rounded-lg ${mod.accentBg}`}>
          <span className={mod.color}>{mod.icon}</span>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${mod.color}`}>{data.moduleName}</span>
            <span className="text-xs text-white/30">{mod.subtitle}</span>
          </div>
          <p className="text-[11px] text-white/30 mt-0.5">{books.length} cuốn sách</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="space-y-2 pl-2">
          {books.map((book, i) => (
            <BookCard key={`${data.module}-${language}-${i}`} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export function ReferenceView() {
  const { english, vietnamese, total } = getTotalBooks()
  const [search, setSearch] = useState('')

  const filteredBooks = search.trim()
    ? MODULE_BOOKS.map((m) => ({
        ...m,
        english: m.english.filter(
          (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()) ||
            b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        ),
        vietnamese: m.vietnamese.filter(
          (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()) ||
            b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        ),
      })).filter((m) => m.english.length > 0 || m.vietnamese.length > 0)
    : MODULE_BOOKS

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/20">
          <Library className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tài liệu tham khảo</h1>
          <p className="text-white/40 text-sm">Sách và tài liệu nghiên cứu thêm theo từng module</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3 mt-4 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Library className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-white/50">Tổng:</span>
          <span className="text-sm font-bold text-white">{total}</span>
          <span className="text-xs text-white/30">cuốn</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-white/50">Tiếng Anh:</span>
          <span className="text-sm font-bold text-white">{english}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Flag className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs text-white/50">Tiếng Việt:</span>
          <span className="text-sm font-bold text-white">{vietnamese}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Tìm sách theo tên, tác giả, hoặc tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      {/* Tabs: English / Vietnamese */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="all" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Library className="w-4 h-4 mr-1.5" />
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="english" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-1.5" />
            Tiếng Anh
            <Badge variant="outline" className="ml-1.5 text-[10px] border-white/10 text-white/40">{english}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vietnamese" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Flag className="w-4 h-4 mr-1.5" />
            Tiếng Việt
            <Badge variant="outline" className="ml-1.5 text-[10px] border-white/10 text-white/40">{vietnamese}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* ALL TAB */}
        <TabsContent value="all" className="space-y-4">
          {filteredBooks.map((m) => (
            <div key={m.module} className="space-y-4">
              {/* English books for this module */}
              {m.english.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Globe className="w-3 h-3 text-blue-400/50" />
                    <span className="text-[11px] text-white/30 uppercase tracking-wider">Tiếng Anh</span>
                    <span className="text-[11px] text-white/20">({m.english.length})</span>
                  </div>
                  {m.english.map((book, i) => (
                    <div key={`en-${i}`} className="mb-2">
                      <BookCard book={book} index={i} />
                    </div>
                  ))}
                </div>
              )}

              {/* Vietnamese books for this module */}
              {m.vietnamese.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 mt-4 px-1">
                    <Flag className="w-3 h-3 text-red-400/50" />
                    <span className="text-[11px] text-white/30 uppercase tracking-wider">Tiếng Việt</span>
                    <span className="text-[11px] text-white/20">({m.vietnamese.length})</span>
                  </div>
                  {m.vietnamese.map((book, i) => (
                    <div key={`vi-${i}`} className="mb-2">
                      <BookCard book={book} index={i} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        {/* ENGLISH TAB */}
        <TabsContent value="english" className="space-y-4">
          {filteredBooks.map((m) => (
            <ModuleSection key={m.module} data={m} language="english" />
          ))}
        </TabsContent>

        {/* VIETNAMESE TAB */}
        <TabsContent value="vietnamese" className="space-y-4">
          {filteredBooks.map((m) => (
            <ModuleSection key={m.module} data={m} language="vietnamese" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
