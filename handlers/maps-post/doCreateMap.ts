import type { Request, Response } from 'express'

import { addMap } from '../../database/addMap.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const mapId = await addMap(request.body, request.session.user as User)

  response.json({
    success: true,
    mapId
  })
}

export default handler
