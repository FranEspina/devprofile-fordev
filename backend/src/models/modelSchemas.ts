import { z } from 'zod'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../schemas/devResourceSchema'
import { ProfileSchema, ProfileCreateSchema, ProfileDeleteSchema, ProfileResumeSchema } from '../schemas/profileSchema'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema, WorkResumeSchema } from '../schemas/workSchema'
import { ProjectSchema, ProjectCreateSchema, ProjectDeleteSchema, ProjectResumeSchema } from '../schemas/projectSchema'
import { SkillSchema, SkillCreateSchema, SkillDeleteSchema, SkillResumeSchema } from '../schemas/skillSchema'
import { BasicResumeSchema } from '../schemas/basicSchema'


export type DevResource = z.infer<typeof DevResourceSchema>;
export type DevResourceCreate = z.infer<typeof DevResourceCreateSchema>
export type DevResourceDelete = z.infer<typeof DevResourceDeleteSchema>

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>
export type ProfileDelete = z.infer<typeof ProfileDeleteSchema>
export type ProfileResume = z.infer<typeof ProfileResumeSchema>

export type Work = z.infer<typeof WorkSchema>;
export type WorkCreate = z.infer<typeof WorkCreateSchema>
export type WorkDelete = z.infer<typeof WorkDeleteSchema>
export type WorkResume = z.infer<typeof WorkResumeSchema>

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>
export type ProjectDelete = z.infer<typeof ProjectDeleteSchema>
export type ProjectResume = z.infer<typeof ProjectResumeSchema>

export type Skill = z.infer<typeof SkillSchema>;
export type SkillCreate = z.infer<typeof SkillCreateSchema>
export type SkillDelete = z.infer<typeof SkillDeleteSchema>
export type SkillResume = z.infer<typeof SkillResumeSchema>

export type BasicResume = z.infer<typeof BasicResumeSchema>

export type UserDeleteSection = {
  tablename: string,
  id: number,
  userId: number
}

export type SectionData = {
  id: number,
  sectionName: string,
  sectionFullName: string,
  sectionId: number,
  sectionDesc: string,
  isPublic: boolean
} 