import { Router } from 'express'
import { getUserResources, createUserResource } from '../controllers/user'

const router = Router()

router.get('/:id/resource', getUserResources)
router.post('/:id/resource', createUserResource)


export default router