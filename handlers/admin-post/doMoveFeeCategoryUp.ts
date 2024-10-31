import type { Request, Response } from 'express'

import getFeeCategories from '../../database/getFeeCategories.js'
import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js'

export default async function handler(
  request: Request<unknown, unknown, { feeCategoryId: string; moveToEnd: '0' | '1' }>,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop('FeeCategories', request.body.feeCategoryId)
      : await moveRecordUp('FeeCategories', request.body.feeCategoryId)

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
