import type { Request, Response } from 'express'

import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js'
import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderMilestoneTypeId = await addRecord(
    'WorkOrderMilestoneTypes',
    request.body.workOrderMilestoneType,
    request.body.orderNumber ?? -1,
    request.session.user as User
  )

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.json({
    success: true,
    workOrderMilestoneTypeId,
    workOrderMilestoneTypes
  })
}

export default handler
