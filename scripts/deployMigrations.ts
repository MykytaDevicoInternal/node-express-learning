import fs from 'fs'
import { RowDataPacket } from 'mysql2'
import { db } from '../src/utils/db'

const getLatestMigrationName = async () => {
  let latestMigration: string = ''

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT latest FROM migration'
    )

    if (rows.length) {
      latestMigration = rows[0].latest
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'sqlState' in error
    ) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await db.query(
          'CREATE TABLE IF NOT EXISTS migration (latest TEXT NOT NULL)'
        )

        const [rows] = await db.query<RowDataPacket[]>(
          'SELECT latest FROM migration'
        )

        if (rows.length) {
          latestMigration = rows[0].latest
        }
      }
    }
  }

  return latestMigration
}

;(async () => {
  const migrations = fs.readdirSync('./migrations')
  const latestMigration = await getLatestMigrationName()

  const newMigrations = latestMigration
    ? migrations.filter((m) => m > latestMigration)
    : migrations

  if (!newMigrations.length) {
    console.log('New migrations not found')
    process.exit(0)
  }

  let newLastMigrationName: string = ''

  for (const migration of newMigrations) {
    console.log('Run migration: ', migration)
    try {
      const sql = fs.readFileSync(
        `migrations/${migration}/migration.sql`,
        'utf-8'
      )

      const statements = sql.split(/;\s*$/m) // Split by semicolon

      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Run statement: ', statement)
          await db.query<RowDataPacket[]>(statement)
        }
      }

      console.log('Migration executed successfully!')
      newLastMigrationName = migration
    } catch (error) {
      console.error('Error executing migrations:', error)
    }
  }

  if (newLastMigrationName) {
    await db.execute('UPDATE migration SET latest = ?', [newLastMigrationName])
    console.log('New latest migration name: ', newLastMigrationName)
  }

  process.exit(0)
})()
