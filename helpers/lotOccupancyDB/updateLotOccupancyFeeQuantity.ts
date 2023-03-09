import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupancyFeeQuantityForm {
  lotOccupancyId: string | number
  feeId: string | number
  quantity: string | number
}

export async function updateLotOccupancyFeeQuantity(
  feeQuantityForm: UpdateLotOccupancyFeeQuantityForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const rightNowMillis = Date.now()

  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyFees
        set quantity = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        and feeId = ?`
    )
    .run(
      feeQuantityForm.quantity,
      requestSession.user!.userName,
      rightNowMillis,
      feeQuantityForm.lotOccupancyId,
      feeQuantityForm.feeId
    )

  database.release()

  return result.changes > 0
}

export default updateLotOccupancyFeeQuantity
