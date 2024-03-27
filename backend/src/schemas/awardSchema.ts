import { z } from 'zod'

export const AwardSchema = z.object({
  id: z.number({ required_error: 'Logos. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Logros. Identificador del usuario obligatorio' }),
  title: z.string({ required_error: 'Logros. Título obligatorio' }).min(1, 'Logros. Título obligatorio'),
  date: z.string({ required_error: 'Logros. Fecha obligatoria' }).min(1, 'Logros. Fecha obligatoria'),
  awarder: z.string({ required_error: 'Logros. Entidad obligatorio' }).min(1, 'Logros. Entidad obligatorio'),
  summary: z.string({ required_error: 'Logros. Resumen obligatorio' }).min(1, 'Logros. Resume obligatorio'),
})

export const AwardCreateSchema = AwardSchema.omit({
  id: true,
})

export const AwardResumeSchema = AwardSchema.omit({
  id: true,
  userId: true
})