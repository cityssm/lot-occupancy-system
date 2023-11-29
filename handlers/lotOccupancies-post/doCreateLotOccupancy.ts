import type { Request, Response } from 'express'

import { addLotOccupancy } from '../../database/addLotOccupancy.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotOccupancyId = await addLotOccupancy(request.body, request.session.user as User)

  response.json({
    success: true,
    lotOccupancyId
  })
}

export default handler
