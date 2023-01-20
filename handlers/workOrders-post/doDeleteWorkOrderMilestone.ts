import type { Request, Response } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderMilestones',
    request.body.workOrderMilestoneId,
    request.session
  )

  const workOrderMilestones = await getWorkOrderMilestones(
    {
      workOrderId: request.body.workOrderId
    },
    {
      orderBy: 'completion'
    }
  )

  response.json({
    success,
    workOrderMilestones
  })
}

export default handler
