import { Router } from 'express'
import { UserProfileController } from '../controllers/user/userProfile'
import { auth } from '../middlewares/auth'

const router = Router()
const controller = new UserProfileController()

router.get('/:userId/profile', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/profile', auth, controller.createUserSection.bind(controller))
router.put('/:userId/profile/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/profile/:id', auth, controller.deleteUserSection.bind(controller))

export default router