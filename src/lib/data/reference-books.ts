import type { ModuleSlug } from '@/lib/types'

// ============================================
// BOOK DATA — Organized by Module and Language
// ============================================

export interface Book {
  title: string
  author: string
  description: string
  coverColor: string
  tags: string[]
  difficulty?: 'Cơ bản' | 'Trung bình' | 'Nâng cao'
}

export interface ModuleBooks {
  module: ModuleSlug
  moduleName: string
  english: Book[]
  vietnamese: Book[]
}

// ============================================
// SYSTEMA — Tư Duy Hệ Thống
// ============================================
const systemaEnglish: Book[] = [
  {
    title: 'Thinking in Systems: A Primer',
    author: 'Donella H. Meadows',
    description: 'Cuốn sách kinh điển giới thiệu tư duy hệ thống cho mọi người. Meadows giải thích các khái niệm cốt lõi như stock & flow, feedback loops, system archetypes và 12 đòn bẩy để can thiệp hệ thống. Được viết bằng ngôn ngữ dễ hiểu, đây là điểm khởi đầu hoàn hảo cho ai muốn hiểu cách thế giới vận hành.',
    coverColor: 'from-amber-600 to-orange-800',
    tags: ['Kinh điển', 'Cơ bản', 'Stock & Flow', 'Feedback Loops'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'The Fifth Discipline: The Art & Practice of the Learning Organization',
    author: 'Peter M. Senge',
    description: 'Peter Senge giới thiệu 5 kỷ luật của tổ chức học tập, trong đó nổi bật nhất là "Tư duy hệ thống" (Systems Thinking). Cuốn sách kết nối tư duy hệ thống với quản lý tổ chức, giúp lãnh đạo hiểu cách các bộ phận tương tác và cách tạo ra tổ chức liên tục học hỏi.',
    coverColor: 'from-blue-700 to-indigo-900',
    tags: ['Kinh điển', 'Tổ chức', 'Leadership'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Systemantics: How Systems Work and Especially How They Fail',
    author: 'John Gall',
    description: 'Một cuốn sách hài hước nhưng sâu sắc về cách các hệ thống thực sự hoạt động — và tại sao chúng thường thất bại. Gall trình bày các "luật Gall" nổi tiếng, giúp bạn nhận diện các mẫu hình thất bại và hiểu tại sao giải pháp đơn giản thường hiệu quả hơn.',
    coverColor: 'from-red-700 to-rose-900',
    tags: ['Hài hước', 'Thất bại hệ thống', 'Practical'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Limits to Growth: The 30-Year Update',
    author: 'Donella H. Meadows, Dennis Meadows, Jorgen Randers',
    description: 'Bản cập nhật 30 năm của báo cáo nổi tiếng cho Câu lạc bộ Rome. Sử dụng mô hình hệ thống (system dynamics), cuốn sách phân tích tác động của tăng trưởng kinh tế và dân số lên Trái Đất. Minh chứng mạnh mẽ cho sức mạnh tư duy hệ thống trong phân tích chính sách.',
    coverColor: 'from-green-700 to-emerald-900',
    tags: ['Mô hình', 'Toàn cầu', 'Bền vững'],
    difficulty: 'Nâng cao',
  },
  {
    title: 'The Model Thinker: What You Need to Know to Make Data Work for You',
    author: 'Scott E. Page',
    description: 'Page trình bày 24 mô hình tư duy khác nhau — từ mô hình tuyến tính đến network models, Markov processes, và game theory. Giúp bạn hiểu khi nào nên dùng mô hình nào và cách kết hợp nhiều mô hình để ra quyết định tốt hơn trong điều kiện không chắc chắn.',
    coverColor: 'from-purple-700 to-violet-900',
    tags: ['Mô hình', 'Quyết định', 'Đa mô hình'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Complexity: A Guided Tour',
    author: 'Melanie Mitchell',
    description: 'Mitchell dẫn dắt qua thế giới khoa học phức tạp — hệ sinh thái, não bộ, kinh tế, Internet. Giải thích các khái niệm emergence, self-organization, power laws, network science bằng cách dễ tiếp cận, giúp hiểu tại sao thế giới không hoạt động theo cách tuyến tính.',
    coverColor: 'from-teal-600 to-cyan-800',
    tags: ['Phức tạp', 'Emergence', 'Network Science'],
    difficulty: 'Trung bình',
  },
]

const systemaVietnamese: Book[] = [
  {
    title: 'Điều Chỉnh Tư Duy',
    author: 'Shane Parrish',
    description: 'Dịch giả Nguyễn Cảnh Bình. Tổng hợp các "mental model" quan trọng nhất từ nhiều lĩnh vực: toán học, vật lý, kinh tế, tâm lý. Parrish — người sáng lập Farnam Street — giúp bạn xây dựng bộ công cụ tư duy đa ngành để giải quyết vấn đề hiệu quả hơn. Rất phù hợp với module SYSTEMA.',
    coverColor: 'from-sky-600 to-blue-800',
    tags: ['Mental Model', 'Đa ngành', 'Quyết định'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Tư Duy Nhanh và Chậm',
    author: 'Daniel Kahneman',
    description: 'Dịch giả: Nguyễn Cảnh Bình. Nobel laureate Kahneman trình bày 2 hệ thống tư duy: nhanh/trực giác và chậm/logic. Giúp hiểu các thiên kiến nhận thức (cognitive biases), anchoring, loss aversion — yếu tố quan trọng khi phân tích hệ thống và ra quyết định.',
    coverColor: 'from-orange-600 to-red-800',
    tags: ['Kinh điển', 'Thiên kiến', 'Nobel'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Sự Liệu Hòa Của Tư Duy',
    author: 'Stephen R. Covey',
    description: 'Dịch giả: Nguyễn Cảnh Bình. "7 Thói quen" — đặc biệt Habit 1 (Be Proactive) và Habit 2 (Begin with the End in Mind) mang đậm tư duy hệ thống. Covey giúp bạn nhìn nhận vấn đề toàn diện thay vì phản ứng theo phần tử rời rạc.',
    coverColor: 'from-emerald-600 to-green-800',
    tags: ['Phát triển cá nhân', '7 Thói quen'],
    difficulty: 'Cơ bản',
  },
]

// ============================================
// ARGOS — Tư Duy Phản Biện & Pitching
// ============================================
const argosEnglish: Book[] = [
  {
    title: 'The Art of Thinking Clearly',
    author: 'Rolf Dobelli',
    description: 'Dobelli tổng hợp 99 lỗi tư duy phổ biến nhất — confirmation bias, sunk cost fallacy, survivorship bias. Mỗi chương ngắn (2-3 trang), rõ ràng: lỗi sai, ví dụ thực tế, cách tránh. "Cẩm nang" thiết yếu cho ai muốn rèn luyện tư duy phản biện.',
    coverColor: 'from-red-600 to-rose-800',
    tags: ['Thiên kiến', '99 Lỗi tư duy'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert B. Cialdini',
    description: 'Nền tảng về tâm lý thuyết phục. Cialdini nghiên cứu 6 nguyên tắc: Reciprocity, Commitment & Consistency, Social Proof, Authority, Liking, Scarcity. Mỗi nguyên tắc được minh chứng bằng nhiều thí nghiệm tâm lý học, giúp hiểu tại sao mình dễ bị thuyết phục.',
    coverColor: 'from-indigo-600 to-purple-800',
    tags: ['Kinh điển', 'Thuyết phục', '6 Nguyên tắc'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Thank You for Arguing',
    author: 'Jay Heinrichs',
    description: 'Biến nghệ thuật hùng biện (rhetoric) thành kỹ năng thực tế. Từ Aristotle đến Lincoln, từ chiến dịch chính trị đến The Simpsons — dạy cách tranh luận hiệu quả, sử dụng logos, ethos, pathos trong mọi tình huống giao tiếp.',
    coverColor: 'from-amber-600 to-yellow-800',
    tags: ['Hùng biện', 'Aristotle'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Pitch Anything: An Innovative Method for Presenting, Persuading, and Winning the Deal',
    author: 'Oren Klaff',
    description: 'Klaff kết hợp neuroscience với kinh nghiệm thực tế tạo phương pháp "STRONG" pitching. Dạy cách tạo frame control, thiết kế pitch narrative, sử dụng tension/interest. Đặc biệt phù hợp cho ai cần pitch ý tưởng, xin đầu tư.',
    coverColor: 'from-violet-600 to-fuchsia-800',
    tags: ['Pitching', 'Frame Control', 'Neuroscience'],
    difficulty: 'Trung bình',
  },
  {
    title: 'The Pyramid Principle: Logic in Writing and Thinking',
    author: 'Barbara Minto',
    description: 'Minto — cựu consultant McKinsey — phát triển phương pháp tư duy kim tự tháp: kết luận trước, luận điểm hỗ trợ sau. Giúp cấu trúc lập luận, viết báo cáo, trình bày ý tưởng logic. Nền tảng cho PREP Framework.',
    coverColor: 'from-stone-600 to-zinc-800',
    tags: ['McKinsey', 'Logic', 'Cấu trúc'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Never Split the Difference: Negotiating As If Your Life Depended On It',
    author: 'Chris Voss',
    description: 'Cựu đàm phán viên FBI Chris Voss chia sẻ kỹ thuật đàm phán thực chiến: tactical empathy, labeling, mirroring, calibrated questions. Các kỹ năng này là nền tảng cho phần "Nghệ thuật đặt câu hỏi" trong module ARGOS.',
    coverColor: 'from-slate-600 to-gray-800',
    tags: ['Đàm phán', 'FBI', 'Empathy', 'Thực chiến'],
    difficulty: 'Cơ bản',
  },
]

const argosVietnamese: Book[] = [
  {
    title: 'Nghệ Thuật Tư Duy Rành Mạch',
    author: 'Rolf Dobelli',
    description: 'Bản dịch tiếng Việt của "The Art of Thinking Clearly". Dịch giả: Hải Âu. 99 chương ngắn giúp bạn dễ đọc mỗi ngày một chút và dần xây dựng thói quen tư duy phản biện.',
    coverColor: 'from-pink-600 to-rose-800',
    tags: ['Thiên kiến', 'Dịch'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Tâm Lý Học Trò Chơi (Influence)',
    author: 'Robert B. Cialdini',
    description: 'Bản dịch tiếng Việt. Dịch giả: Nguyễn Văn Cường. 6 nguyên tắc thuyết phục được trình bày bằng ngôn ngữ gần gũi, ví dụ trong bối cảnh Việt Nam.',
    coverColor: 'from-blue-600 to-indigo-800',
    tags: ['Thuyết phục', 'Dịch'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    description: 'Sách kinh điển về giao tiếp và thuyết phục từ 1936. Các nguyên tắc về gây ấn tượng, thuyết phục, xử lý xung đột vẫn cực kỳ giá trị. Nhiều kỹ năng ARGOS (active listening, labeling, empathy) có nguồn gốc từ đây.',
    coverColor: 'from-yellow-600 to-amber-800',
    tags: ['Kinh điển', 'Giao tiếp'],
    difficulty: 'Cơ bản',
  },
]

// ============================================
// COGNOS — Tư Duy Quản Trị AI
// ============================================
const cognosEnglish: Book[] = [
  {
    title: 'Artificial Intelligence: A Guide for Thinking Humans',
    author: 'Melanie Mitchell',
    description: 'Mitchell — chuyên gia AI — viết cho người không chuyên kỹ thuật. Giải thích cách AI thực sự hoạt động, giới hạn hiện tại, tại sao AI chưa thể thay thế con người. Phù hợp cho phần Hiểu bản chất AI trong module COGNOS.',
    coverColor: 'from-cyan-600 to-blue-800',
    tags: ['AI cơ bản', 'Không chuyên'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'AI Superpowers: China, Silicon Valley, and the New World Order',
    author: 'Kai-Fu Lee',
    description: 'Cựu CEO Google China phân tích cuộc đua AI Mỹ-Trung, dự đoán tác động lên thị trường lao động. Giúp hiểu bức tranh toàn cầu, phân biệt AI narrow vs general.',
    coverColor: 'from-red-600 to-orange-800',
    tags: ['AI toàn cầu', 'Kinh tế'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'The Alignment Problem: Machine Learning and Human Values',
    author: 'Brian Christian',
    description: 'Khám phá "vấn đề alignment" — đảm bảo AI hành động theo giá trị con người. Từ bias, RLHF, đến thách thức đạo đức khi triển khai AI. Chủ đề cốt lõi của AI governance trong module COGNOS.',
    coverColor: 'from-emerald-600 to-teal-800',
    tags: ['AI Ethics', 'Alignment', 'RLHF'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Co-Intelligence: Living and Working with AI',
    author: 'Ethan Mollick',
    description: 'Giáo sư Wharton chia sẻ kinh nghiệm thực tế làm việc cùng AI. Tập trung prompt engineering, AI workflow design, cách tương tác: không quá phụ thuộc, cũng không quá hoài nghi. Rất phù hợp với phần Prompt Thinking.',
    coverColor: 'from-purple-600 to-violet-800',
    tags: ['Prompt Engineering', 'Workflow', 'GPT'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Weapons of Math Destruction',
    author: "Cathy O'Neil",
    description: "Cựu quant Wall Street bóc trần cách algorithm gây hại: discriminative lending, biased hiring. Cảnh báo về việc tin tưởng mù quáng AI và dữ liệu. Phù hợp với phần Giới hạn AI & Bẫy tư duy.",
    coverColor: 'from-gray-600 to-slate-800',
    tags: ['AI Risk', 'Bias', 'Bất bình đẳng'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Human Compatible: Artificial Intelligence and the Problem of Control',
    author: 'Stuart Russell',
    description: 'Đồng tác giả textbook AI nổi tiếng nhất (AIMA) trình bày cách xây dựng AI an toàn: thay vì tối ưu objective function, AI nên "thuộc về" con người. Phù hợp cho ai muốn hiểu sâu về AI alignment và governance.',
    coverColor: 'from-sky-600 to-indigo-800',
    tags: ['AI Safety', 'Alignment', 'Nâng cao'],
    difficulty: 'Nâng cao',
  },
]

const cognosVietnamese: Book[] = [
  {
    title: 'Tuổi Trẻ Nghiện AI, Phụ Huynh Khủng Hoảng',
    author: 'Nhiều tác giả',
    description: 'Tập hợp góc nhìn về AI trong giáo dục và gia đình tại Việt Nam. Giúp phụ huynh và giáo viên hiểu cách AI ảnh hưởng trẻ em, hướng dẫn sử dụng AI có trách nhiệm.',
    coverColor: 'from-orange-500 to-red-700',
    tags: ['AI giáo dục', 'Việt Nam'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Tư Duy Nhanh và Chậm',
    author: 'Daniel Kahneman',
    description: 'Bản dịch tiếng Việt. Phần System 1 vs System 2 là nền tảng quan trọng để hiểu tại sao con người dễ bị AI "dắt mũi" — automation bias, overreliance. Kết nối hoàn hảo với Bẫy Tư Duy AI.',
    coverColor: 'from-red-500 to-pink-700',
    tags: ['Thiên kiến', 'Nobel'],
    difficulty: 'Trung bình',
  },
]

// ============================================
// LUDUS — Lý Thuyết Trò Chơi
// ============================================
const ludusEnglish: Book[] = [
  {
    title: "The Art of Strategy: A Game Theorist's Guide to Success",
    author: 'Avinash K. Dixit & Barry J. Nalebuff',
    description: "Hai giáo sư Princeton và Yale biến game theory thành công cụ thực tế. Từ Prisoner's Dilemma đến auctions, bargaining, signaling — mỗi khái niệm minh họa bằng ví dụ kinh doanh và đời sống. Bản \"companion\" hoàn hảo cho module LUDUS.",
    coverColor: 'from-purple-600 to-indigo-800',
    tags: ['Kinh điển', 'Practical', 'Kinh doanh'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Game Theory: An Introduction',
    author: 'Steven Tadelis',
    description: 'Textbook game theory xuất sắc cho người có nền tảng toán. Trình bày từ normal/extensive form, Nash equilibrium, đến Bayesian games, mechanism design. Nhiều bài tập và giải thích từng bước.',
    coverColor: 'from-blue-700 to-cyan-900',
    tags: ['Textbook', 'Toán học', 'Exercises'],
    difficulty: 'Trung bình',
  },
  {
    title: 'The Evolution of Cooperation',
    author: 'Robert Axelrod',
    description: 'Mô tả giải đấu computer tournament, nơi "Tit for Tat" — chiến lược đơn giản nhất — chiến thắng. Giải thích tại sao hợp tác emerge ngay cả trong môi trường không tin tưởng. Nền tảng cho Iterated Games.',
    coverColor: 'from-green-600 to-emerald-800',
    tags: ['Iterated PD', 'Tit for Tat', 'Hợp tác'],
    difficulty: 'Trung bình',
  },
  {
    title: 'Thinking Strategically',
    author: 'Avinash K. Dixit & Barry J. Nalebuff',
    description: 'Phiên bản trước của "The Art of Strategy", tập trung vào case studies. Ví dụ từ chính trị quốc tế, đàm phán kinh doanh, đời sống hàng ngày. Phù hợp hiểu ứng dụng trước khi đi vào lý thuyết.',
    coverColor: 'from-amber-600 to-orange-800',
    tags: ['Case Study', 'Ứng dụng'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Prediction Machines: The Simple Economics of Artificial Intelligence',
    author: 'Ajay Agrawal, Joshua Gans, Avi Goldfarb',
    description: 'Ba giáo sư Toronto phân tích AI dưới góc độ kinh tế: AI làm giảm chi phí dự đoán, và khi chi phí giảm, hành vi thay đổi. Kết nối game theory với AI economics.',
    coverColor: 'from-teal-600 to-cyan-800',
    tags: ['AI Economics', 'Cross-module'],
    difficulty: 'Trung bình',
  },
]

const ludusVietnamese: Book[] = [
  {
    title: 'Nghệ Thuật Chiến Lược',
    author: 'Avinash K. Dixit & Barry J. Nalebuff',
    description: 'Bản dịch tiếng Việt của "The Art of Strategy". Giúp người đọc Việt Nam tiếp cận game theory bằng ngôn ngữ quen thuộc, nhiều ví dụ địa phương hóa.',
    coverColor: 'from-indigo-500 to-purple-700',
    tags: ['Game Theory', 'Dịch'],
    difficulty: 'Cơ bản',
  },
  {
    title: 'Binh Pháp Tôn Tử (The Art of War)',
    author: 'Tôn Tử (Sun Tzu)',
    description: 'Tác phẩm kinh điển về chiến lược quân sự. Các nguyên tắc "biết người biết ta", "tránh thực đánh hư" đều có thể phân tích bằng game theory. "Case study" game theory lâu đời nhất.',
    coverColor: 'from-red-700 to-amber-900',
    tags: ['Kinh điển', 'Chiến lược', 'Cổ đại'],
    difficulty: 'Cơ bản',
  },
]

// ============================================
// ALL MODULE BOOKS
// ============================================
export const MODULE_BOOKS: ModuleBooks[] = [
  { module: 'systema', moduleName: 'SYSTEMA', english: systemaEnglish, vietnamese: systemaVietnamese },
  { module: 'argos', moduleName: 'ARGOS', english: argosEnglish, vietnamese: argosVietnamese },
  { module: 'cognos', moduleName: 'COGNOS', english: cognosEnglish, vietnamese: cognosVietnamese },
  { module: 'ludus', moduleName: 'LUDUS', english: ludusEnglish, vietnamese: ludusVietnamese },
]

export function getTotalBooks(): { english: number; vietnamese: number; total: number } {
  let english = 0
  let vietnamese = 0
  MODULE_BOOKS.forEach((m) => {
    english += m.english.length
    vietnamese += m.vietnamese.length
  })
  return { english, vietnamese, total: english + vietnamese }
}
