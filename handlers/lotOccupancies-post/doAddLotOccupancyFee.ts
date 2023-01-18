import type { Request, Response } from 'express'

import { addLotOccupancyFee } from '../../helpers/lotOccupancyDB/addLotOccupancyFee.js'

import { getLotOccupancyFees } from '../../helpers/lotOccupancyDB/getLotOccupancyFees.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyFee(request.body, request.session)

  const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId)

  response.json({
    success: true,
    lotOccupancyFees
  })
}

export default handler
