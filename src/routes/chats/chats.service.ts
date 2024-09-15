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

  async getChatById(id: string) {
    return this.chatModel.getChatById(id)
  }

  async getChats(query: ChatsRequestType) {
    const where = {
      title: query.title,
      creatorId: query.creatorId,
    }

    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      size: query.size ? parseInt(query.size) : 10,
    }

    const order = {
      field: query.field || 'title',
      direction: query.direction || 'ASC',
    }

    return this.chatModel.getChats({ where, pagination, order })
  }

  async createChat(data: CreateChatRequestType & { creatorId: string }) {
    const { title, creatorId } = data

    const user = await this.userModel.findOneById(creatorId)

    if (!user) {
      throw new NotFoundError('There is no user by provided id')
    }

    return await this.chatModel.createChat({ title, creatorId })
  }

  async deleteChat(id: string) {
    await this.chatModel.deleteChat(id)
  }

  async updateChat(id: string, creatorId: string, data: UpdateChatRequestType) {
    const { title } = data

    const chat = await this.getChatById(id)

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
}
