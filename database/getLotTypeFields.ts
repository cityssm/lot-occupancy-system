import type { PoolConnection } from 'better-sqlite-pool'

import type { LotTypeField } from '../types/recordTypes.js'

import { acquireConnection } from './pool.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export async function getLotTypeFields(
  lotTypeId: number,
  connectedDatabase?: PoolConnection
): Promise<LotTypeField[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  const lotTypeFields = database
    .prepare(
      `select lotTypeFieldId,
        lotTypeField, lotTypeFieldValues,
        isRequired, pattern, minimumLength, maximumLength, orderNumber
        from LotTypeFields
        where recordDelete_timeMillis is null
        and lotTypeId = ?
        order by orderNumber, lotTypeField`
    )
    .all(lotTypeId) as LotTypeField[]

  let expectedOrderNumber = 0

  for (const lotTypeField of lotTypeFields) {
    if (lotTypeField.orderNumber !== expectedOrderNumber) {
      updateRecordOrderNumber(
        'LotTypeFields',
        lotTypeField.lotTypeFieldId,
        expectedOrderNumber,
        database
      )

      lotTypeField.orderNumber = expectedOrderNumber
    }

    expectedOrderNumber += 1
  }

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotTypeFields
}

export default getLotTypeFields
