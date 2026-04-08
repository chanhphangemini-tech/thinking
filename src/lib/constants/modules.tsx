import type { ModuleSlug } from '@/lib/types'
import { Brain, Swords, Cpu, Gamepad2 } from 'lucide-react'

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
  phases: { phase: number; name: string; title: string; isIntroduction?: boolean }[]
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
      { phase: 0, name: 'Zero to Hero: Giới Thiệu', title: 'Giới Thiệu', isIntroduction: true },
      { phase: 1, name: 'Nền Tảng Tư Duy Hệ Thống', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Nhận Diện & Giải Mã Gốc Rễ', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Mô Hình Hóa & Archetypes', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Điểm Đòn Bẩy & Can Thiệp', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Làm Chủ & Lan Tỏa', title: 'Tổng Hợp' },
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
      { phase: 0, name: 'Zero to Hero: Giới Thiệu', title: 'Giới Thiệu', isIntroduction: true },
      { phase: 1, name: 'Nền Tảng Lập Luận Vững Chắc', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Tư Duy Phản Biện & Định Kiến', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Cấu Trúc Thông Điệp & Storytelling', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Thực Chiến & Kiểm Soát Đối Thoại', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Làm Chủ (Mastery) & Tích Hợp', title: 'Tổng Hợp' },
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
      { phase: 0, name: 'Zero to Hero: Giới Thiệu', title: 'Giới Thiệu', isIntroduction: true },
      { phase: 1, name: 'Bản Chất LLM & Tư Duy Dự Đoán', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Bẫy Tư Duy & Sự Hoài Nghi', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Quy Trình & Prompt Tư Duy', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Quản Trị Rủi Ro & Thẩm Định', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Làm Chủ Tư Duy & Tích Hợp', title: 'Tổng Hợp' },
    ],
  },
  ludus: {
    name: 'LUDUS',
    subtitle: 'Lý Thuyết Trò Chơi',
    description: 'Nắm vững Nash Equilibrium, Prisoner\'s Dilemma, cơ chế thiết kế, đấu giá và ứng dụng Game Theory vào kinh doanh, chính trị và đời sống.',
    icon: <Gamepad2 className="w-8 h-8" />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-950/30 via-slate-950 to-black',
    borderColor: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
    phases: [
      { phase: 0, name: 'Zero to Hero: Giới Thiệu', title: 'Giới Thiệu', isIntroduction: true },
      { phase: 1, name: 'Nền Tảng Lý Thuyết Trò Chơi', title: 'Giai Đoạn 1' },
      { phase: 2, name: 'Cân Bằng Nash & Các Trò Chơi Kinh Điển', title: 'Giai Đoạn 2' },
      { phase: 3, name: 'Trò Chơi Lặp & Chiến Lược Động', title: 'Giai Đoạn 3' },
      { phase: 4, name: 'Ứng Dụng Thực Chiến Lý Thuyết Trò Chơi', title: 'Giai Đoạn 4' },
      { phase: 5, name: 'Lý Thuyết Trò Chơi Nâng Cao & Tích Hợp', title: 'Tổng Hợp' },
    ],
  },
}

// ============================================
// PHASE DESCRIPTIONS FOR ROADMAP
// ============================================
export const PHASE_DESCRIPTIONS: Record<ModuleSlug, Record<number, string>> = {
  systema: {
    0: 'Chào mừng bạn đến với hành trình Zero to Hero! Đây là điểm khởi đầu cho người chưa có kiến thức về tư duy hệ thống.',
    1: 'Hiểu tư duy phi tuyến tính, vòng lặp phản hồi (reinforcing/balancing), và mô hình tảng băng trôi.',
    2: 'Nắm vững Stock & Flow, 8 System Archetypes phổ biến trong kinh doanh và đời sống.',
    3: 'Nhận diện Mental Models, 5 mô hình tư duy cốt lõi, và 12 Đòn Bẩy của Meadows.',
    4: 'Thiết kế hệ thống hiệu quả: 6 nguyên tắc, Resilience vs Antifragility, và dự phòng.',
    5: 'Tổng hợp thực chiến: Framework 5 bước phân tích hệ thống, checklist quyết định hàng ngày.',
  },
  argos: {
    0: 'Chào mừng bạn đến với hành trình Zero to Hero! Đây là điểm khởi đầu cho người chưa có kiến thức về tư duy phản biện.',
    1: 'Hiểu tâm lý thuyết phục: Tam giác Tu từ (Ethos-Pathos-Logos) và 7 nguyên tắc Cialdini.',
    2: 'Phân tích lập luận: Deductive vs Inductive, PREP Framework, và nhận diện 12+ ngụy biện.',
    3: 'Nghệ thuật đặt câu hỏi: Socratic Questioning, kỹ thuật Chris Voss, và Active Listening.',
    4: 'Kỹ năng Pitching: Cấu trúc Hook-Problem-Solution-Evidence-Ask, 3 frameworks Storytelling.',
    5: 'Tổng hợp thực chiến: Thuyết phục trong tình huống phức tạp, xử lý phản đối, và debate.',
  },
  cognos: {
    0: 'Chào mừng bạn đến với hành trình Zero to Hero! Đây là điểm khởi đầu cho người chưa có kiến thức về tư duy quản trị AI.',
    1: 'Bản chất AI: Lịch sử, loại AI (Narrow/General/AGI), Machine Learning basics, Neural Networks.',
    2: 'Giới hạn AI: Hallucination, Bias, Coral problem, bẫy Automation Bias và Overreliance.',
    3: 'Prompt Thinking: Technique phân tích task, chain-of-thought, role prompting, và workflow design.',
    4: 'Đánh giá output: Framework RICE, đánh giá rủi ro, AI governance, và responsible AI.',
    5: 'Tốt nghiệp: Tổng hợp tư duy quản trị AI, xây dựng AI strategy cho tổ chức.',
  },
  ludus: {
    0: 'Chào mừng bạn đến với hành trình Zero to Hero! Đây là điểm khởi đầu cho người chưa có kiến thức về lý thuyết trò chơi.',
    1: 'Khái niệm cơ bản: Người chơi, Chiến lược, Payoff. Phân loại trò chơi và cách biểu diễn bằng Normal Form & Extensive Form.',
    2: 'Chiến lược thống trị, Nash Equilibrium, và các trò chơi kinh điển: Prisoner\'s Dilemma, Battle of the Sexes, Stag Hunt, Chicken Game.',
    3: 'Iterated Prisoner\'s Dilemma, giải đấu Axelrod, chiến lược Tit for Tat, Grim Trigger, Pavlov, và Định lý Folk.',
    4: 'Ứng dụng thực chiến: Oligopoly, Lý thuyết đấu giá, Mechanism Design, Lý thuyết bầu cử & Arrow\'s Impossibility Theorem.',
    5: 'Tổng hợp nâng cao: Bayesian Games, Evolutionary Game Theory, Behavioral Game Theory, và kết nối với các module khác.',
  },
}

// ============================================
// APP CONSTANTS
// ============================================
export const TOTAL_PHASES = 20
export const PASS_THRESHOLD = 6 // 6/8 correct to pass
export const QUESTIONS_PER_QUIZ = 8
export const AUTH_STORAGE_KEY = 'thinking-ai-user'
