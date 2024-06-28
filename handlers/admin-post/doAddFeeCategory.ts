import type { Request, Response } from 'express'

import addFeeCategory, {
  type AddFeeCategoryForm
} from '../../database/addFeeCategory.js'
import getFeeCategories from '../../database/getFeeCategories.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const feeCategoryId = await addFeeCategory(
    request.body as AddFeeCategoryForm,
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
