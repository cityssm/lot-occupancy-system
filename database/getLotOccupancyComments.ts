import {
  dateIntegerToString,
  timeIntegerToPeriodString,
  timeIntegerToString
} from '@cityssm/utils-datetime'
import type { PoolConnection } from 'better-sqlite-pool'

import type { LotOccupancyComment } from '../types/recordTypes.js'

import { acquireConnection } from './pool.js'

export default async function getLotOccupancyComments(
  lotOccupancyId: number | string,
  connectedDatabase?: PoolConnection
): Promise<LotOccupancyComment[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  database.function('userFn_dateIntegerToString', dateIntegerToString)
  database.function('userFn_timeIntegerToString', timeIntegerToString)
  database.function(
    'userFn_timeIntegerToPeriodString',
    timeIntegerToPeriodString
  )

  const lotComments = database
    .prepare(
      // eslint-disable-next-line no-secrets/no-secrets
      `select lotOccupancyCommentId,
        lotOccupancyCommentDate, userFn_dateIntegerToString(lotOccupancyCommentDate) as lotOccupancyCommentDateString,
        lotOccupancyCommentTime,
        userFn_timeIntegerToString(lotOccupancyCommentTime) as lotOccupancyCommentTimeString,
        userFn_timeIntegerToPeriodString(lotOccupancyCommentTime) as lotOccupancyCommentTimePeriodString,
        lotOccupancyComment,
        recordCreate_userName, recordUpdate_userName
        from LotOccupancyComments
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        order by lotOccupancyCommentDate desc, lotOccupancyCommentTime desc, lotOccupancyCommentId desc`
    )
    .all(lotOccupancyId) as LotOccupancyComment[]

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotComments
}
