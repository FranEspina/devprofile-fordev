import { z } from "astro/zod";

export const ResourceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1, 'Campo obligatorio'),
  description: z.string().min(1, 'Campo obligatorio'),
  type: z.enum(['markdown', 'imagen', 'web', 'archivo']),
  url: z.string().optional(),
  keywords: z.string().optional()
})


export const ResourceCreateSchema = ResourceSchema.omit({
  id: true,
});

