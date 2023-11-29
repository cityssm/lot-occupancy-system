import type { Request, Response } from 'express'

import { addLotOccupancyComment } from '../../helpers/lotOccupancyDB/addLotOccupancyComment.js'
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyComment(request.body, request.session.user as User)

  const lotOccupancyComments = await getLotOccupancyComments(
    request.body.lotOccupancyId
  )

  response.json({
    success: true,
    lotOccupancyComments
  })
}

export default handler
