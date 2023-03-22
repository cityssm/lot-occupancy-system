import { acquireConnection } from './pool.js'

import * as dateTimeFunctions from '@cityssm/utils-datetime'

import type * as recordTypes from '../../types/recordTypes'

interface AddWorkOrderCommentForm {
  workOrderId: string
  workOrderComment: string
}

export async function addWorkOrderComment(
  workOrderCommentForm: AddWorkOrderCommentForm,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const database = await acquireConnection()

  const rightNow = new Date()

  const result = database
    .prepare(
      `insert into WorkOrderComments (
        workOrderId,
        workOrderCommentDate, workOrderCommentTime,
        workOrderComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      workOrderCommentForm.workOrderId,
      dateTimeFunctions.dateToInteger(rightNow),
      dateTimeFunctions.dateToTimeInteger(rightNow),
      workOrderCommentForm.workOrderComment,
      requestSession.user!.userName,
      rightNow.getTime(),
      requestSession.user!.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}

export default addWorkOrderComment
