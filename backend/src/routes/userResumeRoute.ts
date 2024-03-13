import { Router } from 'express'
import { getUserResumeAsync } from '../controllers/user/userResume'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:userId/resume', auth, getUserResumeAsync)

export default router