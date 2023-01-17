import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export function getLotOccupancyOccupants(
  lotOccupancyId: number | string,
  connectedDatabase?: sqlite.Database
): recordTypes.LotOccupancyOccupant[] {
  const database =
    connectedDatabase ??
    sqlite(databasePath, {
      readonly: true
    })

  const lotOccupancyOccupants: recordTypes.LotOccupancyOccupant[] = database
    .prepare(
      `select o.lotOccupancyId, o.lotOccupantIndex,
        o.occupantName,
        o.occupantAddress1, o.occupantAddress2,
        o.occupantCity, o.occupantProvince, o.occupantPostalCode,
        o.occupantPhoneNumber, o.occupantEmailAddress,
        o.occupantComment,
        o.lotOccupantTypeId, t.lotOccupantType,
        t.fontAwesomeIconClass
        from LotOccupancyOccupants o
        left join LotOccupantTypes t on o.lotOccupantTypeId = t.lotOccupantTypeId
        where o.recordDelete_timeMillis is null
        and o.lotOccupancyId = ?
        order by t.orderNumber, t.lotOccupantType, o.occupantName, o.lotOccupantIndex`
    )
    .all(lotOccupancyId)

  if (!connectedDatabase) {
    database.close()
  }

  return lotOccupancyOccupants
}

export default getLotOccupancyOccupants
