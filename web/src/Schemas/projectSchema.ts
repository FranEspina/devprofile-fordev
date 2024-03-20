import { z } from 'astro/zod'

const ProjectBaseSchema = z.object(
  {
    id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
    userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
    name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
    description: z.string({ required_error: 'Descripción obligatoria' }).min(1, 'Descripción obligatoria'),
    startDate: z.string({ required_error: 'Fecha desde obligatoria' }).min(1, 'Obligatorio'),
    endDate: z.string().nullable().optional(),
    url: z.string().url({ message: 'url inválida' }).nullable().optional().or(z.literal('')),
    keywords: z.string().optional(),
    roles: z.string().optional(),
    highlights: z.string().optional(),
    entity: z.string().optional(),
    type: z.string().optional(),
  }
)

export const ProjectSchema = ProjectBaseSchema
  .refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
    {
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      path: ['endDate']
    })

export const ProjectCreateSchema = ProjectBaseSchema.omit({
  id: true,
}).refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
  {
    message: "La fecha fin debe ser mayor o igual que la fecha inicio",
    path: ['endDate']
  })

export const ProjectDeleteSchema = ProjectBaseSchema.omit({
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  url: true,
  keywords: true,
  roles: true,
  highlights: true,
  entity: true,
  type: true,
})

export const ProjectResumeSchema = ProjectBaseSchema.extend({
  keywords: z.string().array().optional(),
  roles: z.string().array().optional(),
  highlights: z.string().array().optional(),
})
  .refine(p => (!p.endDate || (p.endDate && p.endDate >= p.startDate)),
    {
      message: "La fecha fin debe ser mayor o igual que la fecha inicio",
      path: ['endDate']
    })

export type Project = z.infer<typeof ProjectSchema>
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>
export type ProjectDelete = z.infer<typeof ProjectDeleteSchema>
export type ProjectResume = z.infer<typeof ProjectResumeSchema>

