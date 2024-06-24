import type { Request, Response } from 'express'

import { addRecord } from '../../database/addRecord.js'
import getFeeCategories from '../../database/getFeeCategories.js'

export default async function handler(
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
