import type { Request, Response } from 'express'

import { updateRecord } from '../../database/updateRecord.js'
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { workOrderMilestoneTypeId: string; workOrderMilestoneType: string }
  >,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'WorkOrderMilestoneTypes',
    request.body.workOrderMilestoneTypeId,
    request.body.workOrderMilestoneType,
    request.session.user as User
  )

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.json({
    success,
    workOrderMilestoneTypes
  })
}
