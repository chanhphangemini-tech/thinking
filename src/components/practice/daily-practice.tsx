'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Sparkles,
  Send,
  RotateCcw,
  Target,
  CheckCircle2,
  Loader2,
  Calendar,
  Star,
  Briefcase,
  Home,
  User,
} from 'lucide-react'
import type { ModuleSlug } from '@/lib/types'

// ============================================
// Daily Practice Scenarios
// ============================================
const DAILY_SCENARIOS: Record<ModuleSlug, { description: string; context: 'work' | 'daily' | 'personal' }[]> = {
  systema: [
    { description: 'Hôm nay bạn nhận thấy một vấn đề lặp lại trong công việc. Hãy xác định vòng lặp phản hồi nào đang hoạt động và đề xuất cách can thiệp vào cấu trúc thay vì triệu chứng.', context: 'work' },
    { description: 'Khi đọc tin tức về kẹt xe hoặc ô nhiễm, hãy phân tích theo mô hình Tảng Băng Trôi: đâu là sự kiện, mẫu hình, cấu trúc và mental model?', context: 'daily' },
    { description: 'Hãy vẽ một Causal Loop Diagram cho một thói quen cá nhân bạn muốn thay đổi (ví dụ: thức khuya, lười tập thể dục).', context: 'personal' },
    { description: 'Phân tích một quyết định kinh doanh gần đây của công ty bạn theo Stock & Flow. Inflow và Outflow nào đang được tác động?', context: 'work' },
    { description: 'Nhận diện một System Archetype đang hoạt động trong cuộc sống của bạn (Shifting the Burden, Fixes that Fail, etc.).', context: 'personal' },
  ],
  argos: [
    { description: 'Khi nghe một quảng cáo hoặc bài thuyết trình hôm nay, hãy nhận diện ít nhất 3 kỹ thuật thuyết phục (Ethos, Pathos, Logos, Cialdini principles) được sử dụng.', context: 'daily' },
    { description: 'Tìm một lập luận trên mạng xã hội và phân tích: có ngụy biện nào không? Loại ngụy biện gì?', context: 'daily' },
    { description: 'Thực hành PREP Framework: Viết một đoạn ngắn thuyết phục ai đó về một quan điểm của bạn.', context: 'personal' },
    { description: 'Trong cuộc họp tiếp theo, hãy sử dụng Socratic Questioning để hiểu sâu hơn về vấn đề được thảo luận.', context: 'work' },
    { description: 'Phân tích một pitch/deck của startup hoặc sản phẩm: Cấu trúc thông điệp có hiệu quả không? Điểm mạnh/yếu?', context: 'work' },
  ],
  cognos: [
    { description: 'Khi sử dụng ChatGPT hoặc AI tool hôm nay, hãy nhận diện ít nhất 1 trường hợp AI có thể đang "hallucinate" hoặc đưa thông tin sai.', context: 'daily' },
    { description: 'Thiết kế một prompt sử dụng chain-of-thought để giải quyết một bài toán phức tạp trong công việc.', context: 'work' },
    { description: 'Đánh giá output của AI theo framework RICE: Reliability, Importance, Criticality, Efficiency.', context: 'work' },
    { description: 'Nhận diện một trường hợp bạn đang có "Automation Bias" - tin AI quá mức mà không kiểm chứng.', context: 'personal' },
    { description: 'Thiết kế một workflow tích hợp AI vào quy trình làm việc hiện tại của bạn, với các điểm kiểm soát rủi ro.', context: 'work' },
  ],
  ludus: [
    { description: 'Trong một cuộc đàm phán hoặc thương lượng hôm nay, hãy xác định: ai là players? Strategies có thể là gì? Payoff matrix như thế nào?', context: 'work' },
    { description: 'Nhận diện một tình huống Prisoner\'s Dilemma trong cuộc sống thực. Làm sao để đạt được cooperation?', context: 'daily' },
    { description: 'Phân tích một quyết định cạnh tranh của công ty theo Nash Equilibrium: Họ đang ở trạng thái cân bằng nào?', context: 'work' },
    { description: 'Áp dụng lý thuyết đấu giá để phân tích một phiên đấu thầu hoặc thương mại điện tử bạn tham gia.', context: 'daily' },
    { description: 'Trong mối quan hệ cá nhân, hãy xác định đây là one-shot game hay repeated game. Chiến lược tối ưu là gì?', context: 'personal' },
  ],
}

const CONTEXT_ICONS = {
  work: Briefcase,
  daily: Calendar,
  personal: User,
}

const CONTEXT_LABELS = {
  work: 'Công việc',
  daily: 'Đời sống',
  personal: 'Cá nhân',
}

// ============================================
// Interface
// ============================================
interface DailyPracticePromptProps {
  moduleSlug: ModuleSlug
  userId?: string
  onLogged?: () => void
}

interface DailyApplication {
  id: string
  module_slug: ModuleSlug
  application_date: string
  description: string
  context: 'work' | 'daily' | 'personal'
  effectiveness: number
  created_at: string
}

// ============================================
// Local Storage Key
// ============================================
const STORAGE_KEY = 'thinking-ai-daily-applications'

// ============================================
// Main Component
// ============================================
export function DailyPracticePrompt({ moduleSlug, userId, onLogged }: DailyPracticePromptProps) {
  const [scenario, setScenario] = useState<{ description: string; context: 'work' | 'daily' | 'personal' } | null>(null)
  const [response, setResponse] = useState('')
  const [effectiveness, setEffectiveness] = useState(3)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [todayCount, setTodayCount] = useState(0)

  // Load today's count
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const applications: DailyApplication[] = JSON.parse(stored)
      const today = new Date().toISOString().split('T')[0]
      const todayApps = applications.filter(app => app.application_date === today)
      setTodayCount(todayApps.length)
    }
  }, [])

  // Load random scenario
  const loadScenario = () => {
    const scenarios = DAILY_SCENARIOS[moduleSlug]
    const randomIndex = Math.floor(Math.random() * scenarios.length)
    setScenario(scenarios[randomIndex])
    setResponse('')
    setEffectiveness(3)
    setSubmitted(false)
  }

  // Load initial scenario
  useEffect(() => {
    loadScenario()
  }, [moduleSlug])

  // Submit application
  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error('Vui lòng viết phản hồi của bạn!')
      return
    }

    if (response.trim().length < 50) {
      toast.error('Phản hồi quá ngắn! Hãy viết ít nhất 50 ký tự.')
      return
    }

    setLoading(true)

    try {
      const newApplication: DailyApplication = {
        id: `app-${Date.now()}`,
        module_slug: moduleSlug,
        application_date: new Date().toISOString().split('T')[0],
        description: response,
        context: scenario?.context || 'daily',
        effectiveness: effectiveness,
        created_at: new Date().toISOString(),
      }

      // Save to localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      const applications: DailyApplication[] = stored ? JSON.parse(stored) : []
      applications.unshift(newApplication)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications.slice(0, 100))) // Keep last 100

      // If user is logged in, also save to API
      if (userId) {
        try {
          await fetch('/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              moduleSlug,
              type: 'daily_practice',
              content: {
                scenario: scenario?.description,
                response,
                context: scenario?.context,
                effectiveness,
              },
            }),
          })
        } catch {
          // Silent fail - local storage is the primary storage
        }
      }

      setSubmitted(true)
      setTodayCount(prev => prev + 1)
      toast.success('Đã ghi nhận bài thực hành!')

      if (onLogged) {
        onLogged()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  // Get context icon
  const ContextIcon = scenario ? CONTEXT_ICONS[scenario.context] : Calendar

  // ============================================
  // Render
  // ============================================
  return (
    <Card className="border-cyan-500/20 bg-cyan-500/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Daily Practice Challenge
          </CardTitle>
          <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
            {todayCount}/5 hôm nay
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {scenario && !submitted ? (
          <>
            {/* Scenario */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <ContextIcon className="w-4 h-4 text-cyan-400" />
                <Badge variant="outline" className="text-xs border-white/10 text-white/50">
                  {CONTEXT_LABELS[scenario.context]}
                </Badge>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{scenario.description}</p>
            </div>

            {/* Response */}
            <div>
              <label className="text-sm text-white/70 mb-2 block">
                Phản hồi của bạn:
              </label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Viết cách bạn sẽ áp dụng framework/khái niệm vào tình huống này..."
                className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-white/20 resize-y text-sm leading-relaxed focus:border-cyan-500/30"
              />
              <p className="text-xs text-white/30 mt-1">{response.length} ký tự (tối thiểu 50)</p>
            </div>

            {/* Effectiveness Rating */}
            <div>
              <label className="text-sm text-white/70 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Mức độ hiểu/áp dụng: <span className="text-cyan-400">{effectiveness}/5</span>
              </label>
              <Slider
                value={[effectiveness]}
                onValueChange={(val) => setEffectiveness(val[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Cần ôn lại</span>
                <span>Hiểu sâu</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadScenario}
                className="border-white/10 text-white/50 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Đề khác
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || response.trim().length < 50}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ghi nhận
                  </>
                )}
              </Button>
            </div>
          </>
        ) : submitted ? (
          /* Success State */
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">Tuyệt vời!</h3>
            <p className="text-sm text-white/50 mb-4">
              Bạn đã hoàn thành bài thực hành hôm nay.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-400">
              <Star className="w-4 h-4" />
              <span>+10 XP cho streak hàng ngày!</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadScenario}
              className="mt-4 border-white/10 text-white/70 hover:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Làm bài tiếp theo
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DailyPracticePrompt
