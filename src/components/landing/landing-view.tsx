'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, CheckCircle2, Brain, Layers, Target, Sparkles, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigation } from '@/lib/store'
import { MODULES, TOTAL_PHASES } from '@/lib/constants/modules'
import type { ModuleSlug, User } from '@/lib/types'

interface LandingViewProps {
  user: User | null
  progress: Record<ModuleSlug, number[]>
  totalProgress: number
}

const STATS = [
  { icon: Brain, label: '4 Modules', color: 'text-amber-500', accent: 'text-amber-500' },
  { icon: Layers, label: '20 Giai Đoạn', color: 'text-cyan-400', accent: 'text-cyan-400' },
  { icon: Target, label: '160 Bài Tập', color: 'text-purple-400', accent: 'text-purple-400' },
  { icon: Sparkles, label: '100% Miễn Phí', color: 'text-green-400', accent: 'text-green-400' },
]

const FEATURES = [
  {
    emoji: '📚',
    title: 'Tài liệu chuyên sâu',
    description:
      'Nội dung được biên soạn với case studies thực tế tại Việt Nam và Châu Á',
  },
  {
    emoji: '🎯',
    title: 'Thực hành qua bài test',
    description:
      '160 câu hỏi tình huống với giải thích chi tiết cho từng đáp án',
  },
  {
    emoji: '📊',
    title: 'Theo dõi tiến độ',
    description:
      'Dashboard cá nhân theo dõi tiến trình qua từng module và giai đoạn',
  },
  {
    emoji: '🔄',
    title: 'Nhật ký phản tỉnh',
    description:
      'Ghi chép bài học và insight sau mỗi giai đoạn để củng cố kiến thức',
  },
]

export function LandingView({ user, progress, totalProgress }: LandingViewProps) {
  const nav = useNavigation()

  const handleModuleClick = (slug: ModuleSlug) => {
    if (user) {
      nav.setModule(slug)
    } else {
      nav.openAuth('login')
      toast.info('Vui lòng đăng nhập để bắt đầu học')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* ===== Section 1: Hero ===== */}
      <div className="text-center mb-12 sm:mb-16">
        <Badge
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 mb-6 text-xs sm:text-sm"
        >
          🧠 Nền tảng tư duy thế kỷ 21
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
          Thinking<span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-white/60 text-lg sm:text-xl font-medium mb-4 sm:mb-6">
          Nền tảng 4 module tư duy toàn diện
        </p>
        <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Bốn lĩnh vực tư duy cốt lõi — từ Tư Duy Hệ Thống, Phản Biện &amp; Thuyết
          Phục, đến Quản Trị AI và Lý Thuyết Trò Chơi. Mỗi module 5 giai đoạn với
          tài liệu chuyên sâu và bài kiểm tra thực chiến.
        </p>
        {user && (
          <div className="mt-8 max-w-xs mx-auto">
            <p className="text-sm text-white/40 mb-2">
              Tiến độ học tập: {totalProgress}/{TOTAL_PHASES} giai đoạn
            </p>
            <Progress
              value={(totalProgress / TOTAL_PHASES) * 100}
              className="h-2"
            />
          </div>
        )}
      </div>

      {/* ===== Section 2: Stats Bar ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col items-center gap-2"
          >
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-sm font-medium text-white/70">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ===== Section 3: Module Cards (2×2 grid) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 sm:mb-24">
        {(Object.entries(MODULES) as [ModuleSlug, (typeof MODULES)[ModuleSlug]][]).map(
          ([slug, mod]) => {
            const completedCount = progress[slug]?.length ?? 0
            return (
              <Card
                key={slug}
                className={`group cursor-pointer border ${mod.borderColor} bg-gradient-to-br ${mod.bgGradient} hover:scale-[1.01] hover:shadow-[0_0_30px_-10px_var(--glow-color)] transition-all duration-300 overflow-hidden`}
                style={
                  {
                    '--glow-color':
                      slug === 'systema'
                        ? 'rgba(245,158,11,0.25)'
                        : slug === 'argos'
                          ? 'rgba(239,68,68,0.25)'
                          : slug === 'cognos'
                            ? 'rgba(34,211,238,0.25)'
                            : 'rgba(192,132,252,0.25)',
                  } as React.CSSProperties
                }
                onClick={() => handleModuleClick(slug)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`${mod.color} p-2.5 rounded-lg ${mod.accentBg}`}
                    >
                      {mod.icon}
                    </div>
                    {user && completedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className={`${mod.accentBg} ${mod.color} border-0 text-xs`}
                      >
                        {completedCount}/5
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mt-3">{mod.name}</CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    {mod.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                  <div className="space-y-2">
                    {mod.phases.map((p) => {
                      const isPassed = progress[slug]?.includes(p.phase) || false
                      return (
                        <div key={p.phase} className="flex items-center gap-2 text-xs">
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                          )}
                          <span
                            className={
                              isPassed ? 'text-white/70' : 'text-white/30'
                            }
                          >
                            {p.phase}. {p.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/40 group-hover:text-white/70 transition-colors pt-1">
                    <span>Bắt đầu học</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      {/* ===== Section 4: Why ThinkingAI ===== */}
      <div className="mb-16 sm:mb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
          Tại sao <span className="text-cyan-400">ThinkingAI</span>?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{f.emoji}</span>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1">
                    {f.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Section 5: CTA (non-logged-in users only) ===== */}
      {!user && (
        <>
          <Separator className="mb-16 sm:mb-24 bg-white/10" />
          <div className="text-center mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Sẵn sàng nâng cấp tư duy?
            </h2>
            <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Bắt đầu hành trình tư duy toàn diện với 4 module, 20 giai đoạn và 160
              bài tập thực chiến.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => nav.openAuth('signup')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8"
              >
                Bắt đầu học miễn phí
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => nav.openAuth('login')}
                className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white px-8"
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
