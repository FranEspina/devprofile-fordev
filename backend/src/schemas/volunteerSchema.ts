import { z } from 'zod'

export const VolunteerSchema = z.object({
  id: z.number({ required_error: 'Voluntariados. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Voluntariados. Identificador del usuario obligatorio' }),
  organization: z.string({ required_error: 'Voluntariados. Organización obligatoria' }).min(1, 'Voluntariados. Organización obligatoria'),
  position: z.string({ required_error: 'Voluntariados. Posición obligatoria' }).min(1, 'Voluntariados. Posición obligatoria'),
  url: z.string().url({ message: 'Voluntariados. Url inválida' }).nullable().optional().or(z.literal('')),
  startDate: z.string({ required_error: 'Voluntariados. Fecha desde obligatoria' }).min(1, 'Voluntariados. Obligatorio'),
  endDate: z.string().nullable().optional(),
  summary: z.string({ required_error: 'Voluntariados. Resumen obligatorio' }).min(1, 'Voluntariados. Resumen bligatorio'),
  highlights: z.string().optional(),
})

export const VolunteerCreateSchema = VolunteerSchema.omit({
  id: true,
})

export const VolunteerResumeSchema = VolunteerSchema.omit({
  id: true,
  userId: true
})