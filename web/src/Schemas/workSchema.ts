import { z } from 'astro/zod'

export const UserWorkSchema = z.object(
  {
    id: z.number().positive().min(1),
    userId: z.number().positive().min(1),
    title: z.string({ required_error: 'Es obligatorio informar título' }).min(1, 'Título obligatorio'),
    position: z.string({ required_error: 'Es obligatorio informar puesto' }).min(1, 'Puesto obligatorio'),
    description: z.string({ required_error: 'Es obligatorio informar descripción' }).min(1, 'Descripción obligatoria'),
    startDate: z.date({ required_error: 'Es obligatorio informar fecha desde' }),
    endDate: z.date().optional(),
    highlights: z.array(z.string())
  }
)

export const UserWorkCreateSchema = UserWorkSchema.omit({
  id: true,
})

export type UserWork = z.infer<typeof UserWorkSchema>
export type UserWorkCreate = z.infer<typeof UserWorkCreateSchema>

