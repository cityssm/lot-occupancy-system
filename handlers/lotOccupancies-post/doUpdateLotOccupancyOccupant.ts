import type { RequestHandler } from 'express'

import { updateLotOccupancyOccupant } from '../../helpers/lotOccupancyDB/updateLotOccupancyOccupant.js'

import { getLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js'

export const handler: RequestHandler = (request, response) => {
  const success = updateLotOccupancyOccupant(request.body, request.session)

  const lotOccupancyOccupants = getLotOccupancyOccupants(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyOccupants
  })
}

export default handler
