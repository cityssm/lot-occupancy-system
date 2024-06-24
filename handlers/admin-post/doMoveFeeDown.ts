import type { Request, Response } from 'express'

import getFeeCategories from '../../database/getFeeCategories.js'
import { moveFeeDown, moveFeeDownToBottom } from '../../database/moveFee.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveFeeDownToBottom(request.body.feeId)
      : await moveFeeDown(request.body.feeId)

  const feeCategories = await getFeeCategories(
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
