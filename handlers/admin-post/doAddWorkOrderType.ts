import type { Request, Response } from 'express'

import { getWorkOrderTypes } from '../../helpers/functions.cache.js'
import { addRecord } from '../../database/addRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderTypeId = await addRecord(
    'WorkOrderTypes',
    request.body.workOrderType,
    request.body.orderNumber ?? -1,
    request.session.user as User
  )

  const workOrderTypes = await getWorkOrderTypes()

  response.json({
    success: true,
    workOrderTypeId,
    workOrderTypes
  })
}

export default handler
