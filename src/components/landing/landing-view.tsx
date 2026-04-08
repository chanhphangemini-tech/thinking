'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowRight, CheckCircle2, Brain, Layers, Target, Sparkles, BookOpen,
  Trophy, Zap, Users, Star, Play, ChevronLeft, ChevronRight, Timer
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigation } from '@/lib/store'
import { MODULES, TOTAL_PHASES } from '@/lib/constants/modules'
import { formatXP } from '@/lib/gamification'
import type { ModuleSlug, User } from '@/lib/types'

interface LandingViewProps {
  user: User | null
  progress: Record<ModuleSlug, number[]>
  totalProgress: number
}

// Floating particles component
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    })),
  [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-500/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Animated gradient background
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// Countdown timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set a "launch date" - next Monday at 8:00 AM
      const now = new Date()
      const nextMonday = new Date(now)
      nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7))
      nextMonday.setHours(8, 0, 0, 0)

      const difference = nextMonday.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center gap-3">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={item.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              key={item.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center"
            >
              <span className="text-lg sm:text-xl font-bold text-white">
                {String(item.value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] text-white/40 mt-1">{item.label}</span>
          </div>
          {index < 3 && <span className="mx-1 text-white/20">:</span>}
        </div>
      ))}
    </div>
  )
}

// Testimonials carousel
const TESTIMONIALS = [
  {
    name: 'Minh Tuấn',
    role: 'Product Manager tại Shopee',
    avatar: 'MT',
    content: 'ThinkingAI đã thay đổi hoàn toàn cách tôi tiếp cận vấn đề. Sau 2 tháng, tôi đã áp dụng tư duy hệ thống vào công việc và được promotion!',
    rating: 5,
  },
  {
    name: 'Thanh Hằng',
    role: 'Startup Founder',
    avatar: 'TH',
    content: 'Module ARGOS giúp tôi pitch được $500K funding. Framework PREP và kỹ thuật thuyết phục thực sự hiệu quả.',
    rating: 5,
  },
  {
    name: 'Hoàng Phúc',
    role: 'Data Scientist',
    avatar: 'HP',
    content: 'COGNOS module giúp tôi hiểu rõ bản chất AI và tránh được nhiều bẫy tư duy. Giờ tôi tự tin hơn trong việc evaluate AI models.',
    rating: 5,
  },
  {
    name: 'Ngọc Lan',
    role: 'Marketing Director',
    avatar: 'NL',
    content: 'Lý thuyết trò chơi từ LUDUS đã giúp tôi thiết kế campaign hiệu quả hơn. Cạnh tranh không còn là zero-sum game!',
    rating: 5,
  },
]

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              {TESTIMONIALS[currentIndex].avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                &ldquo;{TESTIMONIALS[currentIndex].content}&rdquo;
              </p>
              <div>
                <p className="font-medium text-white text-sm">{TESTIMONIALS[currentIndex].name}</p>
                <p className="text-white/40 text-xs">{TESTIMONIALS[currentIndex].role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white/40" />
        </button>
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === currentIndex ? 'bg-cyan-400 w-4' : 'bg-white/20'
              )}
            />
          ))}
        </div>
        <button
          onClick={nextTestimonial}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white/40" />
        </button>
      </div>
    </div>
  )
}

// Skill bars animation
const SKILLS = [
  { name: 'Tư duy hệ thống', level: 95 },
  { name: 'Phản biện sắc sảo', level: 88 },
  { name: 'Quản trị AI', level: 92 },
  { name: 'Chiến lược game theory', level: 85 },
]

function AnimatedSkillBars() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      {SKILLS.map((skill, index) => (
        <div key={skill.name}>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-white/70">{skill.name}</span>
            <span className="text-sm text-cyan-400">{skill.level}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isVisible ? `${skill.level}%` : 0 }}
              transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Social proof stats
const SOCIAL_PROOF = [
  { icon: Users, value: '2,500+', label: 'Người học', color: 'text-cyan-400' },
  { icon: Trophy, value: '15,000+', label: 'Bài học hoàn thành', color: 'text-amber-400' },
  { icon: Star, value: '4.9/5', label: 'Đánh giá trung bình', color: 'text-yellow-400' },
  { icon: Zap, value: '98%', label: 'Tỉ lệ hoàn thành', color: 'text-green-400' },
]

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function LandingView({ user, progress, totalProgress }: LandingViewProps) {
  const nav = useNavigation()
  const [isHoveringCTA, setIsHoveringCTA] = useState(false)

  const handleModuleClick = (slug: ModuleSlug) => {
    if (user) {
      nav.setModule(slug)
    } else {
      nav.openAuth('login')
      toast.info('Vui lòng đăng nhập để bắt đầu học')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedGradient />
      <FloatingParticles />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* ===== Section 1: Hero ===== */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 mb-6 text-xs sm:text-sm bg-cyan-500/5"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Nền tảng tư duy thế kỷ 21 • 100% Miễn phí
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
          >
            Thinking<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg sm:text-xl font-medium mb-2"
          >
            Master 4 Critical Thinking Skills
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Từ Tư Duy Hệ Thống, Phản Biện &amp; Thuyết Phục, đến Quản Trị AI và Lý Thuyết Trò Chơi.
            <br className="hidden sm:block" />
            Mỗi module 5 giai đoạn với tài liệu chuyên sâu và bài kiểm tra thực chiến.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <p className="text-xs text-white/30 mb-3 flex items-center justify-center gap-2">
              <Timer className="w-3.5 h-3.5" />
              Khóa học mới bắt đầu vào thứ Hai tới
            </p>
            <CountdownTimer />
          </motion.div>

          {/* CTA Button */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
            >
              <Button
                onClick={() => nav.openAuth('signup')}
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
                className="relative bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/25 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: isHoveringCTA ? '100%' : '-100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Bắt đầu học miễn phí
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => nav.openAuth('login')}
                className="border-white/20 text-white/70 hover:bg-white/5 hover:text-white px-8"
              >
                Đăng nhập
              </Button>
            </motion.div>
          )}

          {/* User progress */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-sm mx-auto mb-8"
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50">Tiến độ học tập</span>
                  <span className="text-cyan-400 font-medium">{totalProgress}/{TOTAL_PHASES} giai đoạn</span>
                </div>
                <Progress value={(totalProgress / TOTAL_PHASES) * 100} className="h-2" />
              </div>
            </motion.div>
          )}
        </div>

        {/* ===== Section 2: Social Proof ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16"
        >
          {SOCIAL_PROOF.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ===== Section 3: Module Cards ===== */}
        <div className="mb-16 sm:mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl sm:text-2xl font-bold text-center mb-8"
          >
            4 Module Tư Duy Cốt Lõi
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(Object.entries(MODULES) as [ModuleSlug, (typeof MODULES)[ModuleSlug]][]).map(
              ([slug, mod], index) => {
                const completedCount = progress[slug]?.length ?? 0
                const xpReward = completedCount * 100 + (completedCount === 5 ? 500 : 0)

                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Card
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
                          <div className={`${mod.color} p-2.5 rounded-lg ${mod.accentBg}`}>
                            {mod.icon}
                          </div>
                          <div className="flex items-center gap-2">
                            {completedCount > 0 && (
                              <Badge
                                variant="secondary"
                                className={`${mod.accentBg} ${mod.color} border-0 text-xs`}
                              >
                                {completedCount}/5
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-white/10 text-white/50 text-[10px]">
                              +{formatXP(xpReward)} XP
                            </Badge>
                          </div>
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
                          {mod.phases.slice(0, 5).map((p) => {
                            const isPassed = progress[slug]?.includes(p.phase) || false
                            return (
                              <div key={p.phase} className="flex items-center gap-2 text-xs">
                                {isPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />
                                )}
                                <span className={isPassed ? 'text-white/70' : 'text-white/30'}>
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
                  </motion.div>
                )
              }
            )}
          </div>
        </div>

        {/* ===== Section 4: What You'll Master ===== */}
        <div className="mb-16 sm:mb-24">
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Left: Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Bạn sẽ làm chủ được gì?
              </h3>
              <AnimatedSkillBars />
            </motion.div>

            {/* Right: Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Tại sao ThinkingAI?
              </h3>
              <div className="space-y-3">
                {[
                  { emoji: '📚', title: 'Tài liệu chuyên sâu', desc: 'Case studies thực tế tại Việt Nam' },
                  { emoji: '🎯', title: 'Thực hành qua bài test', desc: '160 câu hỏi với giải thích chi tiết' },
                  { emoji: '🎮', title: 'Gamification', desc: 'XP, Level, Achievements để tạo động lực' },
                  { emoji: '📊', title: 'Theo dõi tiến độ', desc: 'Dashboard cá nhân chi tiết' },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-xl">{f.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{f.title}</p>
                      <p className="text-xs text-white/40">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== Section 5: Testimonials ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-16 sm:mb-24"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
            Người học nói gì về <span className="text-cyan-400">ThinkingAI</span>?
          </h2>
          <TestimonialsCarousel />
        </motion.div>

        {/* ===== Section 6: Final CTA ===== */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <Separator className="mb-16 sm:mb-24 bg-white/10" />
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Sẵn sàng nâng cấp tư duy?
              </h2>
              <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Bắt đầu hành trình tư duy toàn diện với 4 module, 20 giai đoạn và 160 bài tập thực chiến.
              </p>
              <Button
                onClick={() => nav.openAuth('signup')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold px-8 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Bắt đầu ngay — Hoàn toàn miễn phí
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-white/30 mt-4">
                Không cần thẻ tín dụng • Học mọi lúc, mọi nơi
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
