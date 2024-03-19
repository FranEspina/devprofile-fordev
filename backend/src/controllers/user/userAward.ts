import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { AwardSchema, AwardCreateSchema } from '../../schemas/awardSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserAwardController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'awards',
      'logros',
      AwardCreateSchema,
      AwardSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
