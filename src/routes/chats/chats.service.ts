import {
  ChatsRequestType,
  CreateChatRequestType,
  UpdateChatRequestType,
} from '@/schemas/chatSchema'
import ChatModel from '../../models/chat'
import UserModel from '../../models/user'
import { ForbiddenError, NotFoundError } from '@/utils/errors'
import { logger } from '@/utils/logger'

export class ChatsService {
  chatModel = ChatModel
  userModel = UserModel

  constructor() {}

  async getChatById(id: string, userId: string) {
    return this.chatModel.getChatByIdAndUserId(id, userId)
  }

  async getChats(query: ChatsRequestType, userId: string) {
    const where = {
      title: query.title,
      userId,
    }

    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      size: query.size ? parseInt(query.size) : 10,
    }

    const order = {
      field: query.field || 'title',
      direction: query.direction || 'ASC',
    }

    return this.chatModel.getChats({ where, pagination, order, userId })
  }

  async createChat(data: CreateChatRequestType & { creatorId: string }) {
    const { title, creatorId } = data

    const user = await this.userModel.findOneById(creatorId)

    if (!user) {
      throw new NotFoundError('There is no user by provided id')
    }

    return await this.chatModel.createChat({ title, creatorId })
  }

  async deleteChat(id: string, creatorId: string) {
    const chat = await this.chatModel.getChatById(id)

    if (!chat) {
      throw new NotFoundError('There is chat by provided id')
    }

    if (chat.creatorId !== creatorId) {
      throw new ForbiddenError('Only chat creator can delete chat')
    }

    await this.chatModel.deleteChat(id)
  }

  async updateChat(id: string, creatorId: string, data: UpdateChatRequestType) {
    const { title } = data

    const chat = await this.chatModel.getChatById(id)

    logger.info(
      `ChatService.updateChat => getChatById result: ${JSON.stringify(
        chat,
        null,
        2
      )}`
    )

    if (!chat) {
      throw new NotFoundError('There is chat by provided id')
    }

    if (chat.creatorId !== creatorId) {
      throw new ForbiddenError('Only chat creator can modify chat')
    }

    return await this.chatModel.updateChat({ id, title })
  }

  async addUserToChat(chatId: string, userId: string, issuerUserId: string) {
    const chat = await this.chatModel.getChatById(chatId)
    const user = await this.userModel.findOneById(userId)

    if (!chat) {
      throw new NotFoundError('There is chat by provided id')
    }

    if (!user) {
      throw new NotFoundError('There is no user by provided id')
    }

    if (chat.creatorId !== issuerUserId) {
      throw new ForbiddenError('Only chat creator can add new users to chat')
    }

    await this.chatModel.addUserToChat(chatId, userId)
  }
}
