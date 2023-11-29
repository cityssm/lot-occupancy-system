import type { Request, Response } from 'express'

import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js'
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const feeCategoryId = await addRecord(
    'FeeCategories',
    request.body.feeCategory,
    request.body.orderNumber ?? -1,
    request.session.user as User
  )

  const feeCategories = await getFeeCategories(
    {},
    {
      includeFees: true
    }
  )

  response.json({
    success: true,
    feeCategoryId,
    feeCategories
  })
}

export default handler
