import { z } from 'zod'

function optionalNumber(message = 'Must be a valid number') {
  return z
    .union([z.literal(''), z.coerce.number().min(1, message)])
    .transform<number | undefined>((val) => (val === '' ? undefined : val))
    .optional()
}

function optionalUuid() {
  return z
    .union([z.literal(''), z.string().uuid()])
    .transform<string | undefined>((val) => (val === '' ? undefined : val))
    .optional()
}

function optionalUrl(message = 'Must be a valid URL') {
  return z
    .union([z.literal(''), z.string().url(message)])
    .transform<string | undefined>((val) => (val === '' ? undefined : val))
    .optional()
}

function optionalString() {
  return z
    .union([z.literal(''), z.string()])
    .transform<string | undefined>((val) => (val === '' ? undefined : val))
    .optional()
}

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'parent', 'teacher'], { required_error: 'Please select a role' }),
  grade: optionalNumber(),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  description: z.string().min(20, 'Description is required'),
  categoryId: optionalUuid(),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationOpensAt: z.string().min(1, 'Registration open date is required'),
  registrationClosesAt: z.string().min(1, 'Registration close date is required'),
  capacity: optionalNumber('Capacity must be at least 1'),
  featured: z.boolean(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  imageUrl: optionalUrl(),
})

export type EventFormData = z.infer<typeof eventSchema>

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  categoryId: optionalUuid(),
  eventId: optionalUuid(),
  publishedAt: z.string().min(1, 'Publish date is required'),
  expiresAt: optionalString(),
})

export type AnnouncementFormData = z.infer<typeof announcementSchema>

export const registrationSchema = z.object({
  attendeeName: z.string().min(2, 'Name is required'),
  attendeeEmail: z.string().email('Valid email is required'),
  attendeeGrade: optionalNumber('Grade must be between 1 and 13'),
  notes: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
