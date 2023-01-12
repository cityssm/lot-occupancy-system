import type { RequestHandler } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteRecord(
    'OccupancyTypes',
    request.body.occupancyTypeId,
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
