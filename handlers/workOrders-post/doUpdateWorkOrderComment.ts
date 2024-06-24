import type { Request, Response } from 'express'

import getWorkOrderComments from '../../database/getWorkOrderComments.js'
import updateWorkOrderComment, {
  type UpdateWorkOrderCommentForm
} from '../../database/updateWorkOrderComment.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrderComment(
    request.body as UpdateWorkOrderCommentForm,
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
