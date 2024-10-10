import MessageModel from '../../models/message'
import ChatModel from '../../models/chat'
import {
  CreateMessageRequestType,
  MessagesRequestType,
  UpdateMessageRequestType,
} from '@/schemas/messageSchema'
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import { isObjectEmpty } from '@/utils/helpers'

export class MessagesServices {
  constructor() {}

  messageModel = MessageModel
  chatModel = ChatModel

  async getMessages(
    query: MessagesRequestType,
    userId: string,
    chatId: string
  ) {
    const chat = await this.chatModel.getChatByIdAndUserId(chatId, userId)
    logger.info(
      `MessagesServices.getMessages > chat: ${JSON.stringify(chat, null, 2)}`
    )

    if (!chat || isObjectEmpty(chat)) {
      throw new ForbiddenError(
        'You cannot post message in chat which you are not member of'
      )
    }

    const where = {
      text: query.text,
      chatId: chatId,
    }

    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      size: query.size ? parseInt(query.size) : 10,
    }

    const order = {
      field: query.field || 'createdAt',
      direction: query.direction || 'ASC',
    }

    return this.messageModel.getMessages({ where, pagination, order })
  }

  async createMessage(
    data: CreateMessageRequestType,
    userId: string,
    chatId: string
  ) {
    const { forwardedChatId, forwardedFromUserId, repliedMessageId } = data

    const chat = await this.chatModel.getChatByIdAndUserId(chatId, userId)

    if (isObjectEmpty(chat)) {
      throw new ForbiddenError(
        'You cannot post message in chat which you are not member of'
      )
    }

    if (forwardedChatId) {
      if (!forwardedFromUserId) {
        throw new BadRequestError('forwardedFromUserId is required')
      }

      const forwardedChat = await this.chatModel.getChatByIdAndUserId(
        forwardedChatId,
        userId
      )

      if (!forwardedChat || isObjectEmpty(forwardedChat)) {
        throw new ForbiddenError(
          'You cannot forward message from chat which you are not member of'
        )
      }

      const forwardedChatOfForwardUser =
        await this.chatModel.getChatByIdAndUserId(
          forwardedChatId,
          forwardedFromUserId
        )

      if (
        !forwardedChatOfForwardUser ||
        isObjectEmpty(forwardedChatOfForwardUser)
      ) {
        throw new ForbiddenError(
          'Forwarded from user is not a member of the forwarded chat'
        )
      }
    }

    if (repliedMessageId) {
      const repliedMessage = await this.messageModel.getMessageById(
        repliedMessageId
      )

      if (!repliedMessage || isObjectEmpty(repliedMessage)) {
        throw new NotFoundError('Cannot find replied message by provided id')
      }

      if (repliedMessage.chatId !== chat.id) {
        throw new ForbiddenError('Replied message must be from the same chat')
      }
    }

    return await this.messageModel.createMessage({ ...data, chatId }, userId)
  }

  async deleteMessage(id: string, userId: string, chatId: string) {
    const chat = await this.chatModel.getChatByIdAndUserId(chatId, userId)

    if (!chat) {
      throw new ForbiddenError(
        'You cannot update message in chat which you are not member of'
      )
    }

    const message = await this.messageModel.getMessageById(id)

    if (!message) {
      throw new NotFoundError('Cannot find message by provided id')
    }

    if (message.chatId !== chat.id) {
      throw new ForbiddenError(
        'You cannot update message in chat which you are not member of'
      )
    }

    if (message.creatorId !== userId) {
      throw new ForbiddenError('You can delete only your messages')
    }

    await this.messageModel.deleteMessage(id)
  }

  async updateMessage(
    id: string,
    userId: string,
    chatId: string,
    data: UpdateMessageRequestType
  ) {
    const chat = await this.chatModel.getChatByIdAndUserId(chatId, userId)

    if (!chat) {
      throw new ForbiddenError(
        'You cannot update message in chat which you are not member of'
      )
    }

    const message = await this.messageModel.getMessageById(id)

    if (!message) {
      throw new NotFoundError('There is no message by provided id')
    }

    if (message.chatId !== chat.id) {
      throw new ForbiddenError(
        'You cannot update message in chat which you are not member of'
      )
    }

    if (message.creatorId !== userId) {
      throw new ForbiddenError(
        'You cannot update message you are not creator of'
      )
    }

    return await this.messageModel.updateMessage({ id, data })
  }
}
