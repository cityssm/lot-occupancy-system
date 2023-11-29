import type { Request, Response } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'FeeCategories',
    request.body.feeCategoryId,
    request.session.user as User
  )

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
