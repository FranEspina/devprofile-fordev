import { Router } from 'express'
import { getResources } from '../controllers/devResource'

const router = Router()

router.get('/', getResources)

export default router