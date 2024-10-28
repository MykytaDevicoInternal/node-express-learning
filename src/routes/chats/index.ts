import { Router } from 'express'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { requestValidation } from '@/middlewares/requestValidation'
import { asyncHandler } from '@/middlewares/asyncHandler'
import {
  addUserToChatParamsSchema,
  createChatSchema,
  deleteChatParamsSchema,
  getChatParamsSchema,
  getChatsQuerySchema,
  updateChatBodySchema,
  updateChatParamsSchema,
} from '@/schemas/chatSchema'

const chatsService = new ChatsService()
const chatController = new ChatsController(chatsService)

const router = Router()

router.get(
  '/',
  requestValidation(getChatsQuerySchema, 'query'),
  asyncHandler(chatController.getChats)
)

router.get(
  '/:id',
  requestValidation(getChatParamsSchema, 'params'),
  asyncHandler(chatController.getChat)
)

router.post(
  '/',
  requestValidation(createChatSchema, 'body'),
  asyncHandler(chatController.createChat)
)

router.patch(
  '/:id',
  requestValidation(updateChatBodySchema, 'body'),
  requestValidation(updateChatParamsSchema, 'params'),
  asyncHandler(chatController.updateChat)
)

router.delete(
  '/:id',
  requestValidation(deleteChatParamsSchema, 'params'),
  asyncHandler(chatController.deleteChat)
)

router.post(
  '/:chatId/users/:userId',
  requestValidation(addUserToChatParamsSchema, 'params'),
  asyncHandler(chatController.inviteUserToChat)
)

export default router
