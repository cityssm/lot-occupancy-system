import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import {
  dateIntegerToString,
  timeIntegerToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

export async function getLotOccupancyComments(
  lotOccupancyId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.LotOccupancyComment[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  database.function('userFn_dateIntegerToString', dateIntegerToString)
  database.function('userFn_timeIntegerToString', timeIntegerToString)

  const lotComments = database
    .prepare(
      `select lotOccupancyCommentId,
        lotOccupancyCommentDate, userFn_dateIntegerToString(lotOccupancyCommentDate) as lotOccupancyCommentDateString,
        lotOccupancyCommentTime, userFn_timeIntegerToString(lotOccupancyCommentTime) as lotOccupancyCommentTimeString,
        lotOccupancyComment,
        recordCreate_userName, recordUpdate_userName
        from LotOccupancyComments
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        order by lotOccupancyCommentDate desc, lotOccupancyCommentTime desc, lotOccupancyCommentId desc`
    )
    .all(lotOccupancyId)

  if (connectedDatabase === null) {
    database.release()
  }

  return lotComments
}

export default getLotOccupancyComments
