import { db } from '@/utils/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import {
  CreateChatArguments,
  GetChatsArguments,
  UpdateChatArguments,
} from './types'

class ChatModel {
  constructor() {}

  async getChatById(id: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, title, creator_id AS "creatorId", create_at AS "createAt", updated_at AS "updatedAt" FROM chats WHERE id = ?',
      [id]
    )

    return rows[0]
  }

  async getChats({ where, pagination, order }: GetChatsArguments) {
    let query = `
      SELECT 
        id, 
        title, 
        creator_id AS "creatorId", 
        create_at AS "createAt", 
        updated_at AS "updatedAt" 
      FROM chats
    `

    const queryParams: (string | number)[] = []

    if (where) {
      const whereClauses: string[] = []

      if (where.title) {
        whereClauses.push(`title LIKE ?`)
        queryParams.push(`%${where.title}%`)
      }

      if (where.creatorId) {
        whereClauses.push(`creator_id = ?`)
        queryParams.push(where.creatorId)
      }

      if (whereClauses.length) {
        query += `WHERE (${whereClauses.join(' AND ')})`
      }
    }

    // Order
    const { field, direction } = order
    let formattedField: string = field

    if (field === 'creatorId') {
      formattedField = 'creator_id'
    }

    query += ` ORDER BY ${formattedField} ${direction}`

    // Pagination
    const { page, size } = pagination
    const offset = (page - 1) * size

    query += ` LIMIT ${size} OFFSET ${offset}`

    const [rows] = await db.execute<RowDataPacket[]>(query, queryParams)

    return rows
  }

  async createChat({ title, creatorId }: CreateChatArguments) {
    const query = `
      INSERT INTO chats (title, creator_id) 
      VALUES(?, ?);
    `

    const [result] = await db.execute<ResultSetHeader>(query, [
      title,
      creatorId,
    ])

    const chatId = result.insertId
    const chat = this.getChatById(chatId.toString())

    return chat
  }

  async deleteChat(id: string) {
    const query = `
      DELETE FROM chats WHERE id = ?;
    `

    await db.execute(query, [id])
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
}

export default new ChatModel()
