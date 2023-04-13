import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import {
  dateIntegerToString,
  timeIntegerToString,
  timeIntegerToPeriodString
} from '@cityssm/utils-datetime'

import type * as recordTypes from '../../types/recordTypes'

export async function getWorkOrderComments(
  workOrderId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.WorkOrderComment[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  database.function('userFn_dateIntegerToString', dateIntegerToString)
  database.function('userFn_timeIntegerToString', timeIntegerToString)
  database.function('userFn_timeIntegerToPeriodString', timeIntegerToPeriodString)

  const workOrderComments = database
    .prepare(
      `select workOrderCommentId,
        workOrderCommentDate, userFn_dateIntegerToString(workOrderCommentDate) as workOrderCommentDateString,
        workOrderCommentTime,
        userFn_timeIntegerToString(workOrderCommentTime) as workOrderCommentTimeString,
        userFn_timeIntegerToPeriodString(workOrderCommentTime) as workOrderCommentTimePeriodString,
        workOrderComment,
        recordCreate_userName, recordUpdate_userName
        from WorkOrderComments
        where recordDelete_timeMillis is null
        and workOrderId = ?
        order by workOrderCommentDate desc, workOrderCommentTime desc, workOrderCommentId desc`
    )
    .all(workOrderId) as recordTypes.WorkOrderComment[]

  if (connectedDatabase === undefined) {
    database.release()
  }

  return workOrderComments
}

export default getWorkOrderComments
