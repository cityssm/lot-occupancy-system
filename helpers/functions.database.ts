import fs from 'node:fs/promises'

import {
  backupFolder,
  lotOccupancyDB as databasePath
} from '../data/databasePaths.js'

export const backupDatabase = async (): Promise<string | false> => {
  const databasePathSplit = databasePath.split(/[/\\]/g)

  const backupDatabasePath = `${backupFolder}/${databasePathSplit.at(-1)}.${Date.now().toString()}`

  try {
    await fs.copyFile(databasePath, backupDatabasePath)
    return backupDatabasePath
  } catch {
    return false
  }
}
