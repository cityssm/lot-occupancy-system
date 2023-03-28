import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteLotOccupancyField(
  lotOccupancyId: number | string,
  occupancyTypeFieldId: number | string,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const result = database
    .prepare(
      `update LotOccupancyFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and occupancyTypeFieldId = ?`
    )
    .run(
      requestSession.user!.userName,
      Date.now(),
      lotOccupancyId,
      occupancyTypeFieldId
    )

  if (connectedDatabase === undefined) {
    database.release()
  }

  return result.changes > 0
}

export default deleteLotOccupancyField
