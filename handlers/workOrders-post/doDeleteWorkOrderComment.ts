import type { Request, Response } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = deleteRecord(
    'WorkOrderComments',
    request.body.workOrderCommentId,
    request.session
  )

  const workOrderComments = getWorkOrderComments(request.body.workOrderId)

  response.json({
    success,
    workOrderComments
  })
}

export default handler
