import type { PoolConnection } from 'better-sqlite-pool'

import { acquireConnection } from './pool.js'

export async function deleteLotField(
  lotId: number | string,
  lotTypeFieldId: number | string,
  user: User,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const result = database
    .prepare(
      `update LotFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotId = ?
        and lotTypeFieldId = ?`
    )
    .run(user.userName, Date.now(), lotId, lotTypeFieldId)

  if (connectedDatabase === undefined) {
    database.release()
  }

  return result.changes > 0
}

export default deleteLotField
