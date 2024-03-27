import { z } from 'zod'

export const BasicSchema = z.object({
  id: z.number({ required_error: 'Datos básicos. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Datos básicos. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Datos básicos. Nombre obligatorio' }).min(1, 'Datos básicos. Nombre obligatorio'),
  label: z.string({ required_error: 'Datos básicos. Nivel obligatorio' }).min(1, 'Datos básicos. Nivel obligatorio'),
  image: z.string({ required_error: 'Datos básicos. Url imagen obligatoria' }).url({ message: 'Datos básicos. Url imagen inválida' }),
  email: z.string({ required_error: 'Datos básicos. Email obligatorio' }).email('Datos básicos. Email no válido'),
  phone: z.string({ required_error: 'Datos básicos. Nombre obligatorio' }).min(1, 'Datos básicos. Teléfono obligatorio'),
  url: z.string({ required_error: 'Datos básicos. Url sitio inválida' }).url({ message: 'Datos básicos. Url sitio inválida' }),
  summary: z.string().optional(),
})


export const BasicCreateSchema = BasicSchema.omit({
  id: true
})

export const BasicDeleteSchema = BasicSchema.omit({
  name: true,
  label: true,
  image: true,
  email: true,
  phone: true,
  url: true,
  summary: true
})

export const BasicResumeSchema = BasicSchema.omit({
  id: true,
  userId: true
})