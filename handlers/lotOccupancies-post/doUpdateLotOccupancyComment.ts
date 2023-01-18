import type { Request, Response } from 'express'

import { updateLotOccupancyComment } from '../../helpers/lotOccupancyDB/updateLotOccupancyComment.js'

import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancyComment(request.body, request.session)

  const lotOccupancyComments = await getLotOccupancyComments(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyComments
  })
}

export default handler
