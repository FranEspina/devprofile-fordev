import { UserSectionBaseController } from './base/UserSectionBaseController'
import { SkillCreateSchema, SkillDeleteSchema, SkillSchema } from '../../schemas/skillSchema'
import { Request } from 'express'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserSkillController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'skills',
      'competencia(s)',
      SkillCreateSchema,
      SkillSchema,
      SkillDeleteSchema,
      true,
      parseBody
    )
  }
}