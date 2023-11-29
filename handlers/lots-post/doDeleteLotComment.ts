import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getLotComments } from '../../database/getLotComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotComments',
    request.body.lotCommentId,
    request.session.user as User
  )

  const lotComments = await getLotComments(request.body.lotId)

  response.json({
    success,
    lotComments
  })
}

export default handler
