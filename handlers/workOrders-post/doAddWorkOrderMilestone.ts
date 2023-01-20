import type { Request, Response } from 'express'

import { addWorkOrderMilestone } from '../../helpers/lotOccupancyDB/addWorkOrderMilestone.js'
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderMilestone(request.body, request.session)

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
