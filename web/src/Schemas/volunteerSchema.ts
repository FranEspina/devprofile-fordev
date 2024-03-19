import { z } from 'astro/zod'
import { DeleteSectionSchema } from './commonSchema'

export const VolunteerBaseSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  organization: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  position: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  url: z.string().url({ message: 'url inválida' }).optional(),
  startDate: z.string({ required_error: 'Fecha desde obligatoria' }).min(1, 'Obligatorio'),
  endDate: z.string().nullable().optional(),
  summary: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  highlights: z.string().optional(),
})

export const VolunteerSchema = VolunteerBaseSchema
  .refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
    {
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      path: ['endDate']
    })


export const VolunteerCreateSchema = VolunteerBaseSchema.omit({
  id: true,
}).refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
  {
    message: "La fecha fin debe ser mayor o igual que la fecha inicio",
    path: ['endDate']
  })

export const VolunteerResumeSchema = VolunteerBaseSchema.omit({
  id: true,
  userId: true
}).refine(p => (!p.endDate || (p.endDate && p.endDate > p.startDate)),
  {
    message: "La fecha fin debe ser mayor o igual que la fecha inicio",
    path: ['endDate']
  })

export type Volunteer = z.infer<typeof VolunteerSchema>
export type VolunteerCreate = z.infer<typeof VolunteerCreateSchema>
export type VolunteerDelete = z.infer<typeof DeleteSectionSchema>