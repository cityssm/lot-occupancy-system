import type { Request, Response } from 'express'
import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'Maps',
    request.body.mapId,
    request.session
  )

  response.json({
    success
  })

  response.on('finish', () => {
    clearNextPreviousLotIdCache(-1)
  })
}

export default handler
