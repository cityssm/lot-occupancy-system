import type { RequestHandler } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteRecord('Maps', request.body.mapId, request.session)

  response.json({
    success
  })
}

export default handler
