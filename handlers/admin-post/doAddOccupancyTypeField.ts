import type { Request, Response } from 'express'

import addOccupancyTypeField, {
  type AddOccupancyTypeFieldForm
} from '../../database/addOccupancyTypeField.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const occupancyTypeFieldId = await addOccupancyTypeField(
    request.body as AddOccupancyTypeFieldForm,
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
