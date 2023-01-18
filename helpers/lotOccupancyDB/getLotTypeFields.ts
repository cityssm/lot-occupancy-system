import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export async function getLotTypeFields(
  lotTypeId: number,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.LotTypeField[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  const lotTypeFields: recordTypes.LotTypeField[] = database
    .prepare(
      `select lotTypeFieldId,
        lotTypeField, lotTypeFieldValues,
        isRequired, pattern, minimumLength, maximumLength, orderNumber
        from LotTypeFields
        where recordDelete_timeMillis is null
        and lotTypeId = ?
        order by orderNumber, lotTypeField`
    )
    .all(lotTypeId)

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
