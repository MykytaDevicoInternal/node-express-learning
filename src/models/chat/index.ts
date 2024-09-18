import { db } from '@/utils/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import {
  CreateChatArguments,
  GetChatsArguments,
  UpdateChatArguments,
} from './types'
import { EntityStatuses } from '@/utils/constants'

class ChatModel {
  constructor() {}

  async getChatById(id: string) {
    const query = `
      SELECT
        id, 
        title, 
        creator_id AS "creatorId", 
        create_at AS "createAt", 
        updated_at AS "updatedAt"
      FROM chats
      WHERE id = ? AND status = 1
    `

    const [rows] = await db.execute<RowDataPacket[]>(query, [id])

    return rows[0]
  }

  async getChatByIdAndUserId(id: string, userId: string) {
    const query = `
      SELECT 
        c.id, 
        c.title, 
        c.creator_id AS "creatorId", 
        c.create_at AS "createAt", 
        c.updated_at AS "updatedAt"
      FROM users_chats uc
      INNER JOIN chats c ON uc.chat_id = c.id AND uc.user_id = ?
      WHERE c.id = ? AND c.status = 1
    `

    const [rows] = await db.execute<RowDataPacket[]>(query, [userId, id])

    return rows[0]
  }

  async getChats({ where, pagination, order, userId }: GetChatsArguments) {
    let query = `
      SELECT 
        c.id, 
        c.title, 
        c.creator_id AS "creatorId", 
        c.create_at AS "createAt", 
        c.updated_at AS "updatedAt"
      FROM users_chats uc
      INNER JOIN chats c ON uc.chat_id = c.id AND uc.user_id = ?
    `

    const queryParams: (string | number)[] = []
    const whereClauses: string[] = []

    // Search only chat which user is a member of
    queryParams.push(userId)

    // Return only active chats
    whereClauses.push('status = 1')

    // Where
    if (where.title) {
      whereClauses.push(`title LIKE ?`)
      queryParams.push(`%${where.title}%`)
    }

    if (whereClauses.length) {
      query += `WHERE (${whereClauses.join(' AND ')})`
    }

    // Order
    const { field, direction } = order
    const formattedField: string = field

    query += ` ORDER BY ${formattedField} ${direction}`

    // Pagination
    const { page, size } = pagination
    const offset = (page - 1) * size

    query += ` LIMIT ${size} OFFSET ${offset}`

    const [rows] = await db.execute<RowDataPacket[]>(query, queryParams)

    return rows
  }

  async createChat({ title, creatorId }: CreateChatArguments) {
    const insertChatQuery = `
      INSERT INTO chats (title, creator_id) 
      VALUES(?, ?);
    `

    const [result] = await db.execute<ResultSetHeader>(insertChatQuery, [
      title,
      creatorId,
    ])

    const chatId = result.insertId

    await this.addUserToChat(chatId.toString(), creatorId)
    const chat = this.getChatById(chatId.toString())

    return chat
  }

  async deleteChat(id: string) {
    const query = `
      UPDATE chats SET status = ? WHERE id = ?;
    `

    await db.execute(query, [EntityStatuses.Removed, id])
  }

  async updateChat({ id, title }: UpdateChatArguments) {
    const query = `
      UPDATE chats
      SET title = COALESCE(?, title)
      WHERE id = ?
    `

    await db.execute(query, [title, id])

    // Potentially can get a version modified by another operation between the UPDATE and SELECT
    return await this.getChatById(id)
  }

  async addUserToChat(chatId: string, userId: string) {
    const query = `
      INSERT INTO users_chats (chat_id, user_id)
      VALUES (?, ?)
    `

    await db.execute(query, [chatId, userId])
  }
}

export default new ChatModel()
