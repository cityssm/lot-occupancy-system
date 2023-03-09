import type { Request, Response } from 'express'

import { updateLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/updateLotOccupancyTransaction.js'

import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await updateLotOccupancyTransaction(request.body, request.session)

  const lotOccupancyTransactions = await getLotOccupancyTransactions(
    request.body.lotOccupancyId
  )

  response.json({
    success: true,
    lotOccupancyTransactions
  })
}

export default handler
