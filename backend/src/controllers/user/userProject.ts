import { Request } from 'express'
import { ProjectSchema, ProjectCreateSchema, ProjectDeleteSchema } from '../../schemas/projectSchema'
import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
    highlights: req.body.highlights,
    keywords: req.body.keywords,
    startDate: new Date(req.body.startDate),
    endDate: (req.body.endDate) ? new Date(req.body.endDate) : undefined,
    url: req.body.url,
    roles: req.body.roles,
    entity: req.body.entity,
    type: req.body.type,
  }
  return formatBody
}

export class UserProjectController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'projects',
      'proyecto(s)',
      ProjectCreateSchema,
      ProjectSchema,
      ProjectDeleteSchema,
      true,
      parseBody
    )
  }
}

