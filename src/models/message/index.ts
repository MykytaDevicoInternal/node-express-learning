import { db } from '@/utils/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import {
  CreateMessageArguments,
  GetMessageArguments,
  UpdateMessageArguments,
} from './types'
import { EntityStatuses } from '@/utils/constants'

class MessageModel {
  constructor() {}

  async getMessageById(id: string) {
    const query = `
      SELECT 
        id,
        text,
        chat_id AS "chatId",
        creator_id AS "creatorId",
        status,
        forwarded_chat_id AS "forwardedChatId",
        forwarded_from_user_id AS "forwardedFromUserId",
        replied_message_id AS "repliedMessageId"
      FROM messages
      WHERE id = ? AND status = 1
    `

    const [rows] = await db.execute<RowDataPacket[]>(query, [id])
    return rows[0]
  }

  async getMessageByIdAndUserId(id: string, userId: string) {
    const query = `
      SELECT 
        id,
        text,
        chat_id AS "chatId",
        creator_id AS "creatorId",
        status,
        forwarded_chat_id AS "forwardedChatId",
        forwarded_from_user_id AS "forwardedFromUserId",
        replied_message_id AS "repliedMessageId"
      FROM messages
      WHERE id = ? AND creator_id = ? AND status = 1
    `

    const [rows] = await db.execute<RowDataPacket[]>(query, [id, userId])
    return rows[0]
  }

  async getMessages({ where, pagination, order }: GetMessageArguments) {
    let query = `
        SELECT 
          m.id,
          m.text,
          m.chat_id AS "chatId",
          m.creator_id AS "creatorId",
          m.status,
          m.forwarded_chat_id AS "forwardedChatId",
          m.forwarded_from_user_id AS "forwardedFromUserId",
          m.replied_message_id AS "repliedMessageId",
          CONCAT(u.first_name, ' ', u.last_name) AS "userName"
        FROM messages m
        JOIN users u ON u.id = m.creator_id
      `

    const queryParams: (string | number)[] = []
    const whereClauses: string[] = []

    // Return only active messages
    whereClauses.push('status = 1')

    // Only search by provided chat id
    whereClauses.push(`chat_id = ?`)
    queryParams.push(where.chatId)

    if (where.text) {
      whereClauses.push(`text LIKE ?`)
      queryParams.push(`%${where.text}%`)
    }

    if (whereClauses.length) {
      query += `WHERE (${whereClauses.join(' AND ')})`
    }

    // Order
    const { field, direction } = order
    let formattedField: string = field

    if (field === 'createdAt') {
      formattedField = 'create_at'
    }

    query += ` ORDER BY ${formattedField} ${direction}`

    // Pagination
    const { page, size } = pagination
    const offset = (page - 1) * size

    query += ` LIMIT ${size} OFFSET ${offset}`

    const [rows] = await db.execute<RowDataPacket[]>(query, queryParams)

    return rows
  }

  async createMessage(data: CreateMessageArguments, userId: string) {
    const {
      text,
      chatId,
      forwardedChatId,
      forwardedFromUserId,
      repliedMessageId,
    } = data

    const query = `
      INSERT INTO messages (text, chat_id, forwarded_chat_id, forwarded_from_user_id, replied_message_id, creator_id)
      VALUES(?, ?, ?, ?, ?, ?)
    `

    const [result] = await db.execute<ResultSetHeader>(query, [
      text,
      chatId,
      forwardedChatId || null,
      forwardedFromUserId || null,
      repliedMessageId || null,
      userId,
    ])

    const messageId = result.insertId
    const message = await this.getMessageById(messageId.toString())

    return message
  }

  async deleteMessage(id: string) {
    const query = `
      UPDATE messages SET status = ? WHERE id = ?;
    `

    await db.execute(query, [EntityStatuses.Removed, id])
  }

  async updateMessage({ id, data }: UpdateMessageArguments) {
    const { text } = data

    const query = `
      UPDATE messages 
      SET 
        text = ? 
      WHERE id = ?
    `

    await db.execute(query, [text, id])

    // Potentially can get a version modified by another operation between the UPDATE and SELECT
    return await this.getMessageById(id)
  }
}

export default new MessageModel()
