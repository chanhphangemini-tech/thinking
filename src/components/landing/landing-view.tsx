'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Lock, Zap, Shield, Target, Award } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigation } from '@/lib/store'
import { MODULES } from '@/lib/constants/modules'
import type { ModuleSlug, User } from '@/lib/types'
import { TOTAL_PHASES } from '@/lib/constants/modules'

interface LandingViewProps {
  user: User | null
  progress: Record<ModuleSlug, number[]>
  totalProgress: number
}

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
      {/* Hero */}
      <div className="text-center mb-12 sm:mb-20">
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-6 text-xs sm:text-sm">
          <Zap className="w-3 h-3 mr-1" />
          3 LĨNH VỰC TƯ DUY — 15 GIAI ĐOẠN — 75 BÀI TẬP
        </Badge>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
          Nâng Cấp <span className="text-cyan-400">Tư Duy</span> Của Bạn
        </h1>
        <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Lộ trình 90 ngày với 3 lĩnh vực cốt lõi: Tư Duy Hệ Thống, Phản Biện & Pitching, và Quản Trị AI.
          Được thiết kế cho những ai muốn suy nghĩ sâu hơn và hành động hiệu quả hơn.
        </p>
        {user && (
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/40">
            <span>Đã hoàn thành {totalProgress}/{TOTAL_PHASES} giai đoạn</span>
            <Progress value={(totalProgress / TOTAL_PHASES) * 100} className="w-32 h-2" />
          </div>
        )}
      </div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(MODULES) as [ModuleSlug, typeof MODULES.systema][]).map(([slug, mod]) => (
          <Card
            key={slug}
            className={`group cursor-pointer border ${mod.borderColor} bg-gradient-to-br ${mod.bgGradient} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
            onClick={() => handleModuleClick(slug)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`${mod.color} p-2 rounded-lg ${mod.accentBg}`}>
                  {mod.icon}
                </div>
                {user && progress[slug].length > 0 && (
                  <Badge variant="secondary" className={`${mod.accentBg} ${mod.color} border-0 text-xs`}>
                    {progress[slug].length}/5
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mt-3">{mod.name}</CardTitle>
              <CardDescription className="text-white/60 text-sm">{mod.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{mod.description}</p>
              <div className="space-y-2">
                {mod.phases.map((p) => {
                  const isPassed = progress[slug].includes(p.phase)
                  const isLocked = p.phase > 1 && !progress[slug].includes(p.phase - 1)
                  return (
                    <div key={p.phase} className={`flex items-center gap-2 text-xs ${isLocked ? 'opacity-40' : ''}`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                      )}
                      <span className={isPassed ? 'text-white/70' : isLocked ? 'text-white/20' : 'text-white/30'}>
                        {p.phase}. {p.name}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                <span>Xem lộ trình</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-16 sm:mt-24 grid sm:grid-cols-3 gap-6 text-center">
        {[
          { icon: <Shield className="w-6 h-6" />, title: 'Học có kỷ luật', desc: 'Gate 4/5 để qua mỗi giai đoạn, đảm bảo thực sự hiểu trước khi tiếp tục' },
          { icon: <Target className="w-6 h-6" />, title: 'Thực chiến thực tế', desc: '75 câu hỏi với giải thích chi tiết, xây dựng từ case studies thực tế' },
          { icon: <Award className="w-6 h-6" />, title: 'Theo dõi tiến độ', desc: 'Dashboard cá nhân, journal phản tỉnh, streak tracking và XP system' },
        ].map((f, i) => (
          <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-cyan-400 mx-auto mb-3">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-white/40">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
