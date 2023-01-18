import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

interface LotOccupancyFieldForm {
  lotOccupancyId: string | number
  occupancyTypeFieldId: string | number
  lotOccupancyFieldValue: string
}

export async function addOrUpdateLotOccupancyField(
  lotOccupancyFieldForm: LotOccupancyFieldForm,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const rightNowMillis = Date.now()

  let result = database
    .prepare(
      `update LotOccupancyFields
        set lotOccupancyFieldValue = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?,
        recordDelete_userName = null,
        recordDelete_timeMillis = null
        where lotOccupancyId = ?
        and occupancyTypeFieldId = ?`
    )
    .run(
      lotOccupancyFieldForm.lotOccupancyFieldValue,
      requestSession.user!.userName,
      rightNowMillis,
      lotOccupancyFieldForm.lotOccupancyId,
      lotOccupancyFieldForm.occupancyTypeFieldId
    )

  if (result.changes === 0) {
    result = database
      .prepare(
        `insert into LotOccupancyFields (
          lotOccupancyId, occupancyTypeFieldId, lotOccupancyFieldValue,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        lotOccupancyFieldForm.lotOccupancyId,
        lotOccupancyFieldForm.occupancyTypeFieldId,
        lotOccupancyFieldForm.lotOccupancyFieldValue,
        requestSession.user!.userName,
        rightNowMillis,
        requestSession.user!.userName,
        rightNowMillis
      )
  }

  if (connectedDatabase === undefined) {
    database.release()
  }

  return result.changes > 0
}

export default addOrUpdateLotOccupancyField
