/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'
import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'LotOccupantTypes',
          request.body.lotOccupantTypeId
        )
      : await moveRecordDown('LotOccupantTypes', request.body.lotOccupantTypeId)

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}

export default handler
