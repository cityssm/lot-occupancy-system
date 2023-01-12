import type { RequestHandler } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../helpers/lotOccupancyDB/moveRecord.js'
import { getWorkOrderTypes } from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success =
    request.body.moveToEnd === '1'
      ? moveRecordDownToBottom('WorkOrderTypes', request.body.workOrderTypeId)
      : moveRecordDown('WorkOrderTypes', request.body.workOrderTypeId)

  const workOrderTypes = getWorkOrderTypes()

  response.json({
    success,
    workOrderTypes
  })
}

export default handler
