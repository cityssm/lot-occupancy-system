import type { RequestHandler } from 'express'

import {
  moveFeeDown,
  moveFeeDownToBottom
} from '../../helpers/lotOccupancyDB/moveFee.js'

import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js'

export const handler: RequestHandler = (request, response) => {
  const success =
    request.body.moveToEnd === '1'
      ? moveFeeDownToBottom(request.body.feeId)
      : moveFeeDown(request.body.feeId)

  const feeCategories = getFeeCategories(
    {},
    {
      includeFees: true
    }
  )

  response.json({
    success,
    feeCategories
  })
}

export default handler
