import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const PublicationSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  publisher: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  releaseDate: z.string({ required_error: 'Fecha obligatoria' }).min(1, 'Fecha obligatoria'),
  url: z.string().url({ message: 'url inválida' }).optional(),
  summary: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const PublicationCreateSchema = PublicationSchema.omit({
  id: true,
})

export const PublicationResumeSchema = PublicationSchema.omit({
  id: true,
  userId: true
})

export type Publication = z.infer<typeof PublicationSchema>
export type PublicationCreate = z.infer<typeof PublicationCreateSchema>
export type PublicationDelete = z.infer<typeof DeleteSectionSchema>