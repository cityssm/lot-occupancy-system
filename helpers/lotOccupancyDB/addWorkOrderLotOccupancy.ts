import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

interface AddWorkOrderLotOccupancyForm {
  workOrderId: number | string
  lotOccupancyId: number | string
}

export async function addWorkOrderLotOccupancy(
  workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const rightNowMillis = Date.now()

  const row = database
    .prepare(
      `select recordDelete_timeMillis
        from WorkOrderLotOccupancies
        where workOrderId = ?
        and lotOccupancyId = ?`
    )
    .get(
      workOrderLotOccupancyForm.workOrderId,
      workOrderLotOccupancyForm.lotOccupancyId
    ) as { recordDelete_timeMillis?: number }

  if (row === undefined) {
    database
      .prepare(
        `insert into WorkOrderLotOccupancies (
          workOrderId, lotOccupancyId,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?)`
      )
      .run(
        workOrderLotOccupancyForm.workOrderId,
        workOrderLotOccupancyForm.lotOccupancyId,
        requestSession.user!.userName,
        rightNowMillis,
        requestSession.user!.userName,
        rightNowMillis
      )
  } else {
    if (row.recordDelete_timeMillis) {
      database
        .prepare(
          `update WorkOrderLotOccupancies
            set recordCreate_userName = ?,
            recordCreate_timeMillis = ?,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?,
            recordDelete_userName = null,
            recordDelete_timeMillis = null
            where workOrderId = ?
            and lotOccupancyId = ?`
        )
        .run(
          requestSession.user!.userName,
          rightNowMillis,
          requestSession.user!.userName,
          rightNowMillis,
          workOrderLotOccupancyForm.workOrderId,
          workOrderLotOccupancyForm.lotOccupancyId
        )
    }
  }

  if (connectedDatabase === undefined) {
    database.release()
  }

  return true
}

export default addWorkOrderLotOccupancy
