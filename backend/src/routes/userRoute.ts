import { Router } from 'express'
import { getUserResources, createUserResource, updateUserResource, deleteUserResource } from '../controllers/user'

const router = Router()

router.get('/:id/resource', getUserResources)
router.post('/:id/resource', createUserResource)
router.put('/:id/resource', updateUserResource)
router.delete('/:id/resource', deleteUserResource)

export default router