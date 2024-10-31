import type { Request, Response } from 'express'

import { updateRecord } from '../../database/updateRecord.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { occupancyTypeId: string; occupancyType: string }
  >,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'OccupancyTypes',
    request.body.occupancyTypeId,
    request.body.occupancyType,
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
