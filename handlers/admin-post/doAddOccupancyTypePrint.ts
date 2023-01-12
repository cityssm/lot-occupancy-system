import type { RequestHandler } from 'express'

import { addOccupancyTypePrint } from '../../helpers/lotOccupancyDB/addOccupancyTypePrint.js'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const success = addOccupancyTypePrint(request.body, request.session)

  const occupancyTypes = getOccupancyTypes()
  const allOccupancyTypeFields = getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}

export default handler
