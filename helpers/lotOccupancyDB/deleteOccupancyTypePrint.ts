import { acquireConnection } from './pool.js'

import { clearCacheByTableName } from '../functions.cache.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteOccupancyTypePrint(
  occupancyTypeId: number | string,
  printEJS: string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update OccupancyTypePrints
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where occupancyTypeId = ?
        and printEJS = ?`
    )
    .run(
      requestSession.user!.userName,
      Date.now(),
      occupancyTypeId,
      printEJS
    )

  database.release()

  clearCacheByTableName('OccupancyTypePrints')

  return result.changes > 0
}

export default deleteOccupancyTypePrint
