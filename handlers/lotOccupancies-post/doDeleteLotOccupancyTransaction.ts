import type { RequestHandler } from 'express'

import { deleteLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/deleteLotOccupancyTransaction.js'

import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteLotOccupancyTransaction(
    request.body.lotOccupancyId,
    request.body.transactionIndex,
    request.session
  )

  const lotOccupancyTransactions = getLotOccupancyTransactions(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyTransactions
  })
}

export default handler
