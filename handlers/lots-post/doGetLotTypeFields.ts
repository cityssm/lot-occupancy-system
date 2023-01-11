import type { RequestHandler } from 'express'

import { getLotTypeById } from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const lotType = getLotTypeById(Number.parseInt(request.body.lotTypeId, 10))!

  response.json({
    lotTypeFields: lotType.lotTypeFields
  })
}

export default handler
