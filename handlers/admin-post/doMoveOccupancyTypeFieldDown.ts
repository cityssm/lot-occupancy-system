import type { Request, Response } from 'express'

import {
  moveOccupancyTypeFieldDown,
  moveOccupancyTypeFieldDownToBottom
} from '../../database/moveOccupancyTypeField.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { occupancyTypeFieldId: string; moveToEnd: '0' | '1' }
  >,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveOccupancyTypeFieldDownToBottom(
          request.body.occupancyTypeFieldId
        )
      : await moveOccupancyTypeFieldDown(request.body.occupancyTypeFieldId)

  const occupancyTypes = await getOccupancyTypes()
  const allOccupancyTypeFields = await getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}
