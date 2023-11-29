import type { Request, Response } from 'express'

import { cleanupDatabase } from '../../helpers/lotOccupancyDB/cleanupDatabase.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordCounts = await cleanupDatabase(request.session.user as User)

  response.json({
    success: true,
    inactivatedRecordCount: recordCounts.inactivatedRecordCount,
    purgedRecordCount: recordCounts.purgedRecordCount
  })
}

export default handler
