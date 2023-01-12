import type { RequestHandler } from 'express'

import { addLotTypeField } from '../../helpers/lotOccupancyDB/addLotTypeField.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const lotTypeFieldId = addLotTypeField(request.body, request.session)

  const lotTypes = getLotTypes()

  response.json({
    success: true,
    lotTypeFieldId,
    lotTypes
  })
}

export default handler
