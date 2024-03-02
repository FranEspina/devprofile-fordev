import { z } from "astro/zod";

export enum ResourceType {
  Markdown = 'markdown',
  Imagen = 'imagen',
  Web = 'web',
  Archivo = 'archivo'
}

const resourceTypeValues = Object.values(ResourceType).join(', ')

export const ResourceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1, 'Campo obligatorio'),
  description: z.string().min(1, 'Campo obligatorio'),
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
  url: z.string().optional(),
  keywords: z.string().optional()
})


export const ResourceCreateSchema = ResourceSchema.omit({
  id: true,
});

