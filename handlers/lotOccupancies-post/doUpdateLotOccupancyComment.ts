import type { RequestHandler } from 'express'

import { updateLotOccupancyComment } from '../../helpers/lotOccupancyDB/updateLotOccupancyComment.js'

import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js'

export const handler: RequestHandler = (request, response) => {
  const success = updateLotOccupancyComment(request.body, request.session)

  const lotOccupancyComments = getLotOccupancyComments(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyComments
  })
}

export default handler
