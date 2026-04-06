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
  module: z.enum(['systema', 'argos', 'cognos']),
  phase: z.coerce.number().int().min(1).max(5),
})

export const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.enum(['A', 'B', 'C', 'D']),
})

export const submitQuizSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos']),
  phaseNumber: z.coerce.number().int().min(1).max(5),
  answers: z.record(z.enum(['A', 'B', 'C', 'D'])),
})

// Progress validation schemas
export const progressQuerySchema = z.object({
  userId: z.string(),
})

export const progressUpdateSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos']),
  phaseNumber: z.coerce.number().int().min(1).max(5),
  score: z.coerce.number().int().min(0).max(5),
  passed: z.boolean(),
})

// Journal validation schemas
export const journalCreateSchema = z.object({
  userId: z.string(),
  moduleSlug: z.enum(['systema', 'argos', 'cognos']).optional(),
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

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type QuizQueryInput = z.infer<typeof quizQuerySchema>
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>
export type JournalCreateInput = z.infer<typeof journalCreateSchema>
