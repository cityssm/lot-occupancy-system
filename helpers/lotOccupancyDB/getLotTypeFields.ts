import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export function getLotTypeFields(
  lotTypeId: number,
  connectedDatabase?: sqlite.Database
): recordTypes.LotTypeField[] {
  const database = connectedDatabase ?? sqlite(databasePath)

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
    database.close()
  }

  return lotTypeFields
}

export default getLotTypeFields
