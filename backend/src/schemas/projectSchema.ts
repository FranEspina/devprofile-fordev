import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.number({ required_error: 'Proyectos. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Proyectos. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Proyectos. Nombre obligatorio' }).min(1, 'Proyectos. Nombre obligatorio'),
  description: z.string({ required_error: 'Proyectos. Descripción obligatoria' }).min(1, 'Proyectos. Descripción obligatoria'),
  startDate: z.string({ required_error: 'Proyectos. Fecha desde obligatoria' }).min(1, 'Proyectos. Obligatorio'),
  endDate: z.string().nullable().optional(),
  url: z.string().url({ message: 'Proyectos. Url inválida' }).nullable().optional().or(z.literal('')),
  keywords: z.string().optional(),
  roles: z.string().optional(),
  highlights: z.string().optional(),
  entity: z.string().optional(),
  type: z.string().optional(),
})

export const ProjectCreateSchema = ProjectSchema.omit({
  id: true
})

export const ProjectDeleteSchema = ProjectSchema.omit({
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

export const ProjectResumeSchema = ProjectSchema.omit({
  id: true,
  userId: true
})

