import { Router } from 'express'
import { UserProjectController } from '../controllers/user/userProject'
import { auth } from '../middlewares/auth'

const router = Router()
const controller = new UserProjectController()

router.get('/:userId/project', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/project', auth, controller.createUserSection.bind(controller))
router.put('/:userId/project/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/project/:id', auth, controller.deleteUserSection.bind(controller))

export default router