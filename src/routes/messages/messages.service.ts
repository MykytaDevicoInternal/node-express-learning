import MessageModel from '../../models/message'
import ChatModel from '../../models/chat'
import {
  CreateMessageRequestType,
  MessagesRequestType,
  UpdateMessageRequestType,
} from '@/schemas/messageSchema'
import { ForbiddenError, NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { isObjectEmpty } from '@/utils/helpers'

export class MessagesServices {
  constructor() {}

  messageModel = MessageModel
  chatModel = ChatModel

  async getMessageById(id: string, userId: string) {
    const chat = await this.chatModel.getChatByMessageAndUserIds(id, userId)

    logger.info(`getMessageById => chat: ${JSON.stringify(chat, null, 2)}`)

    if (!chat?.id) {
      throw new ForbiddenError('User can get messages only from joined chats')
    }

    return this.messageModel.getMessageById(id)
  }

  async getMessages(query: MessagesRequestType, userId: string) {
    if (query.chatId) {
      const chat = await this.chatModel.getChatByIdAndUserId(
        query.chatId,
        userId
      )
      logger.info(
        `messagesService.getMessages => chat: ${JSON.stringify(chat, null, 2)}`
      )

      if (isObjectEmpty(chat)) {
        throw new ForbiddenError(
          'You can get messages only from chats you are member of'
        )
      }
    }

    const where = {
      text: query.text,
      chatId: query.chatId,
    }

    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      size: query.size ? parseInt(query.size) : 10,
    }

    const order = {
      field: query.field || 'createdAt',
      direction: query.direction || 'ASC',
    }

    return this.messageModel.getMessages({ where, pagination, order, userId })
  }

  async createMessage(data: CreateMessageRequestType, userId: string) {
    const { chatId } = data

    const chat = this.chatModel.getChatByIdAndUserId(chatId, userId)

    if (!chat) {
      throw new ForbiddenError(
        'You cannot post message in chat which you are not member of'
      )
    }

    return await this.messageModel.createMessage(data, userId)
  }

  async deleteMessage(id: string, userId: string) {
    const message = await this.messageModel.getMessageById(id)

    if (!message) {
      throw new NotFoundError('Cannot find message by provided id')
    }

    if (message.creatorId !== userId) {
      throw new ForbiddenError('You can delete only your messages')
    }

    await this.messageModel.deleteMessage(id)
  }

  async updateMessage(
    id: string,
    userId: string,
    data: UpdateMessageRequestType
  ) {
    const message = this.chatModel.getChatByIdAndUserId(id, userId)

    if (!message) {
      throw new NotFoundError('Cannot found provided message for this user')
    }

    return await this.messageModel.updateMessage({ id, data })
  }
}
