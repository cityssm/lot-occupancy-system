import type { Request, Response } from 'express'

import { updateMap } from '../../helpers/lotOccupancyDB/updateMap.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateMap(request.body, request.session)

  response.json({
    success,
    mapId: request.body.mapId
  })
}

export default handler
