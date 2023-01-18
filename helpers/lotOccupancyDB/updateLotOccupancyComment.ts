import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupancyCommentForm {
  lotOccupancyCommentId: string | number
  lotOccupancyCommentDateString: string
  lotOccupancyCommentTimeString: string
  lotOccupancyComment: string
}

export async function updateLotOccupancyComment(
  commentForm: UpdateLotOccupancyCommentForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const rightNowMillis = Date.now()

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
      requestSession.user!.userName,
      rightNowMillis,
      commentForm.lotOccupancyCommentId
    )

  database.release()

  return result.changes > 0
}

export default updateLotOccupancyComment
