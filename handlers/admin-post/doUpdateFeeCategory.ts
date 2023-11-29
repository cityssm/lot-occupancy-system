import type { Request, Response } from 'express'

import { getFeeCategories } from '../../database/getFeeCategories.js'
import { updateFeeCategory } from '../../database/updateFeeCategory.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateFeeCategory(
    request.body,
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
