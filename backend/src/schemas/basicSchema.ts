import { z } from 'zod'

export const BasicSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Nombre obligatorio'),
  label: z.string({ required_error: 'Nivel obligatorio' }).min(1, 'Nivel obligatorio'),
  image: z.string({ required_error: 'Url imagen obligatoria' }).url({ message: 'url imagen inválida' }),
  email: z.string({ required_error: 'Email obligatorio' }).email('Email no válido'),
  phone: z.string({ required_error: 'Nombre obligatorio' }).min(1, 'Teléfono obligatorio'),
  url: z.string({ required_error: 'Url inválida' }).url({ message: 'url inválida' }),
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
