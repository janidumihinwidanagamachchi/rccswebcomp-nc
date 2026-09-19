import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'parent', 'teacher']),
  grade: z.coerce.number().min(1).max(13).optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  description: z.string().min(20, 'Description is required'),
  categoryId: z.string().uuid('Category is required'),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationOpensAt: z.string().min(1, 'Registration open date is required'),
  registrationClosesAt: z.string().min(1, 'Registration close date is required'),
  capacity: z.coerce.number().min(1).optional(),
  featured: z.boolean(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type EventFormData = z.infer<typeof eventSchema>

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  categoryId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  publishedAt: z.string().min(1, 'Publish date is required'),
  expiresAt: z.string().optional(),
})

export type AnnouncementFormData = z.infer<typeof announcementSchema>

export const registrationSchema = z.object({
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: z.string().email('Valid email is required'),
  attendeeGrade: z.coerce.number().min(1).max(13).optional(),
  notes: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
