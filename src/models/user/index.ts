import { db } from '@/utils/db'
import { CreateUserArgumentsType } from './types'
import { RowDataPacket } from 'mysql2'

class UserModel {
  constructor() {}

  async findOneById(id: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, email, first_name AS "firstName", last_name AS "lastName", password FROM users WHERE id = ?',
      [id]
    )

    return rows[0]
  }

  async findOneByEmail(email: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, email, first_name AS "firstName", last_name AS "lastName", password FROM users WHERE email = ?',
      [email]
    )

    return rows[0]
  }

  async createUser(data: CreateUserArgumentsType) {
    const { email, firstName, lastName, password } = data

    await db.execute(
      'INSERT INTO users (email, first_name, last_name, password) VALUES(?, ?, ?, ?)',
      [email, firstName, lastName, password]
    )
  }
}

export default new UserModel()
