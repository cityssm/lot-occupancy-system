/* eslint-disable @typescript-eslint/indent */

import { acquireConnection } from './pool.js'

import { getOccupancyTypeFields } from './getOccupancyTypeFields.js'
import { getOccupancyTypePrints } from './getOccupancyTypePrints.js'

import type * as recordTypes from '../types/recordTypes.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export async function getOccupancyTypes(): Promise<
  recordTypes.OccupancyType[]
> {
  const database = await acquireConnection()

  const occupancyTypes = database
    .prepare(
      `select occupancyTypeId, occupancyType, orderNumber
        from OccupancyTypes
        where recordDelete_timeMillis is null
        order by orderNumber, occupancyType`
    )
    .all() as recordTypes.OccupancyType[]

  let expectedTypeOrderNumber = -1

  for (const occupancyType of occupancyTypes) {
    expectedTypeOrderNumber += 1

    if (occupancyType.orderNumber !== expectedTypeOrderNumber) {
      updateRecordOrderNumber(
        'OccupancyTypes',
        occupancyType.occupancyTypeId,
        expectedTypeOrderNumber,
        database
      )

      occupancyType.orderNumber = expectedTypeOrderNumber
    }

    occupancyType.occupancyTypeFields = await getOccupancyTypeFields(
      occupancyType.occupancyTypeId,
      database
    )

    occupancyType.occupancyTypePrints = await getOccupancyTypePrints(
      occupancyType.occupancyTypeId,
      database
    )
  }

  database.release()

  return occupancyTypes
}

export default getOccupancyTypes
