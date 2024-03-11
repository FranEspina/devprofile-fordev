import { z } from 'zod'

export const SkillSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
  level: z.string({ required_error: 'Nivel obligatorio' }).min(1, 'Nivel obligatorio'),
  keywords: z.string().optional(),
})

export const SkillCreateSchema = SkillSchema.omit({
  id: true
})

export const SkillDeleteSchema = SkillSchema.omit({
  name: true,
  level: true,
  keywords: true
})
