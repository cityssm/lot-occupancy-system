import type { RequestHandler } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

import { getLotStatuses } from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteRecord(
    'LotStatuses',
    request.body.lotStatusId,
    request.session
  )

  const lotStatuses = getLotStatuses()

  response.json({
    success,
    lotStatuses
  })
}

export default handler
