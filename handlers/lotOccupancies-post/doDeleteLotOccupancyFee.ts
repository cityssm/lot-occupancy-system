import type { Request, Response } from 'express'

import { deleteLotOccupancyFee } from '../../helpers/lotOccupancyDB/deleteLotOccupancyFee.js'

import { getLotOccupancyFees } from '../../helpers/lotOccupancyDB/getLotOccupancyFees.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteLotOccupancyFee(
    request.body.lotOccupancyId,
    request.body.feeId,
    request.session
  )

  const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId)

  response.json({
    success,
    lotOccupancyFees
  })
}

export default handler
