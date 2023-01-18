import type { Request, Response } from 'express'

import {
  getOccupancyTypeById,
  getAllOccupancyTypeFields
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const occupancyTypeFields = await getAllOccupancyTypeFields()

  const result = (await getOccupancyTypeById(
    Number.parseInt(request.body.occupancyTypeId, 10)
  ))!

  occupancyTypeFields.push(...(result.occupancyTypeFields ?? []))

  response.json({
    occupancyTypeFields
  })
}

export default handler
