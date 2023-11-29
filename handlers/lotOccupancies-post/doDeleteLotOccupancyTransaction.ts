import type { Request, Response } from 'express'

import { deleteLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/deleteLotOccupancyTransaction.js'
import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteLotOccupancyTransaction(
    request.body.lotOccupancyId,
    request.body.transactionIndex,
    request.session.user as User
  )

  const lotOccupancyTransactions = await getLotOccupancyTransactions(
    request.body.lotOccupancyId,
    { includeIntegrations: true }
  )

  response.json({
    success,
    lotOccupancyTransactions
  })
}

export default handler
