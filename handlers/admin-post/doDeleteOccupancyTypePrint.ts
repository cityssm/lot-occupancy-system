import type { Request, Response } from 'express'

import { deleteOccupancyTypePrint } from '../../helpers/lotOccupancyDB/deleteOccupancyTypePrint.js'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteOccupancyTypePrint(
    request.body.occupancyTypeId,
    request.body.printEJS,
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
