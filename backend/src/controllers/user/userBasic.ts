import { UserSectionBaseController } from './base/UserSectionBaseController'
import { BasicCreateSchema, BasicDeleteSchema, BasicSchema } from '../../schemas/basicSchema'
import { Request } from 'express'

function parseBody(req: Request) {
  const formatBody = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    label: req.body.label,
    image: req.body.image,
    email: req.body.email,
    phone: req.body.phone,
    url: req.body.url,
    summary: req.body.summary
  }
  return formatBody
}

export class UserBasicController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'basics',
      'datos básicos(s)',
      BasicCreateSchema,
      BasicSchema,
      BasicDeleteSchema,
      parseBody
    )
  }
}