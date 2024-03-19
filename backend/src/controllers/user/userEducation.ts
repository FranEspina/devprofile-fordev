import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { EducationSchema, EducationCreateSchema } from '../../schemas/educationSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserEducationController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'educations',
      'estudio(s)',
      EducationCreateSchema,
      EducationSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
