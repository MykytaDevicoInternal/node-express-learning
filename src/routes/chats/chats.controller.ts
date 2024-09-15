import { asyncHandler } from '@/middlewares/asyncHandler'
import { Router, Request, Response } from 'express'
import { ChatsService } from './chats.service'
import { HTTPStatusCodes } from '@/utils/constants'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'
import { requestValidation } from '@/middlewares/requestValidation'
import {
  ChatsRequestType,
  CreateChatRequestType,
  createChatSchema,
  deleteChatParamsSchema,
  getChatParamsSchema,
  getChatsQuerySchema,
  updateChatParamsSchema,
  UpdateChatRequestType,
  updateChatBodySchema,
} from '@/schemas/chatSchema'
import { logger } from '@/utils/logger'

const router = Router()

const chatsService = new ChatsService()

router.get(
  '/',
  requestValidation(getChatsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    logger.info(
      `GET /chats => query params: ${JSON.stringify(req.query, null, 2)}`
    )

    const chats = await chatsService.getChats(
      req.query as unknown as ChatsRequestType
    )

    logger.info(`GET /chats => chats: ${JSON.stringify(chats, null, 2)}`)

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, chats)
  })
)

router.get(
  '/:id',
  requestValidation(getChatParamsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    logger.info(`GET /chats/:id => params id: ${id}`)

    const chat = await chatsService.getChatById(id)

    logger.info(`GET /chats/:id => chat: ${JSON.stringify(chat, null, 2)}`)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, { ...chat })
  })
)

router.post(
  '/',
  requestValidation(createChatSchema, 'body'),
  asyncHandler(
    async (
      req: Request<unknown, unknown, CreateChatRequestType>,
      res: Response
    ) => {
      const userId = req.userId

      logger.info(`POST /chats => userId: ${userId}`)

      if (!userId) {
        throw new UnauthorizedError('Cannot identify authorized user')
      }

      const createdChat = await chatsService.createChat({
        ...req.body,
        creatorId: userId,
      })

      logger.info(
        `POST /chats => createdChat: ${JSON.stringify(createdChat, null, 2)}`
      )

      res.sendSuccessResponse(HTTPStatusCodes.Created, undefined, {
        ...createdChat,
      })
    }
  )
)

router.patch(
  '/:id',
  requestValidation(updateChatBodySchema, 'body'),
  requestValidation(updateChatParamsSchema, 'params'),
  asyncHandler(
    async (
      req: Request<any, unknown, UpdateChatRequestType>,
      res: Response
    ) => {
      const id = req.params.id
      const userId = req.userId

      logger.info(`PATCH /chats => id: ${id}`)
      logger.info(`PATCH /chats => body: ${JSON.stringify(req.body, null, 2)}`)
      logger.info(`PATCH /chats => userId: ${userId}`)

      if (!userId) {
        throw new UnauthorizedError('Cannot identify authorized user')
      }

      const updatedChat = await chatsService.updateChat(id, userId, req.body)

      logger.info(
        `PATCH /chats => updatedChat: ${JSON.stringify(updatedChat, null, 2)}`
      )

      res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, {
        ...updatedChat,
      })
    }
  )
)

router.delete(
  '/:id',
  requestValidation(deleteChatParamsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    logger.info(`DELETE /chats/:id => params id: ${id}`)

    await chatsService.deleteChat(id)

    res.sendSuccessResponse(HTTPStatusCodes.NoContent, undefined, {
      id,
    })
  })
)

export default router
