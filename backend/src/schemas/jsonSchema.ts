import { z } from 'zod'
import { WorkResumeSchema } from './workSchema';
import { ProjectResumeSchema } from './projectSchema';
import { ReferenceResumeSchema } from './referenceSchema';
import { InterestResumeSchema } from './interestSchema';
import { LanguageResumeSchema } from './languageSchema';
import { SkillResumeSchema } from './skillSchema';
import { PublicationResumeSchema } from './publicationSchema';
import { CertificateResumeSchema } from './certificateSchema';
import { AwardResumeSchema } from './awardSchema';
import { EducationResumeSchema } from './educationSchema';
import { VolunteerResumeSchema } from './volunteerSchema';
import { BasicResumeSchema } from './basicSchema';
import { LocationResumeSchema } from './locationSchema';
import { ProfileResumeSchema } from './profileSchema';

export const JsonBasicsResumeSchema = BasicResumeSchema.extend(
  {
    location: LocationResumeSchema,
    profiles: z.array(ProfileResumeSchema)
  }
)

export const JsonResumeSchema = z.object({
  basics: JsonBasicsResumeSchema.optional(),
  work: z.array(WorkResumeSchema.extend({
    highlights: z.string({ required_error: 'work.highlights required' }).array().optional().nullable()
  })).optional(),
  volunteer: z.array(VolunteerResumeSchema.extend({
    highlights: z.string({ required_error: 'volunteer.highlights required' }).array().optional().nullable()
  })).optional(),
  education: z.array(EducationResumeSchema.extend({
    courses: z.string({ required_error: 'education.courses required' }).array().optional().nullable()
  })).optional(),
  awards: z.array(AwardResumeSchema).optional(),
  certificates: z.array(CertificateResumeSchema).optional(),
  publications: z.array(PublicationResumeSchema).optional(),
  skills: z.array(SkillResumeSchema.extend({
    keywords: z.string({ required_error: 'skills.keywords required' }).array().optional().nullable()
  })).optional(),
  languages: z.array(LanguageResumeSchema).optional(),
  interests: z.array(InterestResumeSchema.extend({
    keywords: z.string({ required_error: 'interests.keywords required' }).array().optional().nullable()
  })).optional(),
  references: z.array(ReferenceResumeSchema).optional(),
  projects: z.array(ProjectResumeSchema.extend({
    highlights: z.string({ required_error: 'projects.highlights required' }).array().optional().nullable(),
    keywords: z.string({ required_error: 'projects.keywords required' }).array().optional().nullable(),
    roles: z.string({ required_error: 'projects.roles required' }).array().optional().nullable(),
  })).optional(),
});

export type JSonResume = z.infer<typeof JsonResumeSchema>