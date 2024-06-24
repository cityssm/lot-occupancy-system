import type { Request, Response } from 'express'

import getFeeCategories from '../../database/getFeeCategories.js'
import updateFee, { type UpdateFeeForm } from '../../database/updateFee.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateFee(request.body as UpdateFeeForm, request.session.user as User)

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
