import type { Request, Response } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotOccupancyComments',
    request.body.lotOccupancyCommentId,
    request.session.user as User
  )

  const lotOccupancyComments = await getLotOccupancyComments(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyComments
  })
}

export default handler
