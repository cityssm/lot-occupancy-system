import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteLotField(
  lotId: number | string,
  lotTypeFieldId: number | string,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update LotFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotId = ?
        and lotTypeFieldId = ?`
    )
    .run(requestSession.user!.userName, rightNowMillis, lotId, lotTypeFieldId)

  if (connectedDatabase === undefined) {
    database.release()
  }

  return result.changes > 0
}

export default deleteLotField
