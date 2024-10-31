import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<unknown, unknown, { occupancyTypeId: string }>,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'OccupancyTypes',
    request.body.occupancyTypeId as string,
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
