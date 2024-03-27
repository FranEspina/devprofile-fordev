import { z } from 'zod'

export const SkillSchema = z.object({
  id: z.number({ required_error: 'Competencias. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Competencias. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Competencias. Nombre obligatorio' }).min(1, 'Competencias. Nombre obligatorio'),
  level: z.string({ required_error: 'Competencias. Nivel obligatorio' }).min(1, 'Competencias. Nivel obligatorio'),
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

export const SkillResumeSchema = SkillSchema.omit({
  id: true,
  userId: true
})