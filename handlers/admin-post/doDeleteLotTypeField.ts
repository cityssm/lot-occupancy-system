import type { RequestHandler } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteRecord(
    'LotTypeFields',
    request.body.lotTypeFieldId,
    request.session
  )

  const lotTypes = getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
