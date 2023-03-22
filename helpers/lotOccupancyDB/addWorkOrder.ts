import { acquireConnection } from './pool.js'

import { getNextWorkOrderNumber } from './getNextWorkOrderNumber.js'
import { addWorkOrderLotOccupancy } from './addWorkOrderLotOccupancy.js'

import {
  dateStringToInteger,
  dateToInteger
} from '@cityssm/utils-datetime'

import type * as recordTypes from '../../types/recordTypes'

interface AddWorkOrderForm {
  workOrderTypeId: number | string
  workOrderNumber?: string
  workOrderDescription: string
  workOrderOpenDateString?: string
  workOrderCloseDateString?: string
  lotOccupancyId?: string
}

export async function addWorkOrder(
  workOrderForm: AddWorkOrderForm,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const database = await acquireConnection()

  const rightNow = new Date()

  let workOrderNumber = workOrderForm.workOrderNumber

  if ((workOrderNumber ?? '') === '') {
    workOrderNumber = await getNextWorkOrderNumber(database)
  }

  const result = database
    .prepare(
      `insert into WorkOrders (
        workOrderTypeId, workOrderNumber, workOrderDescription,
        workOrderOpenDate, workOrderCloseDate,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      workOrderForm.workOrderTypeId,
      workOrderNumber,
      workOrderForm.workOrderDescription,
      (workOrderForm.workOrderOpenDateString ?? '') === ''
        ? dateToInteger(rightNow)
        : dateStringToInteger(workOrderForm.workOrderOpenDateString!),
      (workOrderForm.workOrderCloseDateString ?? '') === ''
        ? undefined
        : dateStringToInteger(workOrderForm.workOrderCloseDateString!),
      requestSession.user!.userName,
      rightNow.getTime(),
      requestSession.user!.userName,
      rightNow.getTime()
    )

  const workOrderId = result.lastInsertRowid as number

  if ((workOrderForm.lotOccupancyId ?? '') !== '') {
    await addWorkOrderLotOccupancy(
      {
        workOrderId,
        lotOccupancyId: workOrderForm.lotOccupancyId!
      },
      requestSession,
      database
    )
  }

  database.release()

  return workOrderId
}

export default addWorkOrder
