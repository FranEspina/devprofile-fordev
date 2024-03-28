import { Router } from 'express'
import { ping } from '../controllers/test/test'

const router = Router();
router.get('/ping', ping)
export default router;