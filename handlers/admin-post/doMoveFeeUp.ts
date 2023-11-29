import type { Request, Response } from 'express'

import {
  moveFeeUp,
  moveFeeUpToTop
} from '../../database/moveFee.js'

import { getFeeCategories } from '../../database/getFeeCategories.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveFeeUpToTop(request.body.feeId)
      : await moveFeeUp(request.body.feeId)

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

export default handler
