import { Router } from 'express'
import { getUserWorks, createUserWork, updateUserWork, deleteUserWork } from '../controllers/userProject'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:userId/project', auth, getUserWorks)
router.post('/:userId/project', auth, createUserWork)
router.put('/:userId/project/:id', auth, updateUserWork)
router.delete('/:userId/project/:id', auth, deleteUserWork)

export default router