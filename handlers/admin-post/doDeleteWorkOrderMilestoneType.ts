import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderMilestoneTypes',
    request.body.workOrderMilestoneTypeId as string,
    request.session.user as User
  )

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.json({
    success,
    workOrderMilestoneTypes
  })
}

export default handler
