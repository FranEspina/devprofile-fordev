import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const AwardSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  title: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  date: z.string({ required_error: 'Fecha obligatoria' }).min(1, 'Fecha obligatoria'),
  awarder: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  summary: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const AwardCreateSchema = AwardSchema.omit({
  id: true,
})

export const AwardResumeSchema = AwardSchema.omit({
  id: true,
  userId: true
})

export type Award = z.infer<typeof AwardSchema>
export type AwardCreate = z.infer<typeof AwardCreateSchema>
export type AwardDelete = z.infer<typeof DeleteSectionSchema>