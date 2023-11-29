import type { Request, Response } from 'express'

import { getWorkOrderTypes } from '../../helpers/functions.cache.js'
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'WorkOrderTypes',
    request.body.workOrderTypeId,
    request.body.workOrderType,
    request.session.user as User
  )

  const workOrderTypes = await getWorkOrderTypes()

  response.json({
    success,
    workOrderTypes
  })
}

export default handler
