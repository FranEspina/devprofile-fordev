import { z } from 'astro/zod'

export const SkillSchema = z.object(
  {
    id: z.number(),
    userId: z.number(),
    name: z.string({ required_error: "Compentencia obligatoria" }).min(1, "Compentencia obligatoria"),
    level: z.string({ required_error: "Nivel obligatorio" }).min(1, "Nivel obligatorio"),
    keywords: z.string().optional(),
  }
)

export const SkillCreateSchema = SkillSchema.omit({
  id: true
})

export const SkillResumeSchema = SkillSchema.extend({
  keywords: z.string().array().optional(),
})

export const SkillDeleteSchema = SkillSchema.omit({
  name: true,
  level: true,
  keywords: true,
})

export type Skill = z.infer<typeof SkillSchema>
export type SkillCreate = z.infer<typeof SkillCreateSchema>
export type SkillDelete = z.infer<typeof SkillDeleteSchema>
export type SkillResume = z.infer<typeof SkillResumeSchema>



