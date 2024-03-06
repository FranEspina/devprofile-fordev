import { Router } from 'express'
import { getUserProfiles, createUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userProfile'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:userId/profile', auth, getUserProfiles)
router.post('/:userId/profile', auth, createUserProfile)
router.put('/:userId/profile/:id', auth, updateUserProfile)
router.delete('/:userId/profile/:id', auth, deleteUserProfile)

export default router