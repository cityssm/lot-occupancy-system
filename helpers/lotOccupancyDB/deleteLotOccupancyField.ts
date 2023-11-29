import type { PoolConnection } from 'better-sqlite-pool'

import { acquireConnection } from './pool.js'

export async function deleteLotOccupancyField(
  lotOccupancyId: number | string,
  occupancyTypeFieldId: number | string,
  user: User,
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
      user.userName,
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
