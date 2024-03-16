import { Request } from 'express'
import { WorkSchema, WorkCreateSchema, WorkDeleteSchema } from '../../schemas/workSchema'

import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    position: req.body.position,
    url: req.body.url,
    startDate: new Date(req.body.startDate),
    endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
    summary: req.body.summary,
    highlights: req.body.highlights,
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
