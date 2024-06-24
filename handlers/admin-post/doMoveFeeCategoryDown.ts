import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'

import { getFeeCategories } from '../../database/getFeeCategories.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom('FeeCategories', request.body.feeCategoryId)
      : await moveRecordDown('FeeCategories', request.body.feeCategoryId)

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

