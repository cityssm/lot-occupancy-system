import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../helpers/lotOccupancyDB/moveRecord.js'
import { getWorkOrderTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom('WorkOrderTypes', request.body.workOrderTypeId)
      : await moveRecordDown('WorkOrderTypes', request.body.workOrderTypeId)

  const workOrderTypes = await getWorkOrderTypes()

  response.json({
    success,
    workOrderTypes
  })
}

export default handler
