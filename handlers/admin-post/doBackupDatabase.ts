import type { Request, Response } from 'express'

import { backupDatabase } from '../../helpers/functions.database.js'

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const backupDatabasePath = await backupDatabase()

  if (typeof backupDatabasePath === 'string') {
    const backupDatabasePathSplit = backupDatabasePath.split(/[/\\]/g)

    const fileName = backupDatabasePathSplit.at(-1)

    response.json({
      success: true,
      fileName
    })
  } else {
    response.json({
      success: false,
      errorMessage: 'Unable to write backup file.'
    })
  }
}
