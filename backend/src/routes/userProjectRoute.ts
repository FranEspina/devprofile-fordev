import { Router } from 'express'
import { getUserProjects, createUserProject, updateUserProject, deleteUserProject } from '../controllers/userProject'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/:userId/project', auth, getUserProjects)
router.post('/:userId/project', auth, createUserProject)
router.put('/:userId/project/:id', auth, updateUserProject)
router.delete('/:userId/project/:id', auth, deleteUserProject)

export default router