import { Router } from 'express'
import { register, login, verify } from '../controllers/auth/auth'
import { auth } from '../middlewares/auth'

const router = Router();
router.post('/register', register)
router.post('/login', login)

//Valida si el token es correcto al pasar por el middleware
router.get('/verify', auth, verify)

export default router;