import type { Request, Response } from 'express'

import { addWorkOrderComment } from '../../database/addWorkOrderComment.js'
import { getWorkOrderComments } from '../../database/getWorkOrderComments.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addWorkOrderComment(request.body, request.session.user as User)

  const workOrderComments = await getWorkOrderComments(request.body.workOrderId)

  response.json({
    success: true,
    workOrderComments
  })
}

export default handler
