import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

interface UpdateLotOccupancyCommentForm {
  lotOccupancyCommentId: string | number
  lotOccupancyCommentDateString: string
  lotOccupancyCommentTimeString: string
  lotOccupancyComment: string
}

export async function updateLotOccupancyComment(
  commentForm: UpdateLotOccupancyCommentForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyComments
        set lotOccupancyCommentDate = ?,
        lotOccupancyCommentTime = ?,
        lotOccupancyComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyCommentId = ?`
    )
    .run(
      dateStringToInteger(commentForm.lotOccupancyCommentDateString),
      timeStringToInteger(commentForm.lotOccupancyCommentTimeString),
      commentForm.lotOccupancyComment,
      user.userName,
      Date.now(),
      commentForm.lotOccupancyCommentId
    )

  database.release()

  return result.changes > 0
}

export default updateLotOccupancyComment
