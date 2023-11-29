import type { Request, Response } from 'express'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'

export async function handler(
  request: Request,
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

export default handler
