/* eslint-disable @typescript-eslint/indent */

import { acquireConnection } from './pool.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

import type * as recordTypes from '../../types/recordTypes'

export async function getLotOccupantTypes(): Promise<
  recordTypes.LotOccupantType[]
> {
  const database = await acquireConnection()

  const lotOccupantTypes: recordTypes.LotOccupantType[] = database
    .prepare(
      `select lotOccupantTypeId, lotOccupantType, fontAwesomeIconClass, occupantCommentTitle,
        orderNumber
        from LotOccupantTypes
        where recordDelete_timeMillis is null
        order by orderNumber, lotOccupantType`
    )
    .all()

  let expectedOrderNumber = 0

  for (const lotOccupantType of lotOccupantTypes) {
    if (lotOccupantType.orderNumber !== expectedOrderNumber) {
      updateRecordOrderNumber(
        'LotOccupantTypes',
        lotOccupantType.lotOccupantTypeId,
        expectedOrderNumber,
        database
      )

      lotOccupantType.orderNumber = expectedOrderNumber
    }

    expectedOrderNumber += 1
  }

  database.release()

  return lotOccupantTypes
}

export default getLotOccupantTypes
