import { z } from 'astro/zod'

export const WorkSchema = z.object(
  {
    id: z.number().positive().min(1),
    userId: z.number().positive().min(1),
    title: z.string({ required_error: 'Es obligatorio informar título' }).min(1, 'Título obligatorio'),
    position: z.string({ required_error: 'Es obligatorio informar puesto' }).min(1, 'Puesto obligatorio'),
    description: z.string({ required_error: 'Es obligatorio informar descripción' }).min(1, 'Descripción obligatoria'),
    startDate: z.date({ required_error: 'Es obligatorio informar fecha desde' }),
    endDate: z.date().optional(),
    highlights: z.array(z.string()).optional()
  }
)

export const WorkCreateSchema = WorkSchema.omit({
  id: true,
})

export const WorkDeleteSchema = WorkSchema.omit({
  title: true,
  position: true,
  description: true,
  startDate: true,
  endDate: true,
})

export type Work = z.infer<typeof WorkSchema>
export type WorkCreate = z.infer<typeof WorkCreateSchema>
export type WorkDelete = z.infer<typeof WorkDeleteSchema>


