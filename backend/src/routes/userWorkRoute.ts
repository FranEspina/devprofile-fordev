import { Router } from 'express'
import { UserWorkController } from '../controllers/userWork'
import { auth } from '../middlewares/auth'

const router = Router()

const controller = new UserWorkController()

router.get('/:userId/work', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/work', auth, controller.createUserSection.bind(controller))
router.put('/:userId/work/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/work/:id', auth, controller.deleteUserSection.bind(controller))

export default router