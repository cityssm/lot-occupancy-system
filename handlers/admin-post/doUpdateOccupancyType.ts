import type { Request, Response } from 'express'

import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'OccupancyTypes',
    request.body.occupancyTypeId,
    request.body.occupancyType,
    request.session
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
