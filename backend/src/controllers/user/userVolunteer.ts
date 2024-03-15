import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { VolunteerSchema, VolunteerCreateSchema } from '../../schemas/volunteerSchema'


function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    organization: req.body.organization,
    position: req.body.position,
    url: req.body.url,
    startDate: new Date(req.body.startDate),
    endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
    summary: req.body.summary,
    highlights: req.body.highlights,
  }
  return formatBody
}

export class UserVolunteerController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'volunteers',
      'voluntariado',
      VolunteerCreateSchema,
      VolunteerSchema,
      DeleteSectionSchema,
      parseBody
    )
  }
}
