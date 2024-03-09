import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
  description: z.string({ required_error: 'Descripción obligatoria' }).min(1, 'Descripción obligatoria'),
  startDate: z.date({ required_error: 'Fecha desde obligatoria' }),
  endDate: z.date().optional(),
  url: z.string().url({ message: 'url inválida' }).optional(),
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


