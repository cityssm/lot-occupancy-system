import type { Request, Response } from 'express'

import { reopenWorkOrderMilestone } from '../../helpers/lotOccupancyDB/reopenWorkOrderMilestone.js'

import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await reopenWorkOrderMilestone(
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
