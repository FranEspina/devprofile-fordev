import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { UserSkillController } from '../controllers/user/userSkill'

const router = Router()
const controller = new UserSkillController()

router.get('/:userId/skill', auth, controller.getUserSectionAsync.bind(controller))
router.post('/:userId/skill', auth, controller.createUserSection.bind(controller))
router.put('/:userId/skill/:id', auth, controller.updateUserSection.bind(controller))
router.delete('/:userId/skill/:id', auth, controller.deleteUserSection.bind(controller))

export default router