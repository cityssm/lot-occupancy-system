import type { Request, Response } from 'express'

import getWorkOrderMilestones from '../../database/getWorkOrderMilestones.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderMilestones = await getWorkOrderMilestones(request.body, {
    includeWorkOrders: true,
    orderBy: 'date'
  })

  response.json({
    workOrderMilestones
  })
}
