import { Router } from 'express'
import { getUserProfiles, createUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userProfile'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:id/profile', auth, getUserProfiles)
router.post('/:id/profile', auth, createUserProfile)
router.put('/:id/profile', auth, updateUserProfile)
router.delete('/:id/profile', auth, deleteUserProfile)

export default router