import type { RequestHandler } from 'express'

import { addWorkOrderComment } from '../../helpers/lotOccupancyDB/addWorkOrderComment.js'

import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js'

export const handler: RequestHandler = (request, response) => {
  addWorkOrderComment(request.body, request.session)

  const workOrderComments = getWorkOrderComments(request.body.workOrderId)

  response.json({
    success: true,
    workOrderComments
  })
}

export default handler
