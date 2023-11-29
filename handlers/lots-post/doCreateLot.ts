import type { Request, Response } from 'express'

import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js'
import { addLot } from '../../helpers/lotOccupancyDB/addLot.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = await addLot(request.body, request.session.user as User)

  response.json({
    success: true,
    lotId
  })

  response.on('finish', () => {
    clearNextPreviousLotIdCache(-1)
  })
}

export default handler
