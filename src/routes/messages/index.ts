import { Router } from 'express'
import { MessageController } from './messages.controller'
import { MessagesServices } from './messages.service'
import { requestValidation } from '@/middlewares/requestValidation'
import { asyncHandler } from '@/middlewares/asyncHandler'
import {
  createMessageBodySchema,
  deleteMessageSchema,
  getMessagesBodySchema,
  updateMessageBodySchema,
  updateMessageParamsSchema,
  createMessageParamsSchema,
  getMessagesParamsSchema,
} from '@/schemas/messageSchema'

const chatsService = new MessagesServices()
const messageController = new MessageController(chatsService)

const router = Router()

router.get(
  '/',
  requestValidation(getMessagesBodySchema, 'query'),
  requestValidation(getMessagesParamsSchema, 'params'),
  asyncHandler(messageController.getMessages)
)

router.post(
  '/',
  requestValidation(createMessageBodySchema, 'body'),
  requestValidation(createMessageParamsSchema, 'params'),
  asyncHandler(messageController.createMessage)
)

router.patch(
  '/:id',
  requestValidation(updateMessageBodySchema, 'body'),
  requestValidation(updateMessageParamsSchema, 'params'),
  asyncHandler(messageController.updateMessage)
)

router.delete(
  '/:id',
  requestValidation(deleteMessageSchema, 'params'),
  asyncHandler(messageController.deleteMessage)
)

export default router
