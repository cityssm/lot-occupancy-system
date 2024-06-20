import type { Request, Response } from 'express'

import copyLotOccupancy from '../../database/copyLotOccupancy.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotOccupancyId = await copyLotOccupancy(
    request.body.lotOccupancyId as string,
    request.session.user as User
  )

  response.json({
    success: true,
    lotOccupancyId
  })
}

export default handler
