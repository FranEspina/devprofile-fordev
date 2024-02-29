import { Router } from 'express'
import { getUserResources } from '../controllers/user'

const router = Router()

router.get('/:id/resource', getUserResources)

export default router