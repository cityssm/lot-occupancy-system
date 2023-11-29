import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getWorkOrderComments } from '../../database/getWorkOrderComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderComments',
    request.body.workOrderCommentId,
    request.session.user as User
  )

  const workOrderComments = await getWorkOrderComments(request.body.workOrderId)

  response.json({
    success,
    workOrderComments
  })
}

export default handler
