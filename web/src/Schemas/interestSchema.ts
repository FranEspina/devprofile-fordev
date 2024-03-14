import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const InterestSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  keywords: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const InterestCreateSchema = InterestSchema.omit({
  id: true,
})

export const InterestResumeSchema = InterestSchema.omit({
  id: true,
  userId: true
})

export type Interest = z.infer<typeof InterestSchema>
export type InterestCreate = z.infer<typeof InterestCreateSchema>
export type InterestDelete = z.infer<typeof DeleteSectionSchema>