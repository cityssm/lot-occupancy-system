import type { Request, Response } from 'express'

import { addFee } from '../../database/addFee.js'
import { getFeeCategories } from '../../database/getFeeCategories.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const feeId = await addFee(request.body, request.session.user as User)

  const feeCategories = await getFeeCategories(
    {},
    {
      includeFees: true
    }
  )

  response.json({
    success: true,
    feeId,
    feeCategories
  })
}

export default handler
