import type { Request, Response } from 'express'

import getWorkOrderMilestones from '../../database/getWorkOrderMilestones.js'
import updateWorkOrderMilestone, {
  type UpdateWorkOrderMilestoneForm
} from '../../database/updateWorkOrderMilestone.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrderMilestone(
    request.body as UpdateWorkOrderMilestoneForm,
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
