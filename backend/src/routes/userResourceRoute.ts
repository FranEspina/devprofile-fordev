import { Router } from 'express'
import { UserResourceController } from '../controllers/userResource'
import { auth } from '../middlewares/auth'

const router = Router()
const controller = new UserResourceController()

router.get('/:userId/resource', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/resource', auth, controller.createUserSection.bind(controller))
router.put('/:userId/resource/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/resource/:id', auth, controller.deleteUserSection.bind(controller))

export default router