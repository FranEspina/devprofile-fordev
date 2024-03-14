import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const LanguageSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  language: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  fluency: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const LanguageCreateSchema = LanguageSchema.omit({
  id: true,
})

export const LanguageResumeSchema = LanguageSchema.omit({
  id: true,
  userId: true
})

export type Language = z.infer<typeof LanguageSchema>
export type LanguageCreate = z.infer<typeof LanguageCreateSchema>
export type LanguageDelete = z.infer<typeof DeleteSectionSchema>