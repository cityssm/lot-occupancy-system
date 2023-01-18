import type { Request, Response } from 'express'

import { updateWorkOrderMilestone } from '../../helpers/lotOccupancyDB/updateWorkOrderMilestone.js'
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = updateWorkOrderMilestone(request.body, request.session)

  const workOrderMilestones = getWorkOrderMilestones(
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
