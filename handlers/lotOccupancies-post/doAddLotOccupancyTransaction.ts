import type { Request, Response } from 'express'

import { addLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/addLotOccupancyTransaction.js'

import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyTransaction(request.body, request.session)

  const lotOccupancyTransactions = await getLotOccupancyTransactions(
    request.body.lotOccupancyId
  )

  response.json({
    success: true,
    lotOccupancyTransactions
  })
}

export default handler
