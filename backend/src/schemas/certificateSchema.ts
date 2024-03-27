import { z } from 'zod'

export const CertificateSchema = z.object({
  id: z.number({ required_error: 'Certificados. Identificador del perfil obligatorio' }),
  userId: z.number({ required_error: 'Certificados. Identificador del usuario obligatorio' }),
  name: z.string({ required_error: 'Certificados. Nombre obligatorio' }).min(1, 'Certificados. Nombre obligatorio'),
  date: z.string({ required_error: 'Certificados. Fecha obligatoria' }).min(1, 'Certificados. Fecha obligatoria'),
  url: z.string().url({ message: 'Certificados. Url inválida' }).nullable().optional().or(z.literal('')),
  issuer: z.string({ required_error: 'Certificados. Entidad obligatoria' }).min(1, 'Certificados. Entidad obligatoria'),
})

export const CertificateCreateSchema = CertificateSchema.omit({
  id: true,
})

export const CertificateResumeSchema = CertificateSchema.omit({
  id: true,
  userId: true
})