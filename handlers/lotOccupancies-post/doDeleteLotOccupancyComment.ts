import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getLotOccupancyComments } from '../../database/getLotOccupancyComments.js'

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
