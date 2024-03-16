import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { AwardSchema, AwardCreateSchema } from '../../schemas/awardSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    date: new Date(req.body.date),
    awarder: req.body.awarder,
    summary: req.body.summary,
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
