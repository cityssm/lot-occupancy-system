import type { Request, Response } from 'express'

import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js'
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderMilestoneTypes',
    request.body.workOrderMilestoneTypeId,
    request.session.user as User
  )

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.json({
    success,
    workOrderMilestoneTypes
  })
}

export default handler
