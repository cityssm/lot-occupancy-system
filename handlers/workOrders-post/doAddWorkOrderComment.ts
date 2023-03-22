import type { Request, Response } from 'express'

import { addWorkOrderComment } from '../../helpers/lotOccupancyDB/addWorkOrderComment.js'

import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addWorkOrderComment(request.body, request.session)

  const workOrderComments = await getWorkOrderComments(request.body.workOrderId)

  response.json({
    success: true,
    workOrderComments
  })
}

export default handler
