import { dateToInteger, dateToTimeInteger } from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface AddWorkOrderCommentForm {
  workOrderId: string
  workOrderComment: string
}

export default async function addWorkOrderComment(
  workOrderCommentForm: AddWorkOrderCommentForm,
  user: User
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
      dateToInteger(rightNow),
      dateToTimeInteger(rightNow),
      workOrderCommentForm.workOrderComment,
      user.userName,
      rightNow.getTime(),
      user.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}
