import type { Request, Response } from 'express'

import { completeWorkOrderMilestone } from '../../database/completeWorkOrderMilestone.js'
import { getWorkOrderMilestones } from '../../database/getWorkOrderMilestones.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await completeWorkOrderMilestone(
    {
      workOrderMilestoneId: request.body.workOrderMilestoneId
    },
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
