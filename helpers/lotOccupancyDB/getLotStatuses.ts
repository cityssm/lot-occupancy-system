import { acquireConnection } from './pool.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

import type * as recordTypes from '../../types/recordTypes'

export async function getLotStatuses(): Promise<recordTypes.LotStatus[]> {
  const database = await acquireConnection()

  const lotStatuses = database
    .prepare(
      `select lotStatusId, lotStatus, orderNumber
        from LotStatuses
        where recordDelete_timeMillis is null
        order by orderNumber, lotStatus`
    )
    .all() as recordTypes.LotStatus[]

  let expectedOrderNumber = 0

  for (const lotStatus of lotStatuses) {
    if (lotStatus.orderNumber !== expectedOrderNumber) {
      updateRecordOrderNumber(
        'LotStatuses',
        lotStatus.lotStatusId,
        expectedOrderNumber,
        database
      )
      lotStatus.orderNumber = expectedOrderNumber
    }

    expectedOrderNumber += 1
  }

  database.release()

  return lotStatuses
}

export default getLotStatuses
