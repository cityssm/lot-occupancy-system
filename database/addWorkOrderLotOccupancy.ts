import type { PoolConnection } from 'better-sqlite-pool'

import { acquireConnection } from './pool.js'

interface AddWorkOrderLotOccupancyForm {
  workOrderId: number | string
  lotOccupancyId: number | string
}

export async function addWorkOrderLotOccupancy(
  workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm,
  user: User,
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
        user.userName,
        rightNowMillis,
        user.userName,
        rightNowMillis
      )
  } else {
    if (row.recordDelete_timeMillis !== null) {
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
          user.userName,
          rightNowMillis,
          user.userName,
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
