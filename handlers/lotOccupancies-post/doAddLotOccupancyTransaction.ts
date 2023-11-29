import type { Request, Response } from 'express'

import { addLotOccupancyTransaction } from '../../database/addLotOccupancyTransaction.js'
import { getLotOccupancyTransactions } from '../../database/getLotOccupancyTransactions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyTransaction(request.body, request.session.user as User)

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
