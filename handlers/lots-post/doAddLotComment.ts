import type { Request, Response } from 'express'

import { addLotComment } from '../../helpers/lotOccupancyDB/addLotComment.js'

import { getLotComments } from '../../helpers/lotOccupancyDB/getLotComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotComment(request.body, request.session)

  const lotComments = await getLotComments(request.body.lotId)

  response.json({
    success: true,
    lotComments
  })
}

export default handler
