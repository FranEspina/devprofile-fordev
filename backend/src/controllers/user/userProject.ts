import { Request } from 'express'
import { ProjectSchema, ProjectCreateSchema, ProjectDeleteSchema } from '../../schemas/projectSchema'
import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
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

