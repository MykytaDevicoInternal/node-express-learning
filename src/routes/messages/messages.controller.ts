import { asyncHandler } from '@/middlewares/asyncHandler'
import { Router, Request, Response } from 'express'
import { MessagesServices } from './messages.service'
import { HTTPStatusCodes } from '@/utils/constants'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'
import { requestValidation } from '@/middlewares/requestValidation'
import { logger } from '@/utils/logger'
import {
  CreateMessageRequestType,
  createMessageSchema,
  deleteMessageSchema,
  getMessageSchema,
  getMessagesSchema,
  MessagesRequestType,
  updateMessageBodySchema,
  updateMessageParamsSchema,
  UpdateMessageRequestType,
} from '@/schemas/messageSchema'

const router = Router()

const messageService = new MessagesServices()

router.get(
  '/',
  requestValidation(getMessagesSchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId

    logger.info(
      `GET /messages => query params: ${JSON.stringify(req.query, null, 2)}`
    )
    logger.info(`GET /messages => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const messages = await messageService.getMessages(
      req.query as unknown as MessagesRequestType,
      userId
    )

    logger.info(
      `GET /messages => messages: ${JSON.stringify(messages, null, 2)}`
    )

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, messages)
  })
)

router.get(
  '/:id',
  requestValidation(getMessageSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const userId = req.userId

    logger.info(`GET /messages/:id => params id: ${id}`)
    logger.info(`GET /messages/:id => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const message = await messageService.getMessageById(id, userId)

    logger.info(
      `GET /messages/:id => chat: ${JSON.stringify(message, null, 2)}`
    )

    if (!message) {
      throw new NotFoundError('Message not found')
    }

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, { ...message })
  })
)

router.post(
  '/',
  requestValidation(createMessageSchema, 'body'),
  asyncHandler(
    async (
      req: Request<unknown, unknown, CreateMessageRequestType>,
      res: Response
    ) => {
      const userId = req.userId

      logger.info(
        `POST /messages => body: ${JSON.stringify(req.body, null, 2)}`
      )
      logger.info(`POST /messages => userId: ${userId}`)

      if (!userId) {
        throw new UnauthorizedError('Cannot identify authorized user')
      }

      const createdMessage = await messageService.createMessage(
        req.body,
        userId
      )

      logger.info(
        `POST /messages => createdMessage: ${JSON.stringify(
          createdMessage,
          null,
          2
        )}`
      )

      res.sendSuccessResponse(HTTPStatusCodes.Created, undefined, {
        ...createdMessage,
      })
    }
  )
)

router.patch(
  '/:id',
  requestValidation(updateMessageBodySchema, 'body'),
  requestValidation(updateMessageParamsSchema, 'params'),
  asyncHandler(
    async (
      req: Request<any, unknown, UpdateMessageRequestType>,
      res: Response
    ) => {
      const id = req.params.id
      const userId = req.userId

      logger.info(`PATCH /message/:id => id: ${id}`)
      logger.info(
        `PATCH /message/:id => body: ${JSON.stringify(req.body, null, 2)}`
      )
      logger.info(`PATCH /message/:id => userId: ${userId}`)

      if (!userId) {
        throw new UnauthorizedError('Cannot identify authorized user')
      }

      const updatedMessage = await messageService.updateMessage(
        id,
        userId,
        req.body
      )

      logger.info(
        `PATCH /message/:id => updatedChat: ${JSON.stringify(
          updatedMessage,
          null,
          2
        )}`
      )

      res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, {
        ...updatedMessage,
      })
    }
  )
)

router.delete(
  '/:id',
  requestValidation(deleteMessageSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const userId = req.userId

    logger.info(`DELETE /messages/:id => params id: ${id}`)
    logger.info(`DELETE /messages/:id => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    await messageService.deleteMessage(id, userId)

    res.sendSuccessResponse(HTTPStatusCodes.NoContent, undefined, {
      id,
    })
  })
)

export default router
