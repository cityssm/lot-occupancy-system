import type { RequestHandler } from 'express'

import {
  moveRecordUp,
  moveRecordUpToTop
} from '../../helpers/lotOccupancyDB/moveRecord.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success =
    request.body.moveToEnd === '1'
      ? moveRecordUpToTop('OccupancyTypes', request.body.occupancyTypeId)
      : moveRecordUp('OccupancyTypes', request.body.occupancyTypeId)

  const occupancyTypes = getOccupancyTypes()
  const allOccupancyTypeFields = getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}

export default handler
