import type { RequestHandler } from 'express'

import { getLotOccupancies } from '../../helpers/lotOccupancyDB/getLotOccupancies.js'

export const handler: RequestHandler = (request, response) => {
  const result = getLotOccupancies(request.body, {
    limit: request.body.limit,
    offset: request.body.offset,
    includeOccupants: true
  })

  response.json({
    count: result.count,
    offset: Number.parseInt(request.body.offset, 10),
    lotOccupancies: result.lotOccupancies
  })
}

export default handler
