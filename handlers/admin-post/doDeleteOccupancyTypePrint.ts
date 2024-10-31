import type { Request, Response } from 'express'

import deleteOccupancyTypePrint from '../../database/deleteOccupancyTypePrint.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { occupancyTypeId: string; printEJS: string }
  >,
  response: Response
): Promise<void> {
  const success = await deleteOccupancyTypePrint(
    request.body.occupancyTypeId,
    request.body.printEJS,
    request.session.user as User
  )

  const occupancyTypes = await getOccupancyTypes()
  const allOccupancyTypeFields = await getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}
