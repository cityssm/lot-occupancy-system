import type { Request, Response } from 'express'

import {
  moveOccupancyTypePrintDown,
  moveOccupancyTypePrintDownToBottom
} from '../../database/moveOccupancyTypePrintDown.js'
import {
  getAllOccupancyTypeFields,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { occupancyTypeId: string; printEJS: string; moveToEnd: '0' | '1' }
  >,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveOccupancyTypePrintDownToBottom(
          request.body.occupancyTypeId,
          request.body.printEJS
        )
      : await moveOccupancyTypePrintDown(
          request.body.occupancyTypeId,
          request.body.printEJS
        )

  const occupancyTypes = await getOccupancyTypes()
  const allOccupancyTypeFields = await getAllOccupancyTypeFields()

  response.json({
    success,
    occupancyTypes,
    allOccupancyTypeFields
  })
}
