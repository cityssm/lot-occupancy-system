import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import getWorkOrderComments from '../../database/getWorkOrderComments.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderComments',
    request.body.workOrderCommentId as string,
    request.session.user as User
  )

  const workOrderComments = await getWorkOrderComments(
    request.body.workOrderId as string
  )

  response.json({
    success,
    workOrderComments
  })
}
