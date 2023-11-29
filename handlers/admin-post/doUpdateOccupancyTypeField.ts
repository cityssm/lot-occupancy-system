import type { Request, Response } from 'express'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'
import { updateOccupancyTypeField } from '../../helpers/lotOccupancyDB/updateOccupancyTypeField.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateOccupancyTypeField(
    request.body,
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
