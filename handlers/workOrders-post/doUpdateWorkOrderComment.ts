import type { Request, Response } from 'express'

import { getWorkOrderComments } from '../../database/getWorkOrderComments.js'
import { updateWorkOrderComment } from '../../database/updateWorkOrderComment.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrderComment(request.body, request.session.user as User)

  const workOrderComments = await getWorkOrderComments(request.body.workOrderId)

  response.json({
    success,
    workOrderComments
  })
}

export default handler
