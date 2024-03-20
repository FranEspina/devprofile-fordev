import { z } from 'astro/zod'

export const WorkBaseSchema = z.object(
  {
    id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
    userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
    name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
    location: z.string({ required_error: 'Lugar obligatorio' }).min(1, 'Lugar obligatorio'),
    description: z.string({ required_error: 'Descripción obligatoria' }).min(1, 'Descripción obligatoria'),
    position: z.string({ required_error: 'Posición obligatoria' }).min(1, 'Posición obligatoria'),
    url: z.string().url({ message: 'url inválida' }).optional(),
    startDate: z.string({ required_error: 'Fecha desde obligatoria' }).min(1, 'Obligatorio'),
    endDate: z.string().nullable().optional(),
    summary: z.string().optional(),
    highlights: z.string().optional(),
  }
)

export const WorkSchema = WorkBaseSchema
  .refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
    {
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      path: ['endDate']
    })

export const WorkResumeSchema = WorkBaseSchema.extend({
  highlights: z.string().array().optional(),
})
  .refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
    {
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      path: ['endDate']
    })

export const WorkCreateSchema = WorkBaseSchema.omit({
  id: true,
}).refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
  {
    message: "La fecha fin debe ser mayor o igual que la fecha inicio",
    path: ['endDate']
  })

export const WorkDeleteSchema = WorkBaseSchema.omit({
  name: true,
  location: true,
  description: true,
  position: true,
  url: true,
  startDate: true,
  endDate: true,
  summary: true,
  highlights: true,
})

export type Work = z.infer<typeof WorkSchema>
export type WorkCreate = z.infer<typeof WorkCreateSchema>
export type WorkDelete = z.infer<typeof WorkDeleteSchema>
export type WorkResume = z.infer<typeof WorkResumeSchema>



