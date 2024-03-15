import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { EducationSchema, EducationCreateSchema } from '../../schemas/educationSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    institution: req.body.institution,
    url: req.body.url,
    area: req.body.area,
    studyType: req.body.studyType,
    startDate: new Date(req.body.startDate),
    endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
    score: req.body.score,
    courses: req.body.courses,
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
      parseBody
    )
  }
}
