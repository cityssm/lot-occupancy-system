import type { Request, Response } from 'express'

import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'
import { addOccupancyTypeField } from '../../database/addOccupancyTypeField.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const occupancyTypeFieldId = await addOccupancyTypeField(
    request.body,
    request.session.user as User
  )

  const occupancyTypes = await getOccupancyTypes()
  const allOccupancyTypeFields = await getAllOccupancyTypeFields()

  response.json({
    success: true,
    occupancyTypeFieldId,
    occupancyTypes,
    allOccupancyTypeFields
  })
}

export default handler
