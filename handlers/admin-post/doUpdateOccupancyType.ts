import type { RequestHandler } from 'express'

import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success = updateRecord(
    'OccupancyTypes',
    request.body.occupancyTypeId,
    request.body.occupancyType,
    request.session
  )

  const occupancyTypes = getOccupancyTypes()
  const allOccupancyTypeFields = getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}

export default handler
