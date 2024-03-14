import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const VolunteerSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  organization: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  position: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  url: z.string().url({ message: 'url inválida' }).optional(),
  startDate: z.date({ required_error: 'Fecha desde obligatoria' }),
  endDate: z.date().optional(),
  summary: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  highlights: z.string().optional(),
})

export const VolunteerCreateSchema = VolunteerSchema.omit({
  id: true,
})

export const VolunteerResumeSchema = VolunteerSchema.omit({
  id: true,
  userId: true
})

export type Volunteer = z.infer<typeof VolunteerSchema>
export type VolunteerCreate = z.infer<typeof VolunteerCreateSchema>
export type VolunteerDelete = z.infer<typeof DeleteSectionSchema>