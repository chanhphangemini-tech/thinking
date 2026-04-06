import type { ModuleSlug } from '@/lib/types'
import { Brain, Swords, Cpu } from 'lucide-react'

// ============================================
// MODULE DEFINITIONS
// ============================================
export const MODULES: Record<ModuleSlug, {
  name: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  bgGradient: string
  borderColor: string
  accentBg: string
  phases: { phase: number; name: string; title: string }[]
}> = {
  systema: {
    name: 'SYSTEMA',
    subtitle: 'Tư Duy Hệ Thống',
    description: 'Nắm vững Stock & Flow, Feedback Loops, System Archetypes và 12 Đòn Bẩy để hiểu và can thiệp vào bất kỳ hệ thống phức tạp nào.',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-amber-500',
    bgGradient: 'from-amber-950/40 via-stone-950 to-black',
    borderColor: 'border-amber-500/30',
    accentBg: 'bg-amber-500/10',
    phases: [
      { phase: 1, name: 'Tư Duy Phi Tuyến Tính & Phản Hồi', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Cấu Trúc Hệ Thống & Archetypes', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Mô Hình Tâm Trí & Đòn Bẩy', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Thiết Kế Hệ Thống & Dự Phòng', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Tư Duy Hệ Thống Thực Chiến', title: 'Tổng Hợp' },
    ],
  },
  argos: {
    name: 'ARGOS',
    subtitle: 'Tư Duy Phản Biện & Pitching',
    description: 'Phát triển khả năng lập luận sắc bén, nhận diện ngụy biện, và nghệ thuật thuyết phục & pitching để tạo ảnh hưởng trong mọi tình huống.',
    icon: <Swords className="w-8 h-8" />,
    color: 'text-red-500',
    bgGradient: 'from-red-950/30 via-stone-950 to-black',
    borderColor: 'border-red-500/30',
    accentBg: 'bg-red-500/10',
    phases: [
      { phase: 1, name: 'Tâm Lý Học Thuyết Phục & Sự Thật', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Cấu Trúc Lập Luận & Ngụy Biện', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Nghệ Thuật Đặt Câu Hỏi & Lắng Nghe', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Kỹ Thuật Pitching & Storytelling', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Bậc Thầy Thuyết Phục & Phản Biện', title: 'Tổng Hợp' },
    ],
  },
  cognos: {
    name: 'COGNOS',
    subtitle: 'Tư Duy Quản Trị AI',
    description: 'Hiểu bản chất AI, tránh bẫy tư duy, thiết kế prompt hiệu quả, đánh giá rủi ro và xây dựng chiến lược AI governance.',
    icon: <Cpu className="w-8 h-8" />,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-950/30 via-slate-950 to-black',
    borderColor: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    phases: [
      { phase: 1, name: 'Bản Chất AI', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Giới Hạn AI & Bẫy Tư Duy', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Prompt Thinking & Workflow Design', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Đánh Giá Output & Quản Lý Rủi Ro', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Tổng Hợp Tư Duy Quản Trị AI', title: 'Tốt Nghiệp' },
    ],
  },
}

// ============================================
// PHASE DESCRIPTIONS FOR ROADMAP
// ============================================
export const PHASE_DESCRIPTIONS: Record<ModuleSlug, Record<number, string>> = {
  systema: {
    1: 'Hiểu tư duy phi tuyến tính, vòng lặp phản hồi (reinforcing/balancing), và mô hình tảng băng trôi.',
    2: 'Nắm vững Stock & Flow, 8 System Archetypes phổ biến trong kinh doanh và đời sống.',
    3: 'Nhận diện Mental Models, 5 mô hình tư duy cốt lõi, và 12 Đòn Bẩy của Meadows.',
    4: 'Thiết kế hệ thống hiệu quả: 6 nguyên tắc, Resilience vs Antifragility, và dự phòng.',
    5: 'Tổng hợp thực chiến: Framework 5 bước phân tích hệ thống, checklist quyết định hàng ngày.',
  },
  argos: {
    1: 'Hiểu tâm lý thuyết phục: Tam giác Tu từ (Ethos-Pathos-Logos) và 7 nguyên tắc Cialdini.',
    2: 'Phân tích lập luận: Deductive vs Inductive, PREP Framework, và nhận diện 12+ ngụy biện.',
    3: 'Nghệ thuật đặt câu hỏi: Socratic Questioning, kỹ thuật Chris Voss, và Active Listening.',
    4: 'Kỹ năng Pitching: Cấu trúc Hook-Problem-Solution-Evidence-Ask, 3 frameworks Storytelling.',
    5: 'Tổng hợp thực chiến: Thuyết phục trong tình huống phức tạp, xử lý phản đối, và debate.',
  },
  cognos: {
    1: 'Bản chất AI: Lịch sử, loại AI (Narrow/General/AGI), Machine Learning basics, Neural Networks.',
    2: 'Giới hạn AI: Hallucination, Bias, Coral problem, bẫy Automation Bias và Overreliance.',
    3: 'Prompt Thinking: Technique phân tích task, chain-of-thought, role prompting, và workflow design.',
    4: 'Đánh giá output: Framework RICE, đánh giá rủi ro, AI governance, và responsible AI.',
    5: 'Tốt nghiệp: Tổng hợp tư duy quản trị AI, xây dựng AI strategy cho tổ chức.',
  },
}

// ============================================
// APP CONSTANTS
// ============================================
export const TOTAL_PHASES = 15
export const PASS_THRESHOLD = 4 // 4/5 correct to pass
export const QUESTIONS_PER_QUIZ = 5
export const AUTH_STORAGE_KEY = 'thinking-ai-user'
