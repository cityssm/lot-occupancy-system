import type { Request, Response } from 'express'

import { getLotOccupancyTransactions } from '../../database/getLotOccupancyTransactions.js'
import { updateLotOccupancyTransaction } from '../../database/updateLotOccupancyTransaction.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await updateLotOccupancyTransaction(request.body, request.session.user as User)

  const lotOccupancyTransactions = await getLotOccupancyTransactions(
    request.body.lotOccupancyId,
    { includeIntegrations: true }
  )

  response.json({
    success: true,
    lotOccupancyTransactions
  })
}

export default handler
