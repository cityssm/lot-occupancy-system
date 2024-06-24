import {
  type DateString,
  type TimeString,
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface UpdateWorkOrderCommentForm {
  workOrderCommentId: string | number
  workOrderCommentDateString: DateString
  workOrderCommentTimeString: TimeString
  workOrderComment: string
}

export default async function updateWorkOrderComment(
  commentForm: UpdateWorkOrderCommentForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update WorkOrderComments
        set workOrderCommentDate = ?,
        workOrderCommentTime = ?,
        workOrderComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderCommentId = ?`
    )
    .run(
      dateStringToInteger(commentForm.workOrderCommentDateString),
      timeStringToInteger(commentForm.workOrderCommentTimeString),
      commentForm.workOrderComment,
      user.userName,
      Date.now(),
      commentForm.workOrderCommentId
    )

  database.release()

  return result.changes > 0
}
