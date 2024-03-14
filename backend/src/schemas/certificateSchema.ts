import { z } from 'zod'

export const CertificateSchema = z.object({
  id: z.number({ required_error: 'Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
  date: z.date({ required_error: 'Fecha desde obligatoria' }),
  url: z.string().url({ message: 'url inválida' }).optional(),
  issuer: z.string({ required_error: 'Obligatorio' }).min(1, 'Obligatorio'),
})

export const CertificateCreateSchema = CertificateSchema.omit({
  id: true,
})

export const CertificateResumeSchema = CertificateSchema.omit({
  id: true,
  userId: true
})