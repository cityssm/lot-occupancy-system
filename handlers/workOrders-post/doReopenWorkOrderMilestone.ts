import type { Request, Response } from 'express'

import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'
import { reopenWorkOrderMilestone } from '../../helpers/lotOccupancyDB/reopenWorkOrderMilestone.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await reopenWorkOrderMilestone(
    request.body.workOrderMilestoneId,
    request.session.user as User
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
