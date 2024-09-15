import { Router } from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'

import authRouter from './auth/auth.controller'
import chatsRouter from './chats/chats.controller'

const router = Router()

router.use('/auth', authRouter)
router.use('/chats', authMiddleware, chatsRouter)

export default router
