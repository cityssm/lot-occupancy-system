import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'
import { getLotStatuses } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom('LotStatuses', request.body.lotStatusId)
      : await moveRecordDown('LotStatuses', request.body.lotStatusId)

  const lotStatuses = await getLotStatuses()

  response.json({
    success,
    lotStatuses
  })
}

export default handler
