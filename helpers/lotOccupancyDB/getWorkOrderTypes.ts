/* eslint-disable @typescript-eslint/indent */

import { acquireConnection } from './pool.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

import type * as recordTypes from '../../types/recordTypes'

export async function getWorkOrderTypes(): Promise<
  recordTypes.WorkOrderType[]
> {
  const database = await acquireConnection()

  const workOrderTypes: recordTypes.WorkOrderType[] = database
    .prepare(
      `select workOrderTypeId, workOrderType, orderNumber
        from WorkOrderTypes
        where recordDelete_timeMillis is null
        order by orderNumber, workOrderType`
    )
    .all()

  let expectedOrderNumber = 0

  for (const workOrderType of workOrderTypes) {
    if (workOrderType.orderNumber !== expectedOrderNumber) {
      updateRecordOrderNumber(
        'WorkOrderTypes',
        workOrderType.workOrderTypeId!,
        expectedOrderNumber,
        database
      )

      workOrderType.orderNumber = expectedOrderNumber
    }

    expectedOrderNumber += 1
  }

  database.release()

  return workOrderTypes
}

export default getWorkOrderTypes
