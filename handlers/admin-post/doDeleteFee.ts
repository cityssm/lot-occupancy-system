import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getFeeCategories } from '../../database/getFeeCategories.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord('Fees', request.body.feeId, request.session.user as User)

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
