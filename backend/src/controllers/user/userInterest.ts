import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { InterestSchema, InterestCreateSchema } from '../../schemas/interestSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    keywords: req.body.keywords,
  }
  return formatBody
}

export class UserInterestController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'interests',
      'intereses',
      InterestCreateSchema,
      InterestSchema,
      DeleteSectionSchema,
      parseBody
    )
  }
}
