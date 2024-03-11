import { Request } from 'express'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema } from '../schemas/workSchema'

import { UserSectionController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    position: req.body.position,
    startDate: new Date(req.body.startDate),
    endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined
  }
  return formatBody
}

export class UserWorkController extends UserSectionController<{ id: number, userId: string }> {
  constructor() {
    super(
      'works',
      'puesto(s)',
      WorkCreateSchema,
      WorkSchema,
      WorkDeleteSchema,
      parseBody
    )
  }
}
