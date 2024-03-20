import { z } from 'zod'

export enum ResourceType {
  Markdown = 'markdown',
  Imagen = 'imagen',
  Web = 'web',
  Archivo = 'archivo'
}

const resourceTypeValues = Object.values(ResourceType).join(', ')

export const DevResourceSchema = z.object({
  id: z.number({ required_error: 'Identificador del recurso obligatorio' }),
  userId: z.number({ required_error: 'Identificador del usuario obligatorio' }),
  title: z.string({ required_error: 'Título del recurso obligatorio' }).min(1),
  description: z.string({ required_error: 'Descripción del recurso obligatorio' }).min(1),
  type: z.nativeEnum(ResourceType, {
    errorMap: (issue) => {
      switch (issue.code) {
        case 'invalid_type':
          return { message: `El tipo de contenido debe ser: ${resourceTypeValues}.` }
        case 'invalid_enum_value':
          return { message: `El valor proporcionado no es válido. Debe ser uno de los siguientes: ${resourceTypeValues}.` }
        default:
          return { message: 'Error desconocido al validar el tipo de contenido.' }
      }
    }
  }),
  url: z.string().url({ message: 'url inválida' }).nullable().optional().or(z.literal('')),
  keywords: z.string().optional()
})

export const DevResourceCreateSchema = DevResourceSchema.omit({
  id: true,
})

export const DevResourceDeleteSchema = DevResourceSchema.omit({
  title: true,
  description: true,
  type: true,
  url: true,
  keywords: true
})


