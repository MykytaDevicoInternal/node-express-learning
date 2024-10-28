import { Router, Request, Response } from 'express'
import { MessagesServices } from './messages.service'
import { HTTPStatusCodes } from '@/utils/constants'
import { UnauthorizedError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import {
  CreateMessageRequestType,
  MessagesRequestType,
  UpdateMessageRequestType,
} from '@/schemas/messageSchema'

const router = Router({ mergeParams: true })

export class MessageController {
  constructor(private messageService: MessagesServices) {}

  async getMessages(req: Request, res: Response) {
    const chatId = req.params.chatId
    const userId = req.userId

    logger.info(`GET /messages => chatId: ${chatId}`)
    logger.info(`GET /messages => userId: ${userId}`)
    logger.info(
      `GET /messages => query params: ${JSON.stringify(req.query, null, 2)}`
    )

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const messages = await this.messageService.getMessages(
      req.query as unknown as MessagesRequestType,
      userId,
      chatId
    )

    logger.info(
      `GET /messages => messages: ${JSON.stringify(messages, null, 2)}`
    )

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, messages)
  }

  async createMessage(
    req: Request<any, unknown, CreateMessageRequestType>,
    res: Response
  ) {
    const userId = req.userId
    const chatId = req.params.chatId

    logger.info(`POST /messages => userId: ${userId}`)
    logger.info(`POST /messages => chatId: ${chatId}`)
    logger.info(`POST /messages => body: ${JSON.stringify(req.body, null, 2)}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const createdMessage = await this.messageService.createMessage(
      req.body,
      userId,
      chatId
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

  async updateMessage(
    req: Request<any, unknown, UpdateMessageRequestType>,
    res: Response
  ) {
    const id = req.params.id
    const chatId = req.params.chatId
    const userId = req.userId

    logger.info(`PATCH /message/:id => id: ${id}`)
    logger.info(`PATCH /message/:id => id: ${chatId}`)
    logger.info(`PATCH /message/:id => userId: ${userId}`)
    logger.info(
      `PATCH /message/:id => body: ${JSON.stringify(req.body, null, 2)}`
    )

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const updatedMessage = await this.messageService.updateMessage(
      id,
      userId,
      chatId,
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

  async deleteMessage(req: Request, res: Response) {
    const id = req.params.id
    const chatId = req.params.chatId
    const userId = req.userId

    logger.info(`DELETE /messages/:id => params id: ${id}`)
    logger.info(`DELETE /messages/:id => params chatId: ${chatId}`)
    logger.info(`DELETE /messages/:id => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    await this.messageService.deleteMessage(id, userId, chatId)

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, {
      id,
    })
  }
}
