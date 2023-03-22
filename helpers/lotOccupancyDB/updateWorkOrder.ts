import { acquireConnection } from './pool.js'

import { dateStringToInteger } from '@cityssm/utils-datetime'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateWorkOrderForm {
  workOrderId: string
  workOrderNumber: string
  workOrderTypeId: string
  workOrderDescription: string
  workOrderOpenDateString: string
}

export async function updateWorkOrder(
  workOrderForm: UpdateWorkOrderForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update WorkOrders
        set workOrderNumber = ?,
        workOrderTypeId = ?,
        workOrderDescription = ?,
        workOrderOpenDate = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderId = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      workOrderForm.workOrderNumber,
      workOrderForm.workOrderTypeId,
      workOrderForm.workOrderDescription,
      dateStringToInteger(workOrderForm.workOrderOpenDateString),
      requestSession.user!.userName,
      rightNowMillis,
      workOrderForm.workOrderId
    )

  database.release()

  return result.changes > 0
}

export default updateWorkOrder
