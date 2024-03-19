import { Request } from 'express'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema } from '../../schemas/workSchema'

import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserWorkController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'works',
      'puesto(s)',
      WorkCreateSchema,
      WorkSchema,
      WorkDeleteSchema,
      true,
      parseBody
    )
  }
}
