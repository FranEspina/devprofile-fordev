import { Router } from 'express'
import { UserBasicController } from '../controllers/user/userBasic'
import { auth } from '../middlewares/auth'

const router = Router()

const controller = new UserBasicController()

router.get('/:userId/basic', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/basic', auth, controller.createUserSection.bind(controller))
router.put('/:userId/basic/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/basic/:id', auth, controller.deleteUserSection.bind(controller))

export default router