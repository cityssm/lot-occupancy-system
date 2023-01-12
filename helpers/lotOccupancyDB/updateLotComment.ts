import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotCommentForm {
  lotCommentId: string | number
  lotCommentDateString: string
  lotCommentTimeString: string
  lotComment: string
}

export function updateLotComment(
  commentForm: UpdateLotCommentForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const rightNowMillis = Date.now()

  const database = sqlite(databasePath)

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
      requestSession.user!.userName,
      rightNowMillis,
      commentForm.lotCommentId
    )

  database.close()

  return result.changes > 0
}

export default updateLotComment
