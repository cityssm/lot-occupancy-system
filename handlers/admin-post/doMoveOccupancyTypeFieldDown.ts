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
  request: Request,
  response: Response
): Promise<void> {
  const occupancyTypeFieldId = Number.parseInt(
    request.body.occupancyTypeFieldId,
    10
  )

  const success =
    request.body.moveToEnd === '1'
      ? await moveOccupancyTypeFieldDownToBottom(occupancyTypeFieldId)
      : await moveOccupancyTypeFieldDown(occupancyTypeFieldId)

  const occupancyTypes = await getOccupancyTypes()
  const allOccupancyTypeFields = await getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}

