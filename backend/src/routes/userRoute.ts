import { Router } from 'express'
import { getUserResources, createUserResource, updateUserResource, deleteUserResource } from '../controllers/user'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:id/resource', auth, getUserResources)
router.post('/:id/resource', auth, createUserResource)
router.put('/:id/resource', auth, updateUserResource)
router.delete('/:id/resource', auth, deleteUserResource)

export default router