import type { Request, Response } from 'express'

import { updateMap } from '../../database/updateMap.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateMap(request.body, request.session.user as User)

  response.json({
    success,
    mapId: request.body.mapId
  })
}

