import { Router } from 'express'
import { UserSectionController, getUserSectionDataAsync } from '../controllers/user/userSection'
import { auth } from '../middlewares/auth'

const router = Router()

const controller = new UserSectionController()

router.get('/:userId/section', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/section', auth, controller.createUserSection.bind(controller))
router.put('/:userId/section/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/section/:id', auth, controller.deleteUserSection.bind(controller))

router.get('/:userId/sectiondata', auth, getUserSectionDataAsync)

export default router