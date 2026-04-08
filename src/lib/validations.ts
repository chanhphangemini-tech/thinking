import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const signupSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  display_name: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(50, 'Tên hiển thị không được quá 50 ký tự').optional(),
})

// Quiz validation schemas
export const quizQuerySchema = z.object({
  module: z.enum(['systema', 'argos', 'cognos', 'ludus']),
  phase: z.coerce.number().int().min(1).max(5),
})

export const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.enum(['A', 'B', 'C', 'D']),
})

export const submitQuizSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos', 'ludus']),
  phaseNumber: z.coerce.number().int().min(1).max(5),
  answers: z.record(z.enum(['A', 'B', 'C', 'D'])),
})

// Progress validation schemas
export const progressQuerySchema = z.object({
  userId: z.string(),
})

export const progressUpdateSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos', 'ludus']),
  phaseNumber: z.coerce.number().int().min(1).max(5),
  score: z.coerce.number().int().min(0).max(8),
  passed: z.boolean(),
})

// Journal validation schemas
export const journalCreateSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos', 'ludus']).optional(),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200, 'Tiêu đề không được quá 200 ký tự'),
  content: z.string().min(1, 'Nội dung không được để trống').max(10000, 'Nội dung không được quá 10000 ký tự'),
})

export const journalQuerySchema = z.object({
  userId: z.string(),
})

// Profile validation schemas
export const profileQuerySchema = z.object({
  userId: z.string(),
})

// Change password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự'),
  newPassword: z.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(128, 'Mật khẩu mới không được quá 128 ký tự'),
  confirmNewPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
  accessToken: z.string().min(1, 'Phiên đăng nhập không hợp lệ'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  path: ['newPassword'],
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type QuizQueryInput = z.infer<typeof quizQuerySchema>
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>
export type JournalCreateInput = z.infer<typeof journalCreateSchema>
