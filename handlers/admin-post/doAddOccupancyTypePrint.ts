import type { Request, Response } from 'express'

import addOccupancyTypePrint, {
  type AddOccupancyTypePrintForm
} from '../../database/addOccupancyTypePrint.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addOccupancyTypePrint(
    request.body as AddOccupancyTypePrintForm,
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
