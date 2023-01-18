import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateWorkOrderCommentForm {
  workOrderCommentId: string | number
  workOrderCommentDateString: string
  workOrderCommentTimeString: string
  workOrderComment: string
}

export async function updateWorkOrderComment(
  commentForm: UpdateWorkOrderCommentForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const rightNowMillis = Date.now()

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
      requestSession.user!.userName,
      rightNowMillis,
      commentForm.workOrderCommentId
    )

  database.release()

  return result.changes > 0
}

export default updateWorkOrderComment
