import type { Request, Response } from 'express'

import { getLotComments } from '../../database/getLotComments.js'
import { updateLotComment } from '../../database/updateLotComment.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotComment(request.body, request.session.user as User)

  const lotComments = await getLotComments(request.body.lotId)

  response.json({
    success,
    lotComments
  })
}

export default handler
