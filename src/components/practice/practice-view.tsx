'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Swords,
  Brain,
  Cpu,
  Gamepad2,
  Sparkles,
  Send,
  RotateCcw,
  Settings,
  Target,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Zap,
  Shield,
  Eye,
  PenLine,
  Trophy,
} from 'lucide-react'
import type { ModuleSlug, PracticeStep, PracticeResult } from '@/lib/types'
import { MODULES } from '@/lib/constants/modules'

// ============================================
// Module info for selection
// ============================================
const MODULE_OPTIONS: { slug: ModuleSlug; name: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
  { slug: 'systema', name: 'SYSTEMA', subtitle: 'Tư Duy Hệ Thống', icon: <Brain className="w-5 h-5" />, color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
  { slug: 'argos', name: 'ARGOS', subtitle: 'Tư Duy Phản Biện', icon: <Swords className="w-5 h-5" />, color: 'text-red-500 border-red-500/30 bg-red-500/10' },
  { slug: 'cognos', name: 'COGNOS', subtitle: 'Tư Duy Quản Trị AI', icon: <Cpu className="w-5 h-5" />, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { slug: 'ludus', name: 'LUDUS', subtitle: 'Lý Thuyết Trò Chơi', icon: <Gamepad2 className="w-5 h-5" />, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
]

// ============================================
// LocalStorage key for ngrok URL
// ============================================
const NGROK_STORAGE_KEY = 'thinking-ai-practice-ngrok-url'

function getNgrokUrl(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(NGROK_STORAGE_KEY) || ''
}

function setNgrokUrl(url: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(NGROK_STORAGE_KEY, url)
}

// ============================================
// AI communication helper
// ============================================
async function callAI(ngrokUrl: string, messages: { role: string; content: string }[]): Promise<string> {
  console.log('[PRACTICE CLIENT] callAI start', { ngrokUrl, messagesCount: messages.length })

  const res = await fetch('/api/practice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ngrokUrl, messages }),
  })

  console.log('[PRACTICE CLIENT] response', { status: res.status, ok: res.ok, statusText: res.statusText, url: res.url })

  if (!res.ok) {
    let errText = ''
    try {
      const err = await res.json()
      errText = JSON.stringify(err)
      throw new Error(err.error || `HTTP ${res.status}: ${errText}`)
    } catch (parseErr) {
      const fallback = await res.text()
      console.error('[PRACTICE CLIENT] error body fallback:', fallback)
      throw new Error(`HTTP ${res.status}: ${fallback || parseErr}`)
    }
  }

  const data = await res.json()
  console.log('[PRACTICE CLIENT] success', { hasChoices: !!data.choices })
  return data.choices?.[0]?.message?.content || ''
}

// ============================================
// SYSTEM PROMPTS
// ============================================
const SYSTEM_GENERATE_TOPIC = `Bạn là một chuyên gia đào tạo tư duy cấp cao. Nhiệm vụ của bạn là tạo ra một bài tập tự luận THỰC CHIẾN để học viên rèn luyện tư duy.

QUY TẮC QUAN TRỌNG:
- Bài tập phải là tình huống THỰC TẾ trong kinh doanh, quản lý, công nghệ hoặc đời sống.
- Yêu cầu học viên phân tích sâu, không chỉ trả lời bề mặt.
- Bài tập phải yêu cầu học viên ÁP DỤNG các khái niệm/framework từ module được chọn.
- Độ khó: NÂNG CAO — dành cho người đã hoàn thành khóa học.

TRẢ LỜI DỰ KIẾN (JSON):
{
  "topic": "Tiêu đề bài tập",
  "description": "Mô tả chi tiết tình huống (3-5 đoạn văn, có số liệu cụ thể, bối cảnh rõ ràng)",
  "requirements": ["Yêu cầu 1", "Yêu cầu 2", "Yêu cầu 3"],
  "hints": ["Gợi ý 1 về framework/khái niệm nên dùng"],
  "moduleContext": "Các khái niệm từ module nên áp dụng"
}

TRẢ LỜI CHỈ JSON, KHÔNG thêm text khác.`

const SYSTEM_GRADE = `Bạn là một giám khảo GIỎT GAO chấm điểm bài tập tự luận tư duy. Yêu cầu:

1. CHẤM ĐIỂM CỰC GẮT trên thang 10 điểm:
   - 0-3: Yếu — Không hiểu khái niệm cơ bản
   - 4-5: TB — Hiểu nhưng áp dụng sai
   - 6-7: Khá — Áp dụng được nhưng thiếu chiều sâu
   - 8-9: Tốt — Phân tích tốt, có insight
   - 10: Xuất sắc — Sáng tạo, áp dụng xuất sắc

2. Đánh giá TIÊU CHÍ:
   - Chính xác khái niệm (30%)
   - Sâu sắc phân tích (25%)
   - Logic lập luận (25%)
   - Tính thực tiễn (20%)

3. CHỈ RA ĐIỂM YẾU CHÍ MẠNG trong tư duy

TRẢ LỜI DỰ KIẾN (JSON):
{
  "score": 7.5,
  "grade": "Khá",
  "criteria": {
    "concept_accuracy": { "score": 8, "comment": "Nhận xét..." },
    "analytical_depth": { "score": 7, "comment": "Nhận xét..." },
    "logical_reasoning": { "score": 7, "comment": "Nhận xét..." },
    "practicality": { "score": 8, "comment": "Nhận xét..." }
  },
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm yếu 1", "Điểm yếu 2"],
  "criticalWeakness": "Điểm yếu chí mạng nhất — mô tả chi tiết tại sao đây là致命弱点 và hậu quả trong thực tế",
  "detailedFeedback": "Phân tích chi tiết bài làm (3-5 đoạn văn), chỉ ra cụ thể哪儿做得好哪儿做得差",
  "improvedThinking": "Hướng cải thiện cụ thể — 3-5 action items để nâng cao tư duy",
  "recommendedResources": "Gợi ý tài liệu/kinh nghiệm để khắc phục điểm yếu"
}

TRẢ LỜI CHỈ JSON, KHÔNG thêm text khác.`

// ============================================
// MAIN COMPONENT
// ============================================
export function PracticeView() {
  // Ngrok config
  const [ngrokUrl, setNgrokUrlState] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tempUrl, setTempUrl] = useState('')
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Practice state
  const [step, setStep] = useState<PracticeStep>('select')
  const [selectedModules, setSelectedModules] = useState<ModuleSlug[]>([])
  const [topic, setTopic] = useState<{ topic: string; description: string; requirements: string[]; hints: string[]; moduleContext: string } | null>(null)
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PracticeResult | null>(null)
  const [rawResult, setRawResult] = useState<Record<string, unknown> | null>(null)

  // Init ngrok URL from localStorage
  useEffect(() => {
    const saved = getNgrokUrl()
    setNgrokUrlState(saved)
    setTempUrl(saved)
  }, [])

  // Save ngrok URL
  const handleSaveNgrok = () => {
    if (!tempUrl.trim()) {
      toast.error('Vui lòng nhập URL ngrok')
      return
    }
    setNgrokUrl(tempUrl.trim())
    setNgrokUrlState(tempUrl.trim())
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2000)
    toast.success('Đã lưu cấu hình AI model!')
    setSettingsOpen(false)
  }

  // Toggle module selection
  const toggleModule = (slug: ModuleSlug) => {
    setSelectedModules(prev => {
      if (prev.includes(slug)) {
        return prev.filter(m => m !== slug)
      }
      return [...prev, slug]
    })
  }

  // Generate topic
  const handleGenerateTopic = async () => {
    if (!ngrokUrl) {
      toast.error('Vui lòng cấu hình URL ngrok trước!')
      setSettingsOpen(true)
      return
    }
    if (selectedModules.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 module!')
      return
    }

    setLoading(true)
    try {
      const moduleNames = selectedModules.map(m => `${MODULES[m].name} - ${MODULES[m].subtitle}`).join(', ')
      const moduleContext = selectedModules.map(m => {
        const mod = MODULES[m]
        const phases = mod.phases.map(p => `${p.name}`).join('; ')
        return `${mod.name}: ${phases}`
      }).join('\n')

      const userMsg = `Tạo bài tập tự luận thực chiến cho module(s): ${moduleNames}\n\nNội dung module:\n${moduleContext}\n\nYêu cầu bài tập phải kết hợp khái niệm từ TẤT CẢ các module được chọn. Tạo tình huống thực tế phức tạp, có số liệu cụ thể.`

      const response = await callAI(ngrokUrl, [
        { role: 'system', content: SYSTEM_GENERATE_TOPIC },
        { role: 'user', content: userMsg },
      ])

      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('AI không trả về định dạng hợp lệ')
      }

      const parsed = JSON.parse(jsonMatch[0])
      setTopic(parsed)
      setStep('writing')
      toast.success('Đã tạo đề bài!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi tạo đề bài'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Submit essay for grading
  const handleSubmitEssay = async () => {
    if (!ngrokUrl) {
      toast.error('Vui lòng cấu hình URL ngrok!')
      return
    }
    if (!essay.trim()) {
      toast.error('Vui lòng viết bài tập!')
      return
    }
    if (essay.trim().length < 100) {
      toast.error('Bài viết quá ngắn! Hãy phân tích sâu hơn (ít nhất 100 ký tự).')
      return
    }

    setLoading(true)
    setStep('grading')

    try {
      const gradingMsg = `Chấm bài tập tự luận sau:\n\n**Đề bài:** ${topic?.topic}\n\n**Mô tả đề bài:**\n${topic?.description}\n\n**Yêu cầu:**\n${topic?.requirements?.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**Bài làm của học viên:**\n${essay}\n\n**Module áp dụng:** ${selectedModules.map(m => MODULES[m].name).join(', ')}\n\n**Ngữ cảnh module:** ${topic?.moduleContext}\n\nHãy chấm ĐÚNG CÁCH và GẮT GAO. Chỉ ra điểm yếu chí mạng trong tư duy của học viên.`

      const response = await callAI(ngrokUrl, [
        { role: 'system', content: SYSTEM_GRADE },
        { role: 'user', content: gradingMsg },
      ])

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('AI không trả về định dạng hợp lệ khi chấm điểm')
      }

      const parsed = JSON.parse(jsonMatch[0])
      setRawResult(parsed)

      // Map to PracticeResult
      const practiceResult: PracticeResult = {
        score: parsed.score || 0,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        criticalWeakness: parsed.criticalWeakness || '',
        detailedFeedback: parsed.detailedFeedback || '',
        improvedThinking: parsed.improvedThinking || '',
      }
      setResult(practiceResult)
      setStep('result')
      toast.success('Đã chấm xong bài tập!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi chấm bài'
      toast.error(message)
      setStep('writing')
    } finally {
      setLoading(false)
    }
  }

  // Reset practice
  const handleReset = () => {
    setStep('select')
    setSelectedModules([])
    setTopic(null)
    setEssay('')
    setResult(null)
    setRawResult(null)
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400'
    if (score >= 6) return 'text-cyan-400'
    if (score >= 4) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/30'
    if (score >= 6) return 'bg-cyan-500/10 border-cyan-500/30'
    if (score >= 4) return 'bg-amber-500/10 border-amber-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  // ============================================
  // RENDER: Settings Dialog
  // ============================================
  const renderSettingsDialog = () => (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Cấu hình AI Model
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">
              Ngrok URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://xxxx-xx-xx.ngrok-free.app"
              className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
            />
            <p className="text-xs text-white/30 mt-1.5">
              Nhập URL ngrok trỏ tới Ollama/LM Studio đang chạy model Qwen 2.5 7B trên máy bạn.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Shield className="w-3 h-3" />
            <span>URL được lưu trong localStorage — chỉ bạn mới thấy được.</span>
          </div>
          <Button
            onClick={handleSaveNgrok}
            className={`w-full font-medium ${settingsSaved ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-cyan-500 hover:bg-cyan-400'} text-black`}
          >
            {settingsSaved ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Đã lưu!</>
            ) : (
              'Lưu cấu hình'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  // ============================================
  // RENDER: Step - Select Modules
  // ============================================
  const renderSelectStep = () => (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-7 h-7 text-cyan-400" />
              Thực Chiến Tư Duy
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Rèn luyện tư duy thực chiến với AI — chọn module và bắt đầu
            </p>
          </div>
          {renderSettingsDialog()}
        </div>
        <Separator className="bg-white/5" />
      </div>

      {/* Ngrok Status */}
      {!ngrokUrl && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-300 font-medium">Chưa cấu hình AI Model</p>
              <p className="text-xs text-white/40">Bạn cần nhập URL ngrok trỏ tới model Qwen 2.5 7B trên máy.</p>
            </div>
            <Button size="sm" onClick={() => setSettingsOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-black text-xs">
              Cấu hình ngay
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Selection */}
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Chọn Module để thực chiến
            <span className="text-xs text-white/30 font-normal ml-1">(có thể chọn nhiều)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MODULE_OPTIONS.map((mod) => {
            const isSelected = selectedModules.includes(mod.slug)
            return (
              <button
                key={mod.slug}
                onClick={() => toggleModule(mod.slug)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border transition-all text-left ${
                  isSelected
                    ? `${mod.color} border-current`
                    : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                <span className={isSelected ? '' : 'opacity-50'}>
                  {mod.icon}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-sm">{mod.name}</span>
                  <span className="text-xs ml-2 opacity-70">{mod.subtitle}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                )}
              </button>
            )
          })}

          {/* Quick select all */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedModules(['systema', 'argos', 'cognos', 'ludus'])}
              className="text-xs text-white/40 hover:text-cyan-400"
            >
              Chọn tất cả
            </Button>
            <span className="text-white/10">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedModules([])}
              className="text-xs text-white/40 hover:text-red-400"
            >
              Bỏ chọn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleGenerateTopic}
          disabled={loading || selectedModules.length === 0}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-medium px-8 py-3 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tạo đề bài...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Tạo đề bài thực chiến
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // ============================================
  // RENDER: Step - Writing
  // ============================================
  const renderWritingStep = () => (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại chọn module
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <PenLine className="w-6 h-6 text-cyan-400" />
              Bài Tập Tự Luận
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Đọc kỹ đề bài và viết bài phân tích của bạn
            </p>
          </div>
          {renderSettingsDialog()}
        </div>
      </div>

      {/* Topic Card */}
      {topic && (
        <Card className="mb-6 border-cyan-500/20 bg-cyan-500/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {topic.topic}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Tình huống:</h3>
              <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap bg-black/30 rounded-lg p-4 border border-white/5">
                {topic.description}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Yêu cầu:</h3>
              <ul className="space-y-1.5">
                {topic.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Module context hint */}
            {topic.moduleContext && (
              <div className="text-xs text-white/30 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                <Eye className="w-3 h-3 inline mr-1" />
                Khái niệm nên áp dụng: {topic.moduleContext}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Essay Writing Area */}
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PenLine className="w-4 h-4 text-cyan-400" />
            Bài làm của bạn
            <span className="text-xs text-white/30 font-normal ml-auto">
              {essay.length} ký tự
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Viết bài phân tích của bạn tại đây...&#10;&#10;💡 Mẹo:&#10;- Áp dụng các framework/khái niệm đã học&#10;- Phân tích đa chiều, có dẫn chứng cụ thể&#10;- Đưa ra giải pháp khả thi&#10;- Tối thiểu 200 ký tự để được chấm điểm chính xác"
            className="min-h-[300px] bg-black/30 border-white/10 text-white placeholder:text-white/20 resize-y text-sm leading-relaxed focus:border-cyan-500/30"
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (topic?.hints) {
                  const hintsText = topic.hints.map((h, i) => `${i + 1}. ${h}`).join('\n')
                  toast(`Gợi ý:\n${hintsText}`, { duration: 8000 })
                }
              }}
              className="text-xs text-white/30 hover:text-cyan-400"
            >
              Xem gợi ý
            </Button>
            <Button
              onClick={handleSubmitEssay}
              disabled={loading || !essay.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-medium px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang nộp bài...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Nộp bài
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ============================================
  // RENDER: Step - Grading (loading)
  // ============================================
  const renderGradingStep = () => (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/20">
            <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">AI đang chấm bài...</h2>
        <p className="text-white/40 text-sm">
          Đang phân tích bài làm của bạn cực gắt — vui lòng chờ
        </p>
        <div className="flex items-center gap-3 justify-center mt-4 text-xs text-white/20">
          <span>Phân tích khái niệm</span>
          <span>→</span>
          <span>Đánh giá logic</span>
          <span>→</span>
          <span>Chấm điểm</span>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER: Step - Result
  // ============================================
  const renderResultStep = () => {
    if (!result || !rawResult) return null
    const criteria = (rawResult as Record<string, unknown>).criteria as Record<string, { score: number; comment: string }> | undefined

    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-cyan-400" />
                Kết Quả Thực Chiến
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Đánh giá từ AI — thang điểm 10
              </p>
            </div>
            {renderSettingsDialog()}
          </div>
          <Separator className="bg-white/5" />
        </div>

        {/* Score Display */}
        <Card className={`mb-6 border ${getScoreBg(result.score)}`}>
          <CardContent className="p-6 text-center">
            <div className="inline-flex flex-col items-center">
              <div className={`text-6xl font-black ${getScoreColor(result.score)}`}>
                {result.score.toFixed(1)}
              </div>
              <div className="text-sm text-white/50 mt-1">
                {rawResult.grade as string || '—'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Criteria Breakdown */}
        {criteria && (
          <Card className="mb-4 border-white/10 bg-white/[0.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Chi tiết theo tiêu chí
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(criteria).map(([key, val]) => {
                const labels: Record<string, string> = {
                  concept_accuracy: 'Chính xác khái niệm (30%)',
                  analytical_depth: 'Sâu sắc phân tích (25%)',
                  logical_reasoning: 'Logic lập luận (25%)',
                  practicality: 'Tính thực tiễn (20%)',
                }
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-white/70">{labels[key] || key}</p>
                      <p className="text-xs text-white/40 mt-0.5">{val.comment}</p>
                    </div>
                    <Badge variant="outline" className={`${getScoreColor(val.score)} border-current shrink-0`}>
                      {val.score}/10
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Critical Weakness */}
        {result.criticalWeakness && (
          <Card className="mb-4 border-red-500/30 bg-red-500/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                Điểm yếu chí mạng trong tư duy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80 leading-relaxed">
                {result.criticalWeakness}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detailed Feedback */}
        {result.detailedFeedback && (
          <Card className="mb-4 border-white/10 bg-white/[0.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Phân tích chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {result.detailedFeedback}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {result.strengths.length > 0 && (
            <Card className="border-emerald-500/20 bg-emerald-500/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Điểm mạnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-emerald-400 mt-1">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.weaknesses.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/[0.02]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Điểm yếu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-amber-400 mt-1">-</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Improved Thinking */}
        {result.improvedThinking && (
          <Card className="mb-6 border-cyan-500/20 bg-cyan-500/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Hướng cải thiện tư duy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {result.improvedThinking}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white hover:bg-white/5"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm bài mới
          </Button>
          <Button
            onClick={() => {
              setEssay('')
              setStep('writing')
              setResult(null)
              setRawResult(null)
              handleGenerateTopic()
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Đề mới cùng module
          </Button>
        </div>
      </div>
    )
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8">
      {step === 'select' && renderSelectStep()}
      {step === 'writing' && renderWritingStep()}
      {step === 'grading' && renderGradingStep()}
      {step === 'result' && renderResultStep()}
    </div>
  )
}
