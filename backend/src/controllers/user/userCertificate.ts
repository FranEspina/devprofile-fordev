import { Request } from 'express'
import { UserSectionBaseController } from './base/UserSectionBaseController'
import { DeleteSectionSchema } from '../../schemas/commonSchema'
import { CertificateSchema, CertificateCreateSchema } from '../../schemas/certificateSchema'


function parseBody(req: Request) {
  const formatBody = {
    ...req.body
  }
  return formatBody
}

export class UserCertificateController extends UserSectionBaseController<{ id: number, userId: string }> {
  constructor() {
    super(
      'certificates',
      'certificado(s)',
      CertificateCreateSchema,
      CertificateSchema,
      DeleteSectionSchema,
      true,
      parseBody
    )
  }
}
