import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteLotOccupancyOccupant(
  lotOccupancyId: number | string,
  lotOccupantIndex: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyOccupants
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and lotOccupantIndex = ?`
    )
    .run(
      requestSession.user!.userName,
      Date.now(),
      lotOccupancyId,
      lotOccupantIndex
    )

  database.release()

  return result.changes > 0
}

export default deleteLotOccupancyOccupant
