import fs from 'fs'
import { RowDataPacket } from 'mysql2'
import { db } from '../src/utils/db'

const getPassedMigrations = async () => {
  const passedMigrations: string[] = []

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT migration_item FROM migrations ORDER BY migration_item'
    )

    if (rows.length) {
      passedMigrations.push(...rows.map((row) => row.migration_item))
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
          'CREATE TABLE IF NOT EXISTS migrations (migration_item VARCHAR(255) UNIQUE NOT NULL)'
        )
      }
    }
  }

  return passedMigrations
}

;(async () => {
  const migrations = fs.readdirSync('./migrations')

  const passedMigrations = await getPassedMigrations()

  const passedMigrationsSet = new Set(passedMigrations)
  const newMigrations = migrations.filter(
    (item) => !passedMigrationsSet.has(item)
  )

  if (!newMigrations.length) {
    console.log('New migrations not found')
    process.exit(0)
  }

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

      await db.execute('INSERT INTO migrations SET migration_item = ?', [
        migration,
      ])
      console.log('Migration executed successfully!')
    } catch (error) {
      console.error('Error executing migrations:', error)
    }
  }

  process.exit(0)
})()
