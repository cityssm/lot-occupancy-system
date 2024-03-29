import type { Request, Response } from 'express'

import { getLotOccupancyComments } from '../../database/getLotOccupancyComments.js'
import { updateLotOccupancyComment } from '../../database/updateLotOccupancyComment.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancyComment(request.body, request.session.user as User)

  const lotOccupancyComments = await getLotOccupancyComments(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyComments
  })
}

export default handler
