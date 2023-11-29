import { acquireConnection } from './pool.js'

import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

import type * as recordTypes from '../types/recordTypes.js'

export async function getWorkOrderMilestoneTypes(): Promise<recordTypes.WorkOrderMilestoneType[]> {
  const database = await acquireConnection()

  const workOrderMilestoneTypes = database
    .prepare(
      `select workOrderMilestoneTypeId, workOrderMilestoneType, orderNumber
        from WorkOrderMilestoneTypes
        where recordDelete_timeMillis is null
        order by orderNumber, workOrderMilestoneType`
    )
    .all() as recordTypes.WorkOrderMilestoneType[]

  let expectedOrderNumber = 0

  for (const workOrderMilestoneType of workOrderMilestoneTypes) {
    if (workOrderMilestoneType.orderNumber !== expectedOrderNumber) {
      updateRecordOrderNumber(
        'WorkOrderMilestoneTypes',
        workOrderMilestoneType.workOrderMilestoneTypeId,
        expectedOrderNumber,
        database
      )

      workOrderMilestoneType.orderNumber = expectedOrderNumber
    }

    expectedOrderNumber += 1
  }

  database.release()

  return workOrderMilestoneTypes
}

export default getWorkOrderMilestoneTypes
