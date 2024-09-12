import { db } from '@/utils/db'
import { RowDataPacket } from 'mysql2'

class UserTokens {
  constructor() {}

  async findOneByUserId(userId: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, user_id AS "userId", refresh_token AS "refreshToken" FROM user_tokens WHERE user_id = ?',
      [userId]
    )

    return rows[0]
  }

  async addRefreshToken(userId: string, refreshToken: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT user_id AS "userId" FROM user_tokens WHERE user_id = ?',
      [userId]
    )

    const userToken = rows[0]

    if (!userToken) {
      await db.execute<RowDataPacket[]>(
        'INSERT INTO user_tokens (user_id, refresh_token) VALUES(?, ?)',
        [userId, refreshToken]
      )
    } else {
      await db.execute<RowDataPacket[]>(
        'UPDATE user_tokens SET refresh_token = ? WHERE user_id = ?',
        [refreshToken, userId]
      )
    }
  }
}

export default new UserTokens()
