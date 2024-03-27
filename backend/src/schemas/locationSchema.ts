import { z } from 'zod'

export const LocationSchema = z.object({
  id: z.number({ required_error: 'Direcciones. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Direcciones. Identificador del usuario obligatorio' }),
  address: z.string({ required_error: 'Direcciones. Vía obligatoria' }).min(1, 'Direcciones. Vía obligatoria'),
  postalCode: z.string({ required_error: 'Direcciones. Código postal obligatorio' }).min(1, 'Direcciones. Código postal obligatorio'),
  city: z.string({ required_error: 'Direcciones. Ciudad obligatoria' }).min(1, 'Direcciones. Ciudad obligatoria'),
  countryCode: z.string({ required_error: 'Direcciones. Región obligatoria' }).min(1, 'Direcciones. Región obligatoria'),
  region: z.string().optional(),
})

export const LocationCreateSchema = LocationSchema.omit({
  id: true,
})

export const LocationResumeSchema = LocationSchema.omit({
  id: true,
  userId: true
})