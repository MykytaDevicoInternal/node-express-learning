import { Router } from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'

import authRouter from './auth/auth.controller'
import chatRouter from './chats/index'
import messagesRouter from './messages/index'

const router = Router({ mergeParams: true })

router.use('/auth', authRouter)
router.use('/chats', authMiddleware, chatRouter)
router.use('/chats/:chatId/messages', authMiddleware, messagesRouter)

export default router
