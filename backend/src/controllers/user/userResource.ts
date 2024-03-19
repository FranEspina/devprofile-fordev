import { Request } from 'express'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../../schemas/devResourceSchema';
import { UserSectionBaseController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserResourceController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'resources',
      'recurso(s)',
      DevResourceCreateSchema,
      DevResourceSchema,
      DevResourceDeleteSchema,
      true,
      parseBody
    )
  }
}