import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
if (args.length < 2 && !args[0]) {
  console.log('Please provide a name for new migration')
  process.exit(1)
}

;(async () => {
  const timestamp = Date.now()
  const migrationName = args[0]

  const migrationDirName = `${timestamp}_${migrationName.replace(' ', '_')}`
  const migrationDirPath = path.join('migrations', migrationDirName)

  fs.mkdirSync(migrationDirPath)
  fs.openSync(path.join(migrationDirPath, 'migration.sql'), 'w')
})()
