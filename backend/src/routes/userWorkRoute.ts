import { Router } from 'express'
import { getUserWorks, createUserWork, updateUserWork, deleteUserWork } from '../controllers/userWork'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:userId/work', auth, getUserWorks)
router.post('/:userId/work', auth, createUserWork)
router.put('/:userId/work/:id', auth, updateUserWork)
router.delete('/:userId/work/:id', auth, deleteUserWork)

export default router