import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export function getLotFields(
  lotId: number | string,
  connectedDatabase?: sqlite.Database
): recordTypes.LotField[] {
  const database =
    connectedDatabase ??
    sqlite(databasePath, {
      readonly: true
    })

  const lotFields: recordTypes.LotField[] = database
    .prepare(
      `select l.lotId, l.lotTypeFieldId,
        l.lotFieldValue,
        f.lotTypeField, f.lotTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as lotTypeOrderNumber
        from LotFields l
        left join LotTypeFields f on l.lotTypeFieldId = f.lotTypeFieldId
        left join LotTypes t on f.lotTypeId = t.lotTypeId
        where l.recordDelete_timeMillis is null
        and l.lotId = ?
    
        union
    
        select ? as lotId, f.lotTypeFieldId,
        '' as lotFieldValue,
        f.lotTypeField, f.lotTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as lotTypeOrderNumber
        from LotTypeFields f
        left join LotTypes t on f.lotTypeId = t.lotTypeId
        where f.recordDelete_timeMillis is null
        and (
            f.lotTypeId is null
            or f.lotTypeId in (select lotTypeId from Lots where lotId = ?))
        and f.lotTypeFieldId not in (select lotTypeFieldId from LotFields where lotId = ? and recordDelete_timeMillis is null)
        order by lotTypeOrderNumber, f.orderNumber, f.lotTypeField`
    )
    .all(lotId, lotId, lotId, lotId)

  if (connectedDatabase === undefined) {
    database.close()
  }

  return lotFields
}

export default getLotFields
