'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trophy, Flame, CheckCircle2, PenLine, BookOpen } from 'lucide-react'
import { MODULES, TOTAL_PHASES } from '@/lib/constants/modules'
import type { ModuleSlug, UserProfile } from '@/lib/types'
import { useNavigation } from '@/lib/store'
import { toast } from 'sonner'

interface JournalEntry {
  id: string
  title: string
  content: string
  module_slug?: string
  tags: string[]
  created_at?: string
}

interface ProfileViewProps {
  profile: UserProfile | null
  progress: Record<ModuleSlug, number[]>
  totalProgress: number
  journalEntries: JournalEntry[]
  journalTitle: string
  journalContent: string
  journalModule: ModuleSlug | ''
  onJournalTitleChange: (title: string) => void
  onJournalContentChange: (content: string) => void
  onJournalModuleChange: (module: ModuleSlug | '') => void
  onAddJournalEntry: () => void
}

export function ProfileView({
  profile,
  progress,
  totalProgress,
  journalEntries,
  journalTitle,
  journalContent,
  journalModule,
  onJournalTitleChange,
  onJournalContentChange,
  onJournalModuleChange,
  onAddJournalEntry,
}: ProfileViewProps) {
  const nav = useNavigation()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
      <p className="text-white/40 text-sm mb-8">Theo dõi tiến độ học tập và nhật ký phản tỉnh</p>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Trophy className="w-4 h-4 mr-1.5" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="journal" className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <PenLine className="w-4 h-4 mr-1.5" />
            Nhật ký
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.xp || 0}</p>
                  <p className="text-xs text-white/40">Tổng XP</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.streak || 0}</p>
                  <p className="text-xs text-white/40">Ngày streak</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProgress}/{TOTAL_PHASES}</p>
                  <p className="text-xs text-white/40">Giai đoạn hoàn thành</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-lg">Tiến độ theo module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => {
                const passed = progress[slug].length
                return (
                  <div key={slug}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={mod.color}>{mod.icon}</span>
                        <span className="font-medium">{mod.name}</span>
                        <span className="text-xs text-white/40">{mod.subtitle}</span>
                      </div>
                      <span className="text-sm text-white/40">{passed}/5</span>
                    </div>
                    <Progress value={(passed / 5) * 100} className="h-2 mb-3" />
                    <div className="flex gap-1.5">
                      {mod.phases.map((p) => {
                        const isPassed = progress[slug].includes(p.phase)
                        const isLocked = p.phase > 1 && !progress[slug].includes(p.phase - 1)
                        return (
                          <button
                            key={p.phase}
                            onClick={() => {
                              if (isLocked) {
                                toast.warning('Bạn cần hoàn thành giai đoạn trước trước khi tiếp tục')
                                return
                              }
                              nav.setModule(slug)
                            }}
                            className={`flex-1 h-8 rounded text-xs transition-all ${
                              isLocked
                                ? 'bg-white/[0.01] text-white/15 border border-white/5 cursor-not-allowed opacity-40'
                                : isPassed
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                : 'bg-white/[0.03] text-white/30 border border-white/10 hover:border-white/20'
                            }`}
                          >
                            {isPassed ? '✓' : isLocked ? '🔒' : p.phase}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-lg">Viết nhật ký phản tỉnh</CardTitle>
              <CardDescription className="text-white/40 text-sm">
                Ghi nhận suy nghĩ, bài học và insight sau mỗi buổi học
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Tiêu đề..."
                value={journalTitle}
                onChange={(e) => onJournalTitleChange(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <div className="flex gap-2">
                {(['systema', 'argos', 'cognos'] as ModuleSlug[]).map((slug) => (
                  <button
                    key={slug}
                    onClick={() => onJournalModuleChange(journalModule === slug ? '' : slug)}
                    className={`px-3 py-1.5 rounded text-xs border transition-all ${
                      journalModule === slug
                        ? `${MODULES[slug].color} border-current ${MODULES[slug].accentBg}`
                        : 'border-white/10 text-white/40 hover:border-white/20'
                    }`}
                  >
                    {MODULES[slug].name}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Viết suy nghĩ của bạn tại đây..."
                value={journalContent}
                onChange={(e) => onJournalContentChange(e.target.value)}
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
              />
              <Button
                onClick={onAddJournalEntry}
                disabled={!journalTitle}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
              >
                <PenLine className="w-4 h-4 mr-1" />
                Lưu nhật ký
              </Button>
            </CardContent>
          </Card>

          {/* Journal Entries List */}
          {journalEntries.length > 0 ? (
            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <Card key={entry.id} className="border-white/10 bg-white/[0.03]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{entry.title}</h3>
                          {entry.module_slug && (
                            <Badge variant="outline" className={`${MODULES[entry.module_slug as ModuleSlug]?.color || 'text-white/40'} border-current text-[10px]`}>
                              {MODULES[entry.module_slug as ModuleSlug]?.name || entry.module_slug}
                            </Badge>
                          )}
                        </div>
                        {entry.content && (
                          <p className="text-white/40 text-sm line-clamp-2">{entry.content}</p>
                        )}
                        {entry.created_at && (
                          <p className="text-white/20 text-xs mt-2">
                            {new Date(entry.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Chưa có nhật ký nào. Bắt đầu ghi nhận suy nghĩ của bạn!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
