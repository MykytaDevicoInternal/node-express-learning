import { Router } from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'

import authRouter from './auth/auth.controller'
import chatsRouter from './chats/chats.controller'
import messagesRouter from './messages/messages.controller'

const router = Router({ mergeParams: true })

router.use('/auth', authRouter)
router.use('/chats', authMiddleware, chatsRouter)
router.use('/chats/:chatId/messages', authMiddleware, messagesRouter)

export default router
