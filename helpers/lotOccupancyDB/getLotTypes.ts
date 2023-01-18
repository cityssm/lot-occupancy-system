import { acquireConnection } from './pool.js'

import { getLotTypeFields } from './getLotTypeFields.js'

import type * as recordTypes from '../../types/recordTypes'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export async function getLotTypes(): Promise<recordTypes.LotType[]> {
  const database = await acquireConnection()

  const lotTypes: recordTypes.LotType[] = database
    .prepare(
      `select lotTypeId, lotType, orderNumber
        from LotTypes
        where recordDelete_timeMillis is null
        order by orderNumber, lotType`
    )
    .all()

  let expectedTypeOrderNumber = -1

  for (const lotType of lotTypes) {
    expectedTypeOrderNumber += 1

    if (lotType.orderNumber !== expectedTypeOrderNumber) {
      updateRecordOrderNumber(
        'LotTypes',
        lotType.lotTypeId,
        expectedTypeOrderNumber,
        database
      )

      lotType.orderNumber = expectedTypeOrderNumber
    }

    lotType.lotTypeFields = await getLotTypeFields(lotType.lotTypeId, database)
  }

  database.release()

  return lotTypes
}

export default getLotTypes
