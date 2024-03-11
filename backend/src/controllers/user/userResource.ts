import { Request } from 'express'
import { DevResourceSchema, DevResourceCreateSchema, DevResourceDeleteSchema } from '../../schemas/devResourceSchema';
import { UserSectionController } from './base/UserSectionBaseController'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    keywords: req.body.keywords,
    url: req.body.url,
  }
  return formatBody
}

export class UserResourceController extends UserSectionController<{ id: number, userId: string }> {
  constructor() {
    super(
      'resources',
      'recurso(s)',
      DevResourceCreateSchema,
      DevResourceSchema,
      DevResourceDeleteSchema,
      parseBody
    )
  }
}