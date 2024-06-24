import {
  type DateString,
  type TimeString,
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface UpdateLotCommentForm {
  lotCommentId: string | number
  lotCommentDateString: DateString
  lotCommentTimeString: TimeString
  lotComment: string
}

export default async function updateLotComment(
  commentForm: UpdateLotCommentForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotComments
        set lotCommentDate = ?,
        lotCommentTime = ?,
        lotComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotCommentId = ?`
    )
    .run(
      dateStringToInteger(commentForm.lotCommentDateString),
      timeStringToInteger(commentForm.lotCommentTimeString),
      commentForm.lotComment,
      user.userName,
      Date.now(),
      commentForm.lotCommentId
    )

  database.release()

  return result.changes > 0
}
