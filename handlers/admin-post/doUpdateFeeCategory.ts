import type { Request, Response } from 'express'

import getFeeCategories from '../../database/getFeeCategories.js'
import updateFeeCategory, {
  type UpdateFeeCategoryForm
} from '../../database/updateFeeCategory.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateFeeCategory(
    request.body as UpdateFeeCategoryForm,
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
