import { Request, Response } from 'express'
import { ChatsService } from './chats.service'
import { HTTPStatusCodes } from '@/utils/constants'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'
import {
  ChatsRequestType,
  CreateChatRequestType,
  UpdateChatRequestType,
} from '@/schemas/chatSchema'
import { logger } from '@/utils/logger'

export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  async getChats(req: Request, res: Response) {
    logger.info(
      `GET /chats => query params: ${JSON.stringify(req.query, null, 2)}`
    )

    const userId = req.userId

    logger.info(`GET /chats => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const chats = await this.chatsService.getChats(
      req.query as unknown as ChatsRequestType,
      userId
    )

    logger.info(`GET /chats => chats: ${JSON.stringify(chats, null, 2)}`)

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, chats)
  }

  async getChat(req: Request, res: Response) {
    const id = req.params.id
    const userId = req.userId

    logger.info(`GET /chats/:id => params id: ${id}`)
    logger.info(`GET /chats/:id => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const chat = await this.chatsService.getChatById(id, userId)

    logger.info(`GET /chats/:id => chat: ${JSON.stringify(chat, null, 2)}`)

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, { ...chat })
  }

  async createChat(
    req: Request<unknown, unknown, CreateChatRequestType>,
    res: Response
  ) {
    const userId = req.userId

    logger.info(`POST /chats => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const createdChat = await this.chatsService.createChat({
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

  async updateChat(
    req: Request<any, unknown, UpdateChatRequestType>,
    res: Response
  ) {
    const id = req.params.id
    const userId = req.userId

    logger.info(`PATCH /chats => id: ${id}`)
    logger.info(`PATCH /chats => body: ${JSON.stringify(req.body, null, 2)}`)
    logger.info(`PATCH /chats => userId: ${userId}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    const updatedChat = await this.chatsService.updateChat(id, userId, req.body)

    logger.info(
      `PATCH /chats => updatedChat: ${JSON.stringify(updatedChat, null, 2)}`
    )

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, {
      ...updatedChat,
    })
  }

  async deleteChat(req: Request, res: Response) {
    const id = req.params.id
    const userId = req.userId

    logger.info(`DELETE /chats/:id => params id: ${id}`)

    if (!userId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    await this.chatsService.deleteChat(id, userId)

    res.sendSuccessResponse(HTTPStatusCodes.Ok, undefined, {
      id,
    })
  }

  async inviteUserToChat(req: Request, res: Response) {
    const chatId = req.params.chatId
    const userId = req.params.userId
    const issuerUserId = req.userId

    logger.info(`POST /:chatId/users/:userId => params chatId: ${chatId}`)
    logger.info(`POST /:chatId/users/:userId => params userId: ${userId}`)
    logger.info(`POST /:chatId/users/:userId => issuerUserId: ${issuerUserId}`)

    if (!issuerUserId) {
      throw new UnauthorizedError('Cannot identify authorized user')
    }

    await this.chatsService.addUserToChat(chatId, userId, issuerUserId)

    res.sendSuccessResponse(
      HTTPStatusCodes.Ok,
      'User successfully added to chat',
      { chatId }
    )
  }
}
