import type { Request, Response } from 'express'

import addWorkOrderMilestone, {
  type AddWorkOrderMilestoneForm
} from '../../database/addWorkOrderMilestone.js'
import getWorkOrderMilestones from '../../database/getWorkOrderMilestones.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderMilestone(
    request.body as AddWorkOrderMilestoneForm,
    request.session.user as User
  )

  const workOrderMilestones = await getWorkOrderMilestones(
    {
      workOrderId: request.body.workOrderId as string
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
