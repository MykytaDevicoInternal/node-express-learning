import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_USER, DB_PASSWORD, DATABASE } = process.env

export const db = mysql.createPool({
  host: DB_HOST || 'localhost',
  user: DB_USER || 'root',
  password: DB_PASSWORD || 'root',
  database: DATABASE || 'local',
})
