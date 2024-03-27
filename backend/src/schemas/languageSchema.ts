import { z } from 'zod'

export const LanguageSchema = z.object({
  id: z.number({ required_error: 'Idiomas. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Idiomas. Identificador del usuario obligatorio' }),
  language: z.string({ required_error: 'Idiomas. Nombre bligatorio' }).min(1, 'Idiomas. Nombre obligatorio'),
  fluency: z.string({ required_error: 'Idiomas. Nivel obligatorio' }).min(1, 'Idiomas. Nivel obligatorio'),
})

export const LanguageCreateSchema = LanguageSchema.omit({
  id: true,
})

export const LanguageResumeSchema = LanguageSchema.omit({
  id: true,
  userId: true
})