import type { Request, Response } from 'express'

import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'
import { updateWorkOrderMilestone } from '../../helpers/lotOccupancyDB/updateWorkOrderMilestone.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrderMilestone(request.body, request.session.user as User)

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
